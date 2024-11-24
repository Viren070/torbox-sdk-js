export interface ControlWebDownloadParams {
  bypassCache?: string;
  id?: string;
}

export interface RequestDownloadLink2Params {
  token?: string;
  webId?: string;
  fileId?: string;
  zipLink?: string;
  torrentFile?: string;
}

export interface GetWebDownloadListParams {
  bypassCache?: string;
  id?: string;
  offset?: string;
  limit?: string;
}

export interface GetWebDownloadCachedAvailabilityParams {
  hash?: string;
  format?: string;
}
