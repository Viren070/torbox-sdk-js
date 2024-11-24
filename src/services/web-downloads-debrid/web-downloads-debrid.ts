import { z } from 'zod';
import { BaseService } from '../base-service';
import { ContentType, HttpResponse, RequestConfig } from '../../http/types';
import { RequestBuilder } from '../../http/transport/request-builder';
import { SerializationStyle } from '../../http/serialization/base-serializer';
import { CreateWebDownloadRequest, createWebDownloadRequestRequest } from './models/create-web-download-request';
import {
  CreateWebDownloadOkResponse,
  createWebDownloadOkResponseResponse,
} from './models/create-web-download-ok-response';
import {
  ControlWebDownloadParams,
  GetWebDownloadCachedAvailabilityParams,
  GetWebDownloadListParams,
  RequestDownloadLink2Params,
} from './request-params';
import {
  GetWebDownloadListOkResponse,
  getWebDownloadListOkResponseResponse,
} from './models/get-web-download-list-ok-response';

export class WebDownloadsDebridService extends BaseService {
  /**
 * ### Overview
Creates a web download under your account. Simply send a link to any file on the internet. Once it has been checked, it will begin downloading assuming your account has available active download slots, and they aren't too large.

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @returns {Promise<HttpResponse<CreateWebDownloadOkResponse>>} Create Web Download Success
 */
  async createWebDownload(
    apiVersion: string,
    body: CreateWebDownloadRequest,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<CreateWebDownloadOkResponse>> {
    const request = new RequestBuilder<CreateWebDownloadOkResponse>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/webdl/createwebdownload')
      .setRequestSchema(createWebDownloadRequestRequest)
      .setResponseSchema(createWebDownloadOkResponseResponse)
      .setRequestContentType(ContentType.MultipartFormData)
      .setResponseContentType(ContentType.Json)
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
    return this.client.call<CreateWebDownloadOkResponse>(request);
  }

  /**
 * ### Overview
Controls a web download. By sending the web download's ID and the type of operation you want to perform, it will send that request to the debrid client.

Operations are either:

- **Delete** `deletes the download from the client and your account permanently`
    

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {string} [bypassCache] - 
 * @param {string} [id] - Determines the web download requested, will return an object rather than list. Optional.
 * @returns {Promise<HttpResponse<any>>} 
 */
  async controlWebDownload(
    apiVersion: string,
    body: any,
    params?: ControlWebDownloadParams,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/webdl/controlwebdownload')
      .setRequestSchema(z.any())
      .setResponseSchema(z.undefined())
      .setRequestContentType(ContentType.Json)
      .setResponseContentType(ContentType.Json)
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
      .addHeaderParam({ key: 'Content-Type', value: 'application/json' })
      .addBody(body)
      .build();
    return this.client.call<undefined>(request);
  }

  /**
 * ### Overview
Requests the download link from the server. Because downloads are metered, TorBox cannot afford to allow free access to the links directly. This endpoint opens the link for 1 hour for downloads. Once a download is started, the user has nearly unlilimited time to download the file. The 1 hour time limit is simply for starting downloads. This prevents long term link sharing.

### Authorization

Requires an API key as a parameter for the `token` parameter.
 * @param {string} apiVersion - 
 * @param {string} [token] - Your API Key
 * @param {string} [webId] - The web download's ID that you want to download
 * @param {string} [fileId] - The files's ID that you want to download
 * @param {string} [zipLink] - If you want a zip link. Required if no file_id. Takes precedence over file_id if both are given.
 * @param {string} [torrentFile] - If you want a .torrent file to be downloaded. Does not work with the zip_link option. Optional.
 * @param {string} [userIp] - The user's IP to determine the closest CDN. Optional.
 * @returns {Promise<HttpResponse<any>>} 
 */
  async requestDownloadLink2(
    apiVersion: string,
    params?: RequestDownloadLink2Params,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/webdl/requestdl')
      .setRequestSchema(z.any())
      .setResponseSchema(z.undefined())
      .setRequestContentType(ContentType.Json)
      .setResponseContentType(ContentType.Json)
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
        key: 'web_id',
        value: params?.webId,
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
      .build();
    return this.client.call<undefined>(request);
  }

  /**
 * ### Overview
Gets the user's web download list. This gives you the needed information to perform other usenet actions. Unlike Torrents, this information is updated on its own every 5 seconds for live web downloads.

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {string} [bypassCache] - Allows you to bypass the cached data, and always get fresh information. Useful if constantly querying for fresh download stats. Otherwise, we request that you save our database a few calls.
 * @param {string} [id] - Determines the torrent requested, will return an object rather than list. Optional.
 * @param {string} [offset] - Determines the offset of items to get from the database. Default is 0. Optional.
 * @param {string} [limit] - Determines the number of items to recieve per request. Default is 1000. Optional.
 * @returns {Promise<HttpResponse<GetWebDownloadListOkResponse>>} Get Usenet List Success
 */
  async getWebDownloadList(
    apiVersion: string,
    params?: GetWebDownloadListParams,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<GetWebDownloadListOkResponse>> {
    const request = new RequestBuilder<GetWebDownloadListOkResponse>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/webdl/mylist')
      .setRequestSchema(z.any())
      .setResponseSchema(getWebDownloadListOkResponseResponse)
      .setRequestContentType(ContentType.Json)
      .setResponseContentType(ContentType.Json)
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
    return this.client.call<GetWebDownloadListOkResponse>(request);
  }

  /**
 * ### Overview
Takes in a list of comma separated usenet hashes and checks if the web download is cached. This endpoint only gets a max of around 100 at a time, due to http limits in queries. If you want to do more, you can simply do more hash queries. Such as:  
`?hash=XXXX&hash=XXXX&hash=XXXX`

or `?hash=XXXX,XXXX&hash=XXXX&hash=XXXX,XXXX`  
and this will work too. Performance is very fast. Less than 1 second per 100. Time is approximately O(log n) time for those interested in taking it to its max. That is without caching as well. This endpoint stores a cache for an hour.

You may also pass a `format` parameter with the format you want the data in. Options are either `object` or `list`. You can view examples of both below.

To get the hash of a web download, pass the link through an md5 hash algo and it will return the proper hash for it.

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {string} [hash] - The list of web hashes you want to check. Comma seperated. To find the hash, md5 the link.

 * @param {string} [format] - Format you want the data in. Acceptable is either "object" or "list". List is the most performant option as it doesn't require modification of the list.
 * @returns {Promise<HttpResponse<any>>} 
 */
  async getWebDownloadCachedAvailability(
    apiVersion: string,
    params?: GetWebDownloadCachedAvailabilityParams,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/webdl/checkcached')
      .setRequestSchema(z.any())
      .setResponseSchema(z.undefined())
      .setRequestContentType(ContentType.Json)
      .setResponseContentType(ContentType.Json)
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
      .build();
    return this.client.call<undefined>(request);
  }
}
