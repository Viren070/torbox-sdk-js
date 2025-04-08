import { z } from 'zod';
import { BaseService } from '../base-service';
import { ContentType, HttpResponse, RequestConfig } from '../../http/types';
import { RequestBuilder } from '../../http/transport/request-builder';
import { SerializationStyle } from '../../http/serialization/base-serializer';
import { Environment } from '../../http/environment';
import { CreateTorrentRequest, createTorrentRequestRequest } from './models/create-torrent-request';
import { CreateTorrentOkResponse, createTorrentOkResponseResponse } from './models/create-torrent-ok-response';
import { __ } from './models/__';
import { _2 } from './models/_2';
import { ControlTorrentOkResponse, controlTorrentOkResponseResponse } from './models/control-torrent-ok-response';
import { _3 } from './models/_3';
import { _4 } from './models/_4';
import {
  RequestDownloadLinkOkResponse,
  requestDownloadLinkOkResponseResponse,
} from './models/request-download-link-ok-response';
import {
  ExportTorrentDataParams,
  GetTorrentCachedAvailabilityParams,
  GetTorrentInfoParams,
  GetTorrentListParams,
  RequestDownloadLinkParams,
} from './request-params';
import { GetTorrentListOkResponse, getTorrentListOkResponseResponse } from './models/get-torrent-list-ok-response';
import {
  GetTorrentCachedAvailabilityOkResponse,
  getTorrentCachedAvailabilityOkResponseResponse,
} from './models/get-torrent-cached-availability-ok-response';
import {
  ExportTorrentDataOkResponse,
  exportTorrentDataOkResponseResponse,
} from './models/export-torrent-data-ok-response';
import { _5 } from './models/_5';
import { _6 } from './models/_6';
import { GetTorrentInfoOkResponse, getTorrentInfoOkResponseResponse } from './models/get-torrent-info-ok-response';
import { _7 } from './models/_7';

