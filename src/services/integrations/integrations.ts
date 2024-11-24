import { z } from 'zod';
import { BaseService } from '../base-service';
import { ContentType, HttpResponse, RequestConfig } from '../../http/types';
import { RequestBuilder } from '../../http/transport/request-builder';
import { SerializationStyle } from '../../http/serialization/base-serializer';
import { GetAllJobsOkResponse, getAllJobsOkResponseResponse } from './models/get-all-jobs-ok-response';
import {
  GetAllJobsByHashOkResponse,
  getAllJobsByHashOkResponseResponse,
} from './models/get-all-jobs-by-hash-ok-response';

export class IntegrationsService extends BaseService {
  /**
 * ### Overview
Allows you to get an authorization token for using the user's account. Callback is located at `/oauth/{provider}/callback` which will verify the token recieved from the OAuth, then redirect you finally to `https://torbox.app/{provider}/success?token={token}&expires_in={expires_in}&expires_at={expires_at}`

#### Providers:

- "google" -> Google Drive
    
- "dropbox" -> Dropbox
    
- "discord" -> Discord
    
- "onedrive" -> Azure AD/Microsoft/Onedrive
    

### Authorization

No authorization needed. This is a whitelabel OAuth solution.
 * @param {string} apiVersion - 
 * @param {string} provider - 
 * @returns {Promise<HttpResponse<any>>} 
 */
  async authenticateOauth(
    apiVersion: string,
    provider: string,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/integration/oauth/{provider}')
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
      .addPathParam({
        key: 'provider',
        value: provider,
      })
      .build();
    return this.client.call<undefined>(request);
  }

