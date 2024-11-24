import { z } from 'zod';
import { BaseService } from '../base-service';
import { ContentType, HttpResponse, RequestConfig } from '../../http/types';
import { RequestBuilder } from '../../http/transport/request-builder';
import { SerializationStyle } from '../../http/serialization/base-serializer';
import { GetUpStatusOkResponse, getUpStatusOkResponseResponse } from './models/get-up-status-ok-response';
import { GetStatsOkResponse, getStatsOkResponseResponse } from './models/get-stats-ok-response';

export class GeneralService extends BaseService {
  /**
 * ### Overview
Simply gets if the TorBox API is available for use or not. Also might include information about downtimes.

### Authorization

None needed.
 * @returns {Promise<HttpResponse<GetUpStatusOkResponse>>} Get Up Status Success
 */
  async getUpStatus(requestConfig?: RequestConfig): Promise<HttpResponse<GetUpStatusOkResponse>> {
    const request = new RequestBuilder<GetUpStatusOkResponse>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/')
      .setRequestSchema(z.any())
      .setResponseSchema(getUpStatusOkResponseResponse)
      .setRequestContentType(ContentType.Json)
      .setResponseContentType(ContentType.Json)
      .setRetryAttempts(this.config, requestConfig)
      .setRetryDelayMs(this.config, requestConfig)
      .setResponseValidation(this.config, requestConfig)
      .build();
    return this.client.call<GetUpStatusOkResponse>(request);
  }

  /**
 * ### Overview
Simply gets general stats about the TorBox service.

### Authorization

None needed.
 * @param {string} apiVersion - 
 * @returns {Promise<HttpResponse<GetStatsOkResponse>>} Get Stats Success
 */
  async getStats(apiVersion: string, requestConfig?: RequestConfig): Promise<HttpResponse<GetStatsOkResponse>> {
    const request = new RequestBuilder<GetStatsOkResponse>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/stats')
      .setRequestSchema(z.any())
      .setResponseSchema(getStatsOkResponseResponse)
      .setRequestContentType(ContentType.Json)
      .setResponseContentType(ContentType.Json)
      .setRetryAttempts(this.config, requestConfig)
      .setRetryDelayMs(this.config, requestConfig)
      .setResponseValidation(this.config, requestConfig)
      .addPathParam({
        key: 'api_version',
        value: apiVersion,
      })
      .build();
    return this.client.call<GetStatsOkResponse>(request);
  }
}
