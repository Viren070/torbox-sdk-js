![Logo](https://raw.githubusercontent.com/TorBox-App/torbox-sdk-js/main/assets/banner.png)

## Table of Contents

- [Setup \& Configuration](#setup--configuration)
  - [Supported Language Versions](#supported-language-versions)
  - [Installation](#installation)
  - [Authentication](#authentication)
    - [Access Token Authentication](#access-token-authentication)
      - [Setting the Access Token](#setting-the-access-token)
  - [Setting a Custom Timeout](#setting-a-custom-timeout)
- [Sample Usage](#sample-usage)
  - [Documentation](#documentation)
  - [Models](#models)

# Setup & Configuration

## Supported Language Versions

This SDK is compatible with the following versions: `TypeScript >= 4.8.4`

## Installation

To get started with the SDK, we recommend installing using `pnpm`:

```bash
pnpm install @torbox/torbox-api
```

## Authentication

### Access Token Authentication

The TorboxApi API uses an Access Token for authentication.

This token must be provided to authenticate your requests to the API.

#### Setting the Access Token

When you initialize the SDK, you can set the access token as follows as well as a few more variables:

```ts
const sdk = new TorboxApi({ token: 'YOUR_TOKEN', baseUrl: 'https://api.torbox.app' });
```

If you need to set or update the access token after initializing the SDK, you can use:

```ts
const sdk = new TorboxApi();
sdk.token = 'YOUR_TOKEN';
sdk.baseUrl = 'https://api.torbox.app';
```

## Setting a Custom Timeout

You can set a custom timeout for the SDK's HTTP requests as follows:

```ts
const torboxApi = new TorboxApi({ timeout: 10000 });
```

# Sample Usage

Below is a comprehensive example demonstrating how to authenticate and call a simple endpoint:

```ts
import { TorboxApi } from '@torbox/torbox-api';

(async () => {
  const torboxApi = new TorboxApi({
    token: 'YOUR_TOKEN',
    baseUrl: 'https://api.torbox.app';
  });

  const { data } = await torboxApi.general.getUpStatus();

  console.log(data);
})();
```

## Documentation

The SDK provides various services to interact with the API.

<details> 
<summary>Below is a list of all available services with links to their detailed documentation:</summary>

| Name                                                                             |
| :------------------------------------------------------------------------------- |
| [TorrentsService](documentation/services/TorrentsService.md)                     |
| [UsenetService](documentation/services/UsenetService.md)                         |
| [WebDownloadsDebridService](documentation/services/WebDownloadsDebridService.md) |
| [GeneralService](documentation/services/GeneralService.md)                       |
| [NotificationsService](documentation/services/NotificationsService.md)           |
| [UserService](documentation/services/UserService.md)                             |
| [RssFeedsService](documentation/services/RssFeedsService.md)                     |
| [IntegrationsService](documentation/services/IntegrationsService.md)             |

</details>

## Models

The SDK includes several models that represent the data structures used in API requests and responses. These models help in organizing and managing the data efficiently.

<details> 
<summary>Below is a list of all available models with links to their detailed documentation:</summary>

| Name                                                                                                     | Description |
| :------------------------------------------------------------------------------------------------------- | :---------- |
| [CreateTorrentRequest](documentation/models/CreateTorrentRequest.md)                                     |             |
| [CreateTorrentOkResponse](documentation/models/CreateTorrentOkResponse.md)                               |             |
| [ControlTorrentOkResponse](documentation/models/ControlTorrentOkResponse.md)                             |             |
| [ControlQueuedTorrentOkResponse](documentation/models/ControlQueuedTorrentOkResponse.md)                 |             |
| [RequestDownloadLinkOkResponse](documentation/models/RequestDownloadLinkOkResponse.md)                   |             |
| [GetTorrentListOkResponse](documentation/models/GetTorrentListOkResponse.md)                             |             |
| [GetTorrentCachedAvailabilityOkResponse](documentation/models/GetTorrentCachedAvailabilityOkResponse.md) |             |
| [SearchAllTorrentsFromScraperOkResponse](documentation/models/SearchAllTorrentsFromScraperOkResponse.md) |             |
| [ExportTorrentDataOkResponse](documentation/models/ExportTorrentDataOkResponse.md)                       |             |
| [GetTorrentInfoOkResponse](documentation/models/GetTorrentInfoOkResponse.md)                             |             |
| [CreateUsenetDownloadRequest](documentation/models/CreateUsenetDownloadRequest.md)                       |             |
| [CreateUsenetDownloadOkResponse](documentation/models/CreateUsenetDownloadOkResponse.md)                 |             |
| [GetUsenetListOkResponse](documentation/models/GetUsenetListOkResponse.md)                               |             |
| [CreateWebDownloadRequest](documentation/models/CreateWebDownloadRequest.md)                             |             |
| [CreateWebDownloadOkResponse](documentation/models/CreateWebDownloadOkResponse.md)                       |             |
| [GetWebDownloadListOkResponse](documentation/models/GetWebDownloadListOkResponse.md)                     |             |
| [GetUpStatusOkResponse](documentation/models/GetUpStatusOkResponse.md)                                   |             |
| [GetStatsOkResponse](documentation/models/GetStatsOkResponse.md)                                         |             |
| [GetNotificationFeedOkResponse](documentation/models/GetNotificationFeedOkResponse.md)                   |             |
| [GetUserDataOkResponse](documentation/models/GetUserDataOkResponse.md)                                   |             |
| [AddReferralToAccountOkResponse](documentation/models/AddReferralToAccountOkResponse.md)                 |             |
| [GetAllJobsOkResponse](documentation/models/GetAllJobsOkResponse.md)                                     |             |
| [GetAllJobsByHashOkResponse](documentation/models/GetAllJobsByHashOkResponse.md)                         |             |

</details>