  /**
 * ### Overview
Queues a job to upload the specified file or zip to the Google Drive account sent with the `google_token` key. To get this key, either get an OAuth2 token using `/oauth/google` or your own solution. Make sure when creating the OAuth link, you add the scope `https://www.googleapis.com/auth/drive.file` so TorBox has access to the user's Drive.

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @returns {Promise<HttpResponse<any>>} 
 */
  async queueGoogleDrive(
    apiVersion: string,
    body: any,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/integration/googledrive')
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
Queues a job to upload the specified file or zip to the Dropbox account sent with the `dropbox_token` key. To get this key, either get an OAuth2 token using `/oauth/dropbox` or your own solution. Make sure when creating the OAuth link you use the scopes `files.content.write` _(used for uploading to the user's account)_ and `sharing.write` _(used for creating the link)._

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @returns {Promise<HttpResponse<any>>} 
 */
  async queueDropbox(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/integration/dropbox')
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
Queues a job to upload the specified file or zip to the OneDrive sent with the `onedrive_token` key. To get this key, either get an OAuth2 token using `/oauth/onedrive` or your own solution. Make sure when creating the OAuth link you use the scope `files.readwrite.all`. This is compatible with all different types of Microsoft accounts.

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @returns {Promise<HttpResponse<any>>} 
 */
  async queueOnedrive(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/integration/onedrive')
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
Queues a job to upload the specified file or zip to the GoFile account sent with the `gofile_token` _(optional)_. To get this key, login to your GoFile account and go [here](https://gofile.io/myProfile). Copy the **Account API Token**. This is what you will use as the `gofile_token`, if you choose to use it. If you don't use an Account API Token, GoFile will simply create an anonymous file. This file will expire after inactivity.

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @returns {Promise<HttpResponse<any>>} 
 */
  async queueGofile(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/integration/gofile')
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
Queues a job to upload the specified file or zip to the 1Fichier account sent with the `onefichier_token` key (optional). To get this key you must be a Premium or Premium Gold member at 1Fichier. If you are upgraded, [go to the parameters page](https://1fichier.com/console/params.pl), and get an **API Key**. This is what you will use as the `onefichier_token`, if you choose to use it. If you don't use an API Key, 1Fichier will simply create an anonymous file.

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @returns {Promise<HttpResponse<any>>} 
 */
  async queue1fichier(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<undefined>> {
    const request = new RequestBuilder<undefined>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('POST')
      .setPath('/{api_version}/api/integration/1fichier')
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
Gets all the jobs attached to a user account. This is good for an overall view of the jobs, such as on a dashboard, or something similar.

### Statuses

- "pending" -> Upload is still waiting in the queue. Waiting for spot to upload.
- "uploading" -> Upload is uploading to the proper remote. Progress will be updated as upload continues.
- "completed" -> Upload has successfully been uploaded. Progress will be at 1, and the download URL will be populated.
    
- "failed" -> The upload has failed. Check the Detail key for information.
    

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @returns {Promise<HttpResponse<GetAllJobsOkResponse>>} Get All Jobs Success
 */
  async getAllJobs(apiVersion: string, requestConfig?: RequestConfig): Promise<HttpResponse<GetAllJobsOkResponse>> {
    const request = new RequestBuilder<GetAllJobsOkResponse>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/integration/jobs')
      .setRequestSchema(z.any())
      .setResponseSchema(getAllJobsOkResponseResponse)
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
    return this.client.call<GetAllJobsOkResponse>(request);
  }

  /**
 * ### Overview
Gets a specifc job using the Job's ID. To get the ID, you will have to Get All Jobs, and get the ID you want.

### Statuses

- "pending" -> Upload is still waiting in the queue. Waiting for spot to upload.
- "uploading" -> Upload is uploading to the proper remote. Progress will be updated as upload continues.
- "completed" -> Upload has successfully been uploaded. Progress will be at 1, and the download URL will be populated.
- "failed" -> The upload has failed. Check the Detail key for information.
    

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {string} jobId - 
 * @returns {Promise<HttpResponse<any>>} Get Specific Job Success
 */
  async getSpecificJob(
    apiVersion: string,
    jobId: string,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<string>> {
    const request = new RequestBuilder<string>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/integration/job/{job_id}')
      .setRequestSchema(z.any())
      .setResponseSchema(z.string())
      .setRequestContentType(ContentType.Json)
      .setResponseContentType(ContentType.Text)
      .setRetryAttempts(this.config, requestConfig)
      .setRetryDelayMs(this.config, requestConfig)
      .setResponseValidation(this.config, requestConfig)
      .addPathParam({
        key: 'api_version',
        value: apiVersion,
      })
      .addPathParam({
        key: 'job_id',
        value: jobId,
      })
      .build();
    return this.client.call<string>(request);
  }

  /**
 * ### Overview
Gets all jobs that match a specific hash. Good for checking on specific downloads such as a download page, that could contain a lot of jobs.

### Statuses

- "pending" -> Upload is still waiting in the queue. Waiting for spot to upload.
- "uploading" -> Upload is uploading to the proper remote. Progress will be updated as upload continues.
- "completed" -> Upload has successfully been uploaded. Progress will be at 1, and the download URL will be populated.
- "failed" -> The upload has failed. Check the Detail key for information.
    

### Authorization

Requires an API key using the Authorization Bearer Header.
 * @param {string} apiVersion - 
 * @param {string} hash - 
 * @returns {Promise<HttpResponse<GetAllJobsByHashOkResponse>>} Get All Jobs By Hash Success
 */
  async getAllJobsByHash(
    apiVersion: string,
    hash: string,
    requestConfig?: RequestConfig,
  ): Promise<HttpResponse<GetAllJobsByHashOkResponse>> {
    const request = new RequestBuilder<GetAllJobsByHashOkResponse>()
      .setBaseUrl(this.config)
      .setConfig(this.config)
      .setMethod('GET')
      .setPath('/{api_version}/api/integration/jobs/{hash}')
      .setRequestSchema(z.any())
      .setResponseSchema(getAllJobsByHashOkResponseResponse)
      .setRequestContentType(ContentType.Json)
      .setResponseContentType(ContentType.Json)
      .setRetryAttempts(this.config, requestConfig)
      .setRetryDelayMs(this.config, requestConfig)
      .setResponseValidation(this.config, requestConfig)
      .addPathParam({
        key: 'api_version',
        value: apiVersion,
      })
      .addPathParam({
        key: 'hash',
        value: hash,
      })
      .build();
    return this.client.call<GetAllJobsByHashOkResponse>(request);
  }
}
