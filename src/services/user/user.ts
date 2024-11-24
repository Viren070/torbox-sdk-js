import { z } from 'zod';
import { BaseService } from '../base-service';
import { ContentType, HttpResponse, RequestConfig } from '../../http/types';
import { RequestBuilder } from '../../http/transport/request-builder';
import { SerializationStyle } from '../../http/serialization/base-serializer';
import { GetUserDataOkResponse, getUserDataOkResponseResponse } from './models/get-user-data-ok-response';
import { AddReferralToAccountParams, GetUserDataParams } from './request-params';
import {
  AddReferralToAccountOkResponse,
  addReferralToAccountOkResponseResponse,
} from './models/add-referral-to-account-ok-response';

export class UserService extends BaseService {
  /**
 * ### Overview
If you want a new API token, or your old one has been compromised, you may request a new one. If you happen to forget the token, go the [TorBox settings page ](https://torbox.app/settings) and copy the current one. If this still doesn't work, you may contact us at our support email for a new one.

### Authorization

Requires an API key using the Authorization Bearer Header as well as passing the `session_token` from the website to be passed in the body. You can find the `session_token` in the localStorage of your browser on any TorBox.app page under the key `torbox_session_token`. This is a temporary token that only lasts for 1 hour, which is why it is used here to verify the identity of a user as well as their API token.
 * @param {string} apiVersion - 
 * @returns {Promise<HttpResponse<any>>} 
 */
  async refreshApiToken(
    apiVersion: string,
    body: any,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/user/refreshtoken')
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
Gets a users account data and information.

### Plans

`0` is Free plan

`1` is Essential plan (_$3 plan_)

`2` is Pro plan (_$10 plan_)

`3` is Standard plan (_$5 plan_)

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {string} [settings] - Allows you to retrieve user settings.
 * @returns {Promise<HttpResponse<GetUserDataOkResponse>>} Get User Data Success / Get User Data Settings Success
 */
  async getUserData(
    apiVersion: string,
    params?: GetUserDataParams,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<GetUserDataOkResponse>> {
    const request = new RequestBuilder<GetUserDataOkResponse>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/user/me')
      .setRequestSchema(z.any())
      .setResponseSchema(getUserDataOkResponseResponse)
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
        key: 'settings',
        value: params?.settings,
      })
      .build();
    return this.client.call<GetUserDataOkResponse>(request);
  }

  /**
   * Add Referral To Account
   * @param {string} apiVersion -
   * @param {string} [referral] - A referral code. Must be UUID.
   * @returns {Promise<HttpResponse<AddReferralToAccountOkResponse>>} Add Referral To Account Success
   */
  async addReferralToAccount(
    apiVersion: string,
    params?: AddReferralToAccountParams,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<AddReferralToAccountOkResponse>> {
    const request = new RequestBuilder<AddReferralToAccountOkResponse>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/user/addreferral')
      .setRequestSchema(z.any())
      .setResponseSchema(addReferralToAccountOkResponseResponse)
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
        key: 'referral',
        value: params?.referral,
      })
      .build();
    return this.client.call<AddReferralToAccountOkResponse>(request);
  }
}
