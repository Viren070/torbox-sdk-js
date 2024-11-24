export interface RequestDownloadLink1Params {
  token?: string;
  usenetId?: string;
  fileId?: string;
  zipLink?: string;
  torrentFile?: string;
}

export interface GetUsenetListParams {
  bypassCache?: string;
  id?: string;
  offset?: string;
  limit?: string;
}

export interface GetUsenetCachedAvailabilityParams {
  hash?: string;
  format?: string;
}
