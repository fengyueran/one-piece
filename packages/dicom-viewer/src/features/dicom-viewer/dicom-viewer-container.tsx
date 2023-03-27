import React, { useEffect, useState, useRef } from 'react';
import * as ccloader from '@cc/loader';
import styled from 'styled-components';
import { clamp, clone, isEqualWith, isNumber } from 'lodash-es';
import { SceneModelTicker } from '@cc/viewers-reducer';

import {
  getDicom,
  makeImg3DByDicomBufferList,
  createDicomSceneModel,
  Plane,
  getBasicInfo,
} from './helpers';
import { DicomSceneModel } from './scene';
import { DicomViewer } from './dicom-viewer';
import {
  createDicomImageMaterial,
  DicomImageFormat,
  createDicomImageTexture,
} from './materiallibrary';

import * as three from 'three';
import { components, products, engine } from '@cc/viewers-dvtool';
import { image } from './image-loader';

const Container = styled.div`
  width: 500px;
  height: 500px;
  border: 1px solid #e8e8e8;
`;

const getImageFormat = (buffer: ccloader.TypedArray, useLinear?: boolean) => {
  if (useLinear) {
    return DicomImageFormat.FloatFormat;
  }
  const isUint8Buffer = buffer instanceof Uint8Array;
  if (isUint8Buffer) {
    return DicomImageFormat.Uint8Format;
  }
  // if (this.scene.getBackingCanvasType() === engine.BackingCanvasType.Webgl1) {
  //   return DicomImageFormat.FloatFormat;
  // }
  return DicomImageFormat.Int16Format;
};

const convertBuffer = (buffer: ccloader.TypedArray) => {
  const format = getImageFormat(buffer);
  if (format === DicomImageFormat.FloatFormat) {
    const ret = new Float32Array(buffer.length);
    for (let i = 0; i < buffer.length; i += 1) {
      ret[i] = buffer[i] / 65536 + 0.5;
    }
    return ret;
  }
  return buffer;
};

const createTexture = (image: image.Image2D<ccloader.TypedArray>) => {
  const format = getImageFormat(image.pixel);
  const useLinear = false;
  const isWebgl1 = false;
  return createDicomImageTexture(
    image.size[0],
    image.size[1],
    convertBuffer(image.pixel),
    format,
    useLinear,
    isWebgl1,
  );
};

interface LUTWindow {
  windowCenter: number;
  windowWidth: number;
}

export const deepFloatEqual = (a: unknown, b: unknown): boolean => {
  return isEqualWith(a, b, (l: number, r: number) => {
    if (isNumber(l) && isNumber(r)) {
      return Math.abs(l - r) < 0.0001;
    }
    return undefined;
  });
};
export class LUTWindowData extends engine.TSBehaviour {
  centerLimit: three.Vector2 = new three.Vector2(-65536, 65536);

  windowLimit: three.Vector2 = new three.Vector2(1, 65536);

  private mWindow: LUTWindow = {
    windowCenter: 300,
    windowWidth: 1000,
  };

  get data(): LUTWindow {
    return this.mWindow;
  }

  setData(v: LUTWindow): void {
    const newWindow = {
      windowCenter: clamp(v.windowCenter, this.centerLimit.x, this.centerLimit.y),
      windowWidth: clamp(v.windowWidth, this.windowLimit.x, this.windowLimit.y),
    };
    if (deepFloatEqual(this.mWindow, newWindow)) {
      return;
    }
    this.mWindow = newWindow;
    // this.gameObject.scene.nc.emit(windowChangedEvent, clone(newWindow));
  }

  addDiff(windowWidthDiff: number, windowCenterDiff: number): void {
    this.setData({
      windowCenter: this.data.windowCenter + windowCenterDiff,
      windowWidth: this.data.windowWidth + windowWidthDiff,
    });
  }
}

