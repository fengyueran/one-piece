import axios, { CancelTokenSource } from 'axios';

import { formatBytesAsReadableSize } from './format-bytes-as-readable-size';

const getRandomFloat = (min: number, max: number, decimalPlaces: number) => {
  const precision = Math.pow(10, decimalPlaces);
  return Math.floor((Math.random() * (max - min + 1) + min) * precision) / precision;
};

//byte/s
const generateSpeedWithCap = (speed: number) => {
  const limit = 1024 * 1024 * 20; //20M;
  if (speed > limit) {
    return getRandomFloat(1, 10, 2) * 1024 * 1024;
  }
  return speed;
};

export interface Chunk {
  number: number;
  blob: Blob;
  filename: string;
  relativePath: string;
  totalSize: number;
  count: number;
  chunkIndexInBatch: number;
}

export enum UploadStatus {
  Waiting,
  Uploading,
  Merge,
  Error,
  Completed,
}

export enum Event {
  BatchCreated,
  BatchUpdated,
  BatchCanceled,
  BatchError,
  BatchCompleted,
}

const calcTotalSize = (files: File[]) => {
  return files.reduce((p, c) => {
    return p + c.size;
  }, 0);
};

const sum = (nums: number[]) => {
  return nums.reduce((p, c) => {
    return p + c;
  }, 0);
};

const makeFilesChunks = (files: File[], chunkSize: number) => {
  let chunkIndexInBatch = -1;
  const makeFileChunks = (file: File) => {
    const count = Math.ceil(file.size / chunkSize);
    const chunks: Chunk[] = [];

    for (let i = 0; i < count; i++) {
      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
      chunkIndexInBatch++;
      chunks.push({
        blob: chunk,
        number: i + 1,
        filename: file.name,
        count,
        chunkIndexInBatch,
        totalSize: file.size,
        relativePath: file.webkitRelativePath || file.name,
      });
    }
    return chunks;
  };

  return files.reduce((p, c) => {
    return [...p, ...makeFileChunks(c)];
  }, [] as Chunk[]);
};

export abstract class BaseBatchUploader {
  private _paused = true;
  private _uploadingChunks: Chunk[] = [];
  private _completedChunkCount = 0;
  private _slidingWindowDuration = 5000;
  private _chunks: Chunk[] = [];
  private _chunksCount = 0;
  private _maxConcurrency = 4;
  private _cancelTokenSource: CancelTokenSource;
  private _chunkSize = 1024 * 1024 * 5; // 5MB 每片

  status = UploadStatus.Waiting;
  totalSize = 0;
  uploadSpeed?: string;
  uploadPercent = 0;
  totalLoaded = 0;
  chunksLoaded: number[] = [];
  speedMeasurements: { time: number; loaded: number }[] = [];

  constructor(private _multipartEndpoint: string, files: File[]) {
    this._chunks = makeFilesChunks(files, this._chunkSize);
    this._chunksCount = this._chunks.length;
    this.totalSize = calcTotalSize(files);
    this._cancelTokenSource = axios.CancelToken.source();
  }

  getCancelToken = () => {
    return this._cancelTokenSource.token;
  };

  startUpload = () => {
    this._paused = false;
    if (this._uploadingChunks.length >= this._maxConcurrency) return;

    const chunk = this._chunks.shift();
    if (chunk) {
      this._uploadingChunks.push(chunk);
      this._uploadChunk(chunk);
      this.startUpload();
    }
  };

  pause = () => {
    if (!this._paused) {
      this._cancelTokenSource.cancel();
      this.speedMeasurements = [];
      this._uploadingChunks.forEach(({ chunkIndexInBatch }) => {
        this.chunksLoaded[chunkIndexInBatch] = 0;
      });
      this.status = UploadStatus.Waiting;
      this._paused = true;
      this.onStateChange(Event.BatchUpdated);
    }
  };