export class TorrentsService extends BaseService {
  /**
 * ### Overview
Creates a torrent under your account. Simply send **either** a magnet link, or a torrent file. Once they have been checked, they will begin downloading assuming your account has available active download slots, and they aren't too large.  
  

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
 * @returns {Promise<HttpResponse<CreateTorrentOkResponse>>} Create Torrent Success / Create Torrent Queued / Create Torrent Active Limit Fail
 */
  async createTorrent(
    apiVersion: string,
    body: CreateTorrentRequest,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<CreateTorrentOkResponse>> {
    const request = new RequestBuilder()
      .setBaseUrl(requestConfig?.baseUrl || this.config.baseUrl || this.config.environment || Environment.DEFAULT)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/torrents/createtorrent')
      .setRequestSchema(createTorrentRequestRequest)
      .addAccessTokenAuth(this.config.token, 'Bearer')
      .setRequestContentType(ContentType.MultipartFormData)
      .addResponse({
        schema: createTorrentOkResponseResponse,
        contentType: ContentType.Json,
        status: 200,
      })
      .addError({
        error: __,
        contentType: ContentType.Json,
        status: 400,
      })
      .addError({
        error: _2,
        contentType: ContentType.Json,
        status: 500,
      })
      .setRetryAttempts(this.config, requestConfig)
      .setRetryDelayMs(this.config, requestConfig)
      .setResponseValidation(this.config, requestConfig)
      .addPathParam({
        key: 'api_version',
        value: apiVersion,
      })
      .addHeaderParam({ key: 'Content-Type', value: 'multipart/form-data' })
      .addBody(body)
      .build();
    return this.client.call<CreateTorrentOkResponse>(request);
  }

  /**
 * ### Overview
Controls a torrent. By sending the torrent's ID and the type of operation you want to perform, it will send that request to the torrent client.

Operations are either:

- **Reannounce** `reannounces the torrent to get new peers`
    
- **Delete** `deletes the torrent from the client and your account permanently`
    
- **Resume** `resumes a paused torrent`
    

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
 * @returns {Promise<HttpResponse<ControlTorrentOkResponse>>} Control Torrent Success
 */
  async controlTorrent(
    apiVersion: string,
    body: any,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<ControlTorrentOkResponse>> {
    const request = new RequestBuilder()
      .setBaseUrl(requestConfig?.baseUrl || this.config.baseUrl || this.config.environment || Environment.DEFAULT)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/torrents/controltorrent')
      .setRequestSchema(z.any())
      .addAccessTokenAuth(this.config.token, 'Bearer')
      .setRequestContentType(ContentType.Json)
      .addResponse({
        schema: controlTorrentOkResponseResponse,
        contentType: ContentType.Json,
        status: 200,
      })
      .addError({
        error: _3,
        contentType: ContentType.Json,
        status: 400,
      })
      .addError({
        error: _4,
        contentType: ContentType.Json,
        status: 500,
      })
      .setRetryAttempts(this.config, requestConfig)
      .setRetryDelayMs(this.config, requestConfig)
      .setResponseValidation(this.config, requestConfig)
      .addPathParam({
        key: 'api_version',
        value: apiVersion,
      })
      .addHeaderParam({ key: 'Content-Type', value: 'application/json' })
      .addBody(body)
      .build();
    return this.client.call<ControlTorrentOkResponse>(request);
  }

  /**
 * ### Overview
Requests the download link from the server. Because downloads are metered, TorBox cannot afford to allow free access to the links directly. This endpoint opens the link for 3 hours for downloads. Once a download is started, the user has nearly unlilimited time to download the file. The 1 hour time limit is simply for starting downloads. This prevents long term link sharing.

### Permalinks

Instead of generating many CDN urls by requesting this endpoint, you can instead create a permalink such as: `https://api.torbox.app/v1/api/torrents/requestdl?token=APIKEY&torrent_id=NUMBER&file_id=NUMBER&redirect=true` and when a user clicks on it, it will automatically redirect them to the CDN link. This saves requests and doesn't abuse the API. Use this method rather than saving CDN links as they are not permanent. To invalidate these permalinks, simply reset your API token or delete the item from your dashboard.

### Authorization

Requires an API key as a parameter for the `token` parameter.
 * @param {string} apiVersion - 
 * @param {string} [params.token] - Your API Key
 * @param {string} [params.torrentId] - The torrent's ID that you want to download
 * @param {string} [params.fileId] - The files's ID that you want to download
 * @param {string} [params.zipLink] - If you want a zip link. Required if no file_id. Takes precedence over file_id if both are given.
 * @param {string} [params.torrentFile] - If you want a .torrent file to be downloaded. Does not work with the zip_link option. Optional.
 * @param {string} [params.userIp] - The user's IP to determine the closest CDN. Optional.
 * @param {string} [params.redirect] - If you want to redirect the user to the CDN link. This is useful for creating permalinks so that you can just make this request URL the link.
 * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
 * @returns {Promise<HttpResponse<RequestDownloadLinkOkResponse>>} Request Download Link Success
 */
  async requestDownloadLink(
    apiVersion: string,
    params?: RequestDownloadLinkParams,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<RequestDownloadLinkOkResponse>> {
    const request = new RequestBuilder()
      .setBaseUrl(requestConfig?.baseUrl || this.config.baseUrl || this.config.environment || Environment.DEFAULT)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/torrents/requestdl')
      .setRequestSchema(z.any())
      .addAccessTokenAuth(this.config.token, 'Bearer')
      .setRequestContentType(ContentType.Json)
      .addResponse({
        schema: requestDownloadLinkOkResponseResponse,
        contentType: ContentType.Json,
        status: 200,
      })
      .setRetryAttempts(this.config, requestConfig)
      .setRetryDelayMs(this.config, requestConfig)
      .setResponseValidation(this.config, requestConfig)
      .addPathParam({
        key: 'api_version',
        value: apiVersion,
      })
      .addQueryParam({
        key: 'token',
        value: params?.token,
      })
      .addQueryParam({
        key: 'torrent_id',
        value: params?.torrentId,
      })
      .addQueryParam({
        key: 'file_id',
        value: params?.fileId,
      })
      .addQueryParam({
        key: 'zip_link',
        value: params?.zipLink,
      })
      .addQueryParam({
        key: 'torrent_file',
        value: params?.torrentFile,
      })
      .addQueryParam({
        key: 'user_ip',
        value: params?.userIp,
      })
      .addQueryParam({
        key: 'redirect',
        value: params?.redirect,
      })
      .build();
    return this.client.call<RequestDownloadLinkOkResponse>(request);
  }

  /**
 * ### Overview
Gets the user's torrent list. This gives you the needed information to perform other torrent actions. This information only gets updated every 600 seconds, or when the _Request Update On Torrent_ request is sent to the _relay API_.

#### Download States:

- "downloading" -> The torrent is currently downloading.
    
- "uploading" -> The torrent is currently seeding.
    
- "stalled (no seeds)" -> The torrent is trying to download, but there are no seeds connected to download from.
    
- "paused" -> The torrent is paused.
    
- "completed" -> The torrent is completely downloaded. Do not use this for download completion status.
    
- "cached" -> The torrent is cached from the server.
    
- "metaDL" -> The torrent is downloading metadata from the hoard.
    
- "checkingResumeData" -> The torrent is checking resumable data.
    

All other statuses are basic qBittorrent states. [Check out here for the full list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)#torrent-management).

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {string} [params.bypassCache] - Allows you to bypass the cached data, and always get fresh information. Useful if constantly querying for fresh download stats. Otherwise, we request that you save our database a few calls.
 * @param {string} [params.id] - Determines the torrent requested, will return an object rather than list. Optional.
 * @param {string} [params.offset] - Determines the offset of items to get from the database. Default is 0. Optional.
 * @param {string} [params.limit] - Determines the number of items to recieve per request. Default is 1000. Optional.
 * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
 * @returns {Promise<HttpResponse<GetTorrentListOkResponse>>} Get Torrent List Success
 */
  async getTorrentList(
    apiVersion: string,
    params?: GetTorrentListParams,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<GetTorrentListOkResponse>> {
    const request = new RequestBuilder()
      .setBaseUrl(requestConfig?.baseUrl || this.config.baseUrl || this.config.environment || Environment.DEFAULT)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/torrents/mylist')
      .setRequestSchema(z.any())
      .addAccessTokenAuth(this.config.token, 'Bearer')
      .setRequestContentType(ContentType.Json)
      .addResponse({
        schema: getTorrentListOkResponseResponse,
        contentType: ContentType.Json,
        status: 200,
      })
      .setRetryAttempts(this.config, requestConfig)
      .setRetryDelayMs(this.config, requestConfig)
      .setResponseValidation(this.config, requestConfig)
      .addPathParam({
        key: 'api_version',
        value: apiVersion,
      })
      .addQueryParam({
        key: 'bypass_cache',
        value: params?.bypassCache,
      })
      .addQueryParam({
        key: 'id',
        value: params?.id,
      })
      .addQueryParam({
        key: 'offset',
        value: params?.offset,
      })
      .addQueryParam({
        key: 'limit',
        value: params?.limit,
      })
      .build();
    return this.client.call<GetTorrentListOkResponse>(request);
  }

  /**
 * ### Overview
Takes in a list of comma separated torrent hashes and checks if the torrent is cached. This endpoint only gets a max of around 100 at a time, due to http limits in queries. If you want to do more, you can simply do more hash queries. Such as:  
`?hash=XXXX&hash=XXXX&hash=XXXX`

or `?hash=XXXX,XXXX&hash=XXXX&hash=XXXX,XXXX`  
and this will work too. Performance is very fast. Less than 1 second per 100. Time is approximately O(log n) time for those interested in taking it to its max. That is without caching as well. This endpoint stores a cache for an hour.

You may also pass a `format` parameter with the format you want the data in. Options are either `object` or `list`. You can view examples of both below.

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {string} [params.hash] - The list of torrent hashes you want to check. Comma seperated.
 * @param {string} [params.format] - Format you want the data in. Acceptable is either "object" or "list". List is the most performant option as it doesn't require modification of the list.
 * @param {string} [params.listFiles] - Allows you to list the files found inside the cached data.
 * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
 * @returns {Promise<HttpResponse<GetTorrentCachedAvailabilityOkResponse>>} Get Torrent Cached Availability List With FIles Success / Get Torrent Cached Availability List Success / Get Torrent Cached Availability Object Success / Get Torrent Cached Availability Success Uncached
 */
  async getTorrentCachedAvailability(
    apiVersion: string,
    params?: GetTorrentCachedAvailabilityParams,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<GetTorrentCachedAvailabilityOkResponse>> {
    const request = new RequestBuilder()
      .setBaseUrl(requestConfig?.baseUrl || this.config.baseUrl || this.config.environment || Environment.DEFAULT)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/torrents/checkcached')
      .setRequestSchema(z.any())
      .addAccessTokenAuth(this.config.token, 'Bearer')
      .setRequestContentType(ContentType.Json)
      .addResponse({
        schema: getTorrentCachedAvailabilityOkResponseResponse,
        contentType: ContentType.Json,
        status: 200,
      })
      .setRetryAttempts(this.config, requestConfig)
      .setRetryDelayMs(this.config, requestConfig)
      .setResponseValidation(this.config, requestConfig)
      .addPathParam({
        key: 'api_version',
        value: apiVersion,
      })
      .addQueryParam({
        key: 'hash',
        value: params?.hash,
      })
      .addQueryParam({
        key: 'format',
        value: params?.format,
      })
      .addQueryParam({
        key: 'list_files',
        value: params?.listFiles,
      })
      .build();
    return this.client.call<GetTorrentCachedAvailabilityOkResponse>(request);
  }

  /**
 * ### Overview
Exports the magnet or torrent file. Requires a type to be passed. If type is **magnet**, it will return a JSON response with the magnet as a string in the _data_ key. If type is **file**, it will return a bittorrent file as a download. Not compatible with cached downloads.

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {string} [params.torrentId] - The torrent's ID.
 * @param {string} [params.type] - Either "magnet" or "file". Tells how the API what to get, and what to respond as. If magnet, it returns a JSON response with the magnet as a string in the data key. If file, it responds with a torrent file download.
 * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
 * @returns {Promise<HttpResponse<ExportTorrentDataOkResponse>>} Export Torrent Data Magnet / Export Torrent Data File Success
 */
  async exportTorrentData(
    apiVersion: string,
    params?: ExportTorrentDataParams,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<ExportTorrentDataOkResponse>> {
    const request = new RequestBuilder()
      .setBaseUrl(requestConfig?.baseUrl || this.config.baseUrl || this.config.environment || Environment.DEFAULT)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/torrents/exportdata')
      .setRequestSchema(z.any())
      .addAccessTokenAuth(this.config.token, 'Bearer')
      .setRequestContentType(ContentType.Json)
      .addResponse({
        schema: exportTorrentDataOkResponseResponse,
        contentType: ContentType.Json,
        status: 200,
      })
      .addError({
        error: _5,
        contentType: ContentType.Json,
        status: 400,
      })
      .addError({
        error: _6,
        contentType: ContentType.Json,
        status: 500,
      })
      .setRetryAttempts(this.config, requestConfig)
      .setRetryDelayMs(this.config, requestConfig)
      .setResponseValidation(this.config, requestConfig)
      .addPathParam({
        key: 'api_version',
        value: apiVersion,
      })
      .addQueryParam({
        key: 'torrent_id',
        value: params?.torrentId,
      })
      .addQueryParam({
        key: 'type',
        value: params?.type,
      })
      .build();
    return this.client.call<ExportTorrentDataOkResponse>(request);
  }

  /**
 * ### Overview
A general route that allows you to give a hash, and TorBox will return data about the torrent. This data is retrieved from the Bittorrent network, so expect it to take some time. If the request goes longer than 10 seconds, TorBox will cancel it. You can adjust this if you like, but the default is 10 seconds. This route is cached as well, so subsequent requests will be instant.

### Authorization

None required.
 * @param {string} apiVersion - 
 * @param {string} [params.hash] - Hash of the torrent you want to get info for. This is required.
 * @param {string} [params.timeout] - The amount of time you want TorBox to search for the torrent on the Bittorrent network. If the number of seeders is low or even zero, this value may be helpful to move up. Default is 10. Optional.
 * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
 * @returns {Promise<HttpResponse<GetTorrentInfoOkResponse>>} Get Torrent Info Success
 */
  async getTorrentInfo(
    apiVersion: string,
    params?: GetTorrentInfoParams,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<GetTorrentInfoOkResponse>> {
    const request = new RequestBuilder()
      .setBaseUrl(requestConfig?.baseUrl || this.config.baseUrl || this.config.environment || Environment.DEFAULT)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/torrents/torrentinfo')
      .setRequestSchema(z.any())
      .addAccessTokenAuth(this.config.token, 'Bearer')
      .setRequestContentType(ContentType.Json)
      .addResponse({
        schema: getTorrentInfoOkResponseResponse,
        contentType: ContentType.Json,
        status: 200,
      })
      .addError({
        error: _7,
        contentType: ContentType.Json,
        status: 500,
      })
      .setRetryAttempts(this.config, requestConfig)
      .setRetryDelayMs(this.config, requestConfig)
      .setResponseValidation(this.config, requestConfig)
      .addPathParam({
        key: 'api_version',
        value: apiVersion,
      })
      .addQueryParam({
        key: 'hash',
        value: params?.hash,
      })
      .addQueryParam({
        key: 'timeout',
        value: params?.timeout,
      })
      .build();
    return this.client.call<GetTorrentInfoOkResponse>(request);
  }
}
