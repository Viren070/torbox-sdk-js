import { z } from 'zod';
import { BaseService } from '../base-service';
import { ContentType, HttpResponse, RequestConfig } from '../../http/types';
import { RequestBuilder } from '../../http/transport/request-builder';
import { SerializationStyle } from '../../http/serialization/base-serializer';
import {
  CreateUsenetDownloadRequest,
  createUsenetDownloadRequestRequest,
} from './models/create-usenet-download-request';
import {
  CreateUsenetDownloadOkResponse,
  createUsenetDownloadOkResponseResponse,
} from './models/create-usenet-download-ok-response';
import { GetUsenetCachedAvailabilityParams, GetUsenetListParams, RequestDownloadLink1Params } from './request-params';
import { GetUsenetListOkResponse, getUsenetListOkResponseResponse } from './models/get-usenet-list-ok-response';

export class UsenetService extends BaseService {
  /**
 * ### Overview
Creates a usenet download under your account. Simply send **either** a link, or an nzb file. Once they have been checked, they will begin downloading assuming your account has available active download slots, and they aren't too large.

#### Post Processing Options:

All post processing options that the Usenet client will perform before TorBox's own processing to make the files available. It is recommended you either don't send this parameter, or keep it at `-1` for default, which will give only the wanted files.

- `-1`, Default. This runs repairs, and extractions as well as deletes the source files leaving only the wanted downloaded files.
    
- `0`, None. No post-processing at all. Just download all the files (including all PAR2). TorBox will still do its normal processing to make the download available, but no repairs, or extraction will take place.
    
- `1`, Repair. Download files and do a PAR2 verification. If the verification fails, download more PAR2 files and attempt to repair the files.
    
- `2`, Repair and Unpack. Download all files, do a PAR2 verification and unpack the files. The final folder will also include the RAR and ZIP files.
    
- `3`, Repair, Unpack and Delete. Download all files, do a PAR2 verification, unpack the files to the final folder and delete the source files.
    

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @returns {Promise<HttpResponse<CreateUsenetDownloadOkResponse>>} Create Usenet Download
 */
  async createUsenetDownload(
    apiVersion: string,
    body: CreateUsenetDownloadRequest,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<CreateUsenetDownloadOkResponse>> {
    const request = new RequestBuilder<CreateUsenetDownloadOkResponse>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/usenet/createusenetdownload')
      .setRequestSchema(createUsenetDownloadRequestRequest)
      .setResponseSchema(createUsenetDownloadOkResponseResponse)
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
    return this.client.call<CreateUsenetDownloadOkResponse>(request);
  }

  /**
 * ### Overview
Controls a usenet download. By sending the usenet download's ID and the type of operation you want to perform, it will send that request to the usenet client.

Operations are either:

- **Delete** `deletes the nzb from the client and your account permanently`
    
- **Pause** `pauses a nzb's download`
    
- **Resume** `resumes a paused usenet download`
    

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @returns {Promise<HttpResponse<any>>} 
 */
  async controlUsenetDownload(
    apiVersion: string,
    body: any,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/usenet/controlusenetdownload')
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
 * @param {string} [usenetId] - The usenet download's ID that you want to download
 * @param {string} [fileId] - The files's ID that you want to download
 * @param {string} [zipLink] - If you want a zip link. Required if no file_id. Takes precedence over file_id if both are given.
 * @param {string} [torrentFile] - If you want a .torrent file to be downloaded. Does not work with the zip_link option. Optional.
 * @returns {Promise<HttpResponse<any>>} 
 */
  async requestDownloadLink1(
    apiVersion: string,
    params?: RequestDownloadLink1Params,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/usenet/requestdl')
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
        key: 'usenet_id',
        value: params?.usenetId,
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
      .build();
    return this.client.call<undefined>(request);
  }

  /**
 * ### Overview
Gets the user's usenet download list. This gives you the needed information to perform other usenet actions. Unlike Torrents, this information is updated on its own every 5 seconds for live usenet downloads.

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {string} [bypassCache] - Allows you to bypass the cached data, and always get fresh information. Useful if constantly querying for fresh download stats. Otherwise, we request that you save our database a few calls.
 * @param {string} [id] - Determines the usenet download requested, will return an object rather than list. Optional.
 * @param {string} [offset] - Determines the offset of items to get from the database. Default is 0. Optional.
 * @param {string} [limit] - Determines the number of items to recieve per request. Default is 1000. Optional.
 * @returns {Promise<HttpResponse<GetUsenetListOkResponse>>} Get Usenet List Success
 */
  async getUsenetList(
    apiVersion: string,
    params?: GetUsenetListParams,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<GetUsenetListOkResponse>> {
    const request = new RequestBuilder<GetUsenetListOkResponse>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/usenet/mylist')
      .setRequestSchema(z.any())
      .setResponseSchema(getUsenetListOkResponseResponse)
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
    return this.client.call<GetUsenetListOkResponse>(request);
  }

  /**
 * ### Overview
Takes in a list of comma separated usenet hashes and checks if the usenet download is cached. This endpoint only gets a max of around 100 at a time, due to http limits in queries. If you want to do more, you can simply do more hash queries. Such as:  
`?hash=XXXX&hash=XXXX&hash=XXXX`

or `?hash=XXXX,XXXX&hash=XXXX&hash=XXXX,XXXX`  
and this will work too. Performance is very fast. Less than 1 second per 100. Time is approximately O(log n) time for those interested in taking it to its max. That is without caching as well. This endpoint stores a cache for an hour.

You may also pass a `format` parameter with the format you want the data in. Options are either `object` or `list`. You can view examples of both below.

To get the hash of a usenet download, pass the link or file through an md5 hash algo and it will return the proper hash for it.

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {string} [hash] - The list of usenet hashes you want to check. Comma seperated. To find the hash, md5 the link of the usenet link or file.
 * @param {string} [format] - Format you want the data in. Acceptable is either "object" or "list". List is the most performant option as it doesn't require modification of the list.
 * @returns {Promise<HttpResponse<any>>} 
 */
  async getUsenetCachedAvailability(
    apiVersion: string,
    params?: GetUsenetCachedAvailabilityParams,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/usenet/checkcached')
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
