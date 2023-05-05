import { forEach } from 'lodash-es';
import { Locator, AnyOption, PayLoadType, PageData, FetchType, FetchFn } from '../../core';

const processBaseURL = (
  baseurl: string,
  urlWithAETitle: (url: string, AETitle: string) => string,
  option: AnyOption,
) => {
  const { AETitle } = option;
  let usedUrl = baseurl;
  if (AETitle) {
    usedUrl = urlWithAETitle(baseurl, AETitle);
  }
  return usedUrl;
};

interface StringMap {
  [attr: string]: string;
}

interface QueryParam {
  filter?: StringMap;
  includeField?: StringMap;
  sort?: StringMap[];
  limit?: number;
  offset?: number;
  fuzzymatching?: boolean;
}

const fetchList = async (
  urlFetch: FetchFn,
  url: string,
  option: AnyOption,
  queryParam: QueryParam,
) => {
  const params: Array<string> = [];

  const { filter, includeField, sort, limit, offset, fuzzymatching } = queryParam;
  if (filter) {
    forEach(filter, (v: string, k: string) => {
      params.push(`${k}=${v}`);
    });
  }
  if (includeField) {
    forEach(includeField, (v: string) => {
      params.push(`includefield=${v}`);
    });
  }
  if (sort) {
    params.push(`sort=${encodeURIComponent(JSON.stringify(sort))}`);
  }
  if (limit) {
    params.push(`limit=${limit}`);
  }
  if (offset) {
    params.push(`offset=${offset}`);
  }
  if (fuzzymatching) {
    params.push(`fuzzymatching=true`);
  }

  const data = await urlFetch({ url: `${url}${params.join('&')}` }, option);
  if (data.type === PayLoadType.PAGED_CONTENT) {
    data.getAny<PageData>().offset = offset || 0;
  }

  return data;
};

const fetchDicomInfo = async (
  urlFetch: FetchFn,
  inputBaseurl: string,
  urlWithAETitle: (url: string, AETitle: string) => string,
  type: string,
  locator: Locator,
  option: AnyOption,
) => {
  const { StudyInstanceUID, SeriesInstanceUID, ...queryParam } = locator;

  const baseurl = processBaseURL(inputBaseurl, urlWithAETitle, option);

  let url = null;
  // fetch study
  if (type === FetchType.SeriesInfo) {
    url = `${baseurl}/series?`;
  } else if (type === FetchType.InstanceInfo) {
    url = `${baseurl}/instances?`;
  } else if (type === FetchType.StudyInfo) {
    url = `${baseurl}/studies?`;
  } else {
    if (!StudyInstanceUID) {
      throw new Error('fetchDicomInfo, StudyInstanceUID not set');
    }
    if (!SeriesInstanceUID) {
      // fetch series
      url = `${baseurl}/studies/${StudyInstanceUID}/series?`;
    } else {
      // fetch instance
      url = `${baseurl}/studies/${StudyInstanceUID}/series/${SeriesInstanceUID}/instances?`;
    }
  }

  return fetchList(urlFetch, url, option, queryParam);
};

const fetchDicom = async (
  urlFetch: FetchFn,
  inputBaseurl: string,
  urlWithAETitle: (url: string, AETitle: string) => string,
  type: string,
  locator: Locator,
  option: AnyOption,
) => {
  const { StudyInstanceUID, SeriesInstanceUID, SOPInstanceUID } = locator;

  const baseurl = processBaseURL(inputBaseurl, urlWithAETitle, option);

  if (!StudyInstanceUID) {
    throw new Error('fetchDicom: need StudyInstanceUID');
  }
  let url;
  if (!SeriesInstanceUID) {
    // load study metadata
    if (type === FetchType.DicomInstance) {
      throw new Error('fetch DicomInstance need SeriesInstanceUID');
    }
    url = `${baseurl}/studies/${StudyInstanceUID}/metadata`;
  } else if (!SOPInstanceUID) {
    // load series metadata
    if (type === FetchType.DicomInstance) {
      throw new Error('fetch DicomInstance need SOPInstanceUID');
    }
    url = `${baseurl}/studies/${StudyInstanceUID}/series/${SeriesInstanceUID}/metadata`;
  } else if (type === FetchType.DicomInstance) {
    url = `${baseurl}/studies/${StudyInstanceUID}/series/${SeriesInstanceUID}/instances/${SOPInstanceUID}`;
  } else {
    url = `${baseurl}/studies/${StudyInstanceUID}/series/${SeriesInstanceUID}/instances/${SOPInstanceUID}/metadata`;
  }

  return urlFetch({ url }, option);
};

export const createDicomWebFetchers = (
  baseurl: string,
  urlFetch: FetchFn,
  urlWithAETitle: (url: string, AETitle: string) => string,
) => {
  return {
    fetchSeriesInfo: fetchDicomInfo.bind(
      undefined,
      urlFetch,
      baseurl,
      urlWithAETitle,
      FetchType.SeriesInfo,
    ),
    fetchInstanceInfo: fetchDicomInfo.bind(
      undefined,
      urlFetch,
      baseurl,
      urlWithAETitle,
      FetchType.InstanceInfo,
    ),
    fetchStudyInfo: fetchDicomInfo.bind(
      undefined,
      urlFetch,
      baseurl,
      urlWithAETitle,
      FetchType.StudyInfo,
    ),
    fetchDicomInfo: fetchDicomInfo.bind(
      undefined,
      urlFetch,
      baseurl,
      urlWithAETitle,
      FetchType.DicomInfo,
    ),
    fetchDicomMeta: fetchDicom.bind(
      undefined,
      urlFetch,
      baseurl,
      urlWithAETitle,
      FetchType.DicomMeta,
    ),
    fetchDicomInstance: fetchDicom.bind(
      undefined,
      urlFetch,
      baseurl,
      urlWithAETitle,
      FetchType.DicomInstance,
    ),
  };
};
