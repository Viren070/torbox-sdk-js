export interface RequestDownloadLinkParams {
  token?: string;
  torrentId?: string;
  fileId?: string;
  zipLink?: string;
  torrentFile?: string;
}

export interface GetTorrentListParams {
  bypassCache?: string;
  id?: string;
  offset?: string;
  limit?: string;
}

export interface GetTorrentCachedAvailabilityParams {
  hash?: string;
  format?: string;
  listFiles?: string;
}

export interface SearchAllTorrentsFromScraperParams {
  query?: string;
}

export interface ExportTorrentDataParams {
  torrentId?: string;
  type?: string;
}

export interface GetTorrentInfoParams {
  hash?: string;
  timeout?: string;
}