  resume = () => {
    if (this._paused) {
      this.status = UploadStatus.Uploading;
      this._chunks = [...this._uploadingChunks, ...this._chunks];
      this._cancelTokenSource = axios.CancelToken.source();
      if (this._chunks.length) {
        this._uploadingChunks = [];
        this.startUpload();
        this.onStateChange(Event.BatchUpdated);
      } else {
        this.onStateChange(Event.BatchCompleted);
      }
    }
  };

  private clacSpeedAndPercent = (totalLoaded: number) => {
    const { speedMeasurements } = this;
    const now = Date.now();

    const foundIndex = speedMeasurements.findIndex(({ time }) => time === now);
    if (foundIndex >= 0) {
      speedMeasurements[foundIndex].loaded = totalLoaded;
    } else {
      speedMeasurements.push({ time: now, loaded: totalLoaded });
    }

    const cutoffTime = now - this._slidingWindowDuration;
    while (speedMeasurements.length > 0 && speedMeasurements[0].time < cutoffTime) {
      speedMeasurements.shift();
    }

    if (speedMeasurements.length > 1) {
      const duration =
        (speedMeasurements[speedMeasurements.length - 1].time - speedMeasurements[0].time) / 1000; // seconds
      const bytesLoaded =
        speedMeasurements[speedMeasurements.length - 1].loaded - speedMeasurements[0].loaded;
      const uploadSpeed = generateSpeedWithCap(bytesLoaded / duration); // bytes per second
      const uploadPercent = (100 * totalLoaded) / this.totalSize; //0-100

      return { uploadSpeed, uploadPercent };
    }
    return { uploadSpeed: 0, uploadPercent: 0 };
  };

  private _onUploadProgress = (progressEvent: { loaded: number }, chunk: Chunk) => {
    const { loaded } = progressEvent;

    this.chunksLoaded[chunk.chunkIndexInBatch] = loaded;
    const totalLoaded = sum(this.chunksLoaded);

    if (totalLoaded > this.totalLoaded) {
      this.totalLoaded = totalLoaded;
    }

    const { uploadSpeed, uploadPercent } = this.clacSpeedAndPercent(totalLoaded);

    if (uploadSpeed) {
      this.uploadSpeed = `${formatBytesAsReadableSize(uploadSpeed, 2)}/s`;
    }

    if (uploadPercent > this.uploadPercent) {
      this.uploadPercent = uploadPercent;
    }
    this.status = UploadStatus.Uploading;
    this.onStateChange(Event.BatchUpdated);
  };

  private _sendRequest = (formData: FormData, chunk: Chunk): Promise<void> =>
    new Promise((reslove, reject) => {
      {
        // eslint-disable-next-line
        const that = this;
        axios
          .post(this._multipartEndpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            cancelToken: that._cancelTokenSource.token,
            onUploadProgress: function (progressEvent) {
              that._onUploadProgress(progressEvent, chunk);
            },
          })
          .then(() => {
            reslove();
          })
          .catch(function (thrown) {
            if (axios.isCancel(thrown)) {
              console.log('Chunk canceled', chunk);
            } else {
              reject(thrown);
            }
          });
      }
    });

  _uploadChunk = async (chunk: Chunk) => {
    try {
      const formData = this.generateFormData(chunk);
      await this._sendRequest(formData, chunk);
      this._onChunkUploadCompleted(chunk);
    } catch (error) {
      console.error(error);
      this.pause();
      this.status = UploadStatus.Error;
      this.onStateChange(Event.BatchError);
    }
  };

  _onChunkUploadCompleted = (chunk: Chunk) => {
    this._completedChunkCount++;
    const index = this._uploadingChunks.findIndex((c) => c === chunk);
    if (index >= 0) {
      this._uploadingChunks.splice(index, 1);
    }
    if (this._completedChunkCount === this._chunksCount) {
      this.onStateChange(Event.BatchCompleted);
    } else {
      this.startUpload();
    }
  };

  protected abstract generateFormData: (chunk: Chunk) => FormData;
  protected abstract onStateChange: (eventType: Event) => void;
}