const run = (img3D: any, basicInfo: any, container: any) => {
  const scene = new three.Scene();
  const orthographicSize = (basicInfo.size[1] * basicInfo.spacing[1]) / 2;
  const halfWidth = orthographicSize * 1;
  const halfHeight = orthographicSize;
  const camera = new three.OrthographicCamera(
    -1 * halfWidth,
    1 * halfWidth,
    halfHeight,
    -halfHeight,
    0.1,
    1000,
  );

  camera.position.z = 400;

  const webGLRenderer = new three.WebGLRenderer();
  webGLRenderer.setClearColor(new three.Color(0x000));
  webGLRenderer.setSize(container.clientWidth, container.clientHeight);

  const window = { windowWidth: 1000, windowCenter: 300 };
  const windowData = new LUTWindowData();
  windowData.setData(window);

  const source = image.makeAxialLoader(img3D);
  source.request(100);
  const activeDisplayed = source.getActiveDisplayed();

  const imageTexture = createTexture(activeDisplayed!);

  const format = getImageFormat(activeDisplayed!.pixel);
  const material = createDicomImageMaterial(
    windowData.data,
    imageTexture,
    new three.Color(255, 255, 255),
    format,
  );

  const physicalSize = [
    basicInfo.size[0] * basicInfo.spacing[0],
    basicInfo.size[1] * basicInfo.spacing[1],
  ];
  const dupCount = [1, 1];
  const planeSize = { w: physicalSize[0] * dupCount[0], h: physicalSize[1] * dupCount[1] };
  const geometry = new three.PlaneBufferGeometry(planeSize.w, planeSize.h);

  // const uv = geometry.getAttribute('uv').array as Float32Array;
  // for (let i = 0; i < uv.length; i += 2) {
  //   if (uv[i] === 1) {
  //     // eslint-disable-next-line prefer-destructuring
  //     uv[i] = dupCount[0];
  //   }
  //   if (uv[i + 1] === 1) {
  //     // eslint-disable-next-line prefer-destructuring
  //     uv[i + 1] = dupCount[1];
  //   }
  // }
  var mesh = new three.Mesh(geometry, material);
  scene.add(mesh);

  container.appendChild(webGLRenderer.domElement);
  function render() {
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
  render();
};

export const DicomViewerContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const sceneModel = useRef<DicomSceneModel>();
  const basicInfo = useRef<any>();
  const crosshair = useRef<ccloader.image.SliceIndexAndCoords2D>();
  useEffect(() => {
    const start = async () => {
      console.log('loading');
      const bufferList = await getDicom();
      const img3D = await makeImg3DByDicomBufferList(bufferList);

      sceneModel.current = createDicomSceneModel(Plane.Axial, img3D);
      basicInfo.current = getBasicInfo(img3D, sceneModel.current);

      sceneModel.current.nc.on('crosshairChanged', (e: [number, number, number]) => {
        const coords2D = sceneModel.current!.info.coords3DTo2D(e);
        if (!crosshair.current) {
          setReady(true);
          crosshair.current = coords2D;
          console.log('finish');
        }
      });

      run(img3D, img3D.getAxialInfo(), containerRef.current);
    };
    start();
  }, []);

  useEffect(() => {
    const ticker = new SceneModelTicker([() => sceneModel.current!]);
    ticker.startTick();
    return ticker.destory;
  }, []);

  const attachParent = (parent: HTMLElement) => {
    sceneModel.current?.attachParentDom(parent);
  };
  const attachInput = (input: HTMLElement) => {
    sceneModel.current?.attachInputDom(input);
  };
  const detachParent = () => {
    sceneModel.current?.detachParentDom();
  };
  const detachInput = () => {
    sceneModel.current?.detachInputDom();
  };
  const scrollBarProps = {
    count: basicInfo?.current?.spaceInfo.count,
    crosshair: crosshair.current!,
  };
  const setCrosshair = (crosshair: ccloader.image.SliceIndexAndCoords2D) => {
    const coords3D = sceneModel.current?.info.coords2DTo3D(crosshair);

    if (coords3D) {
      sceneModel.current?.setCrosshair(coords3D);
    }
  };

  // return (
  //   <DicomViewer
  //     attachParent={attachParent}
  //     attachInput={attachInput}
  //     detachParent={detachParent}
  //     detachInput={detachInput}
  //     scrollBarProps={scrollBarProps}
  //     setCrosshair={setCrosshair}
  //     isViewerReady={ready && !!crosshair.current}
  //   />
  // );

  return <Container ref={containerRef} />;
};

export default DicomViewer;
