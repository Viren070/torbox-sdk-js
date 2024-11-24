# RssFeedsService

A list of all methods in the `RssFeedsService` service. Click on the method name to view detailed information about that method.

| Methods                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [addRssFeed](#addrssfeed)         | ### Overview ### Authorization Requires an API key using the Authorization Bearer Header.                                                                                                                                                                                                                                                                                                                                                                                                          |
| [controlRssFeed](#controlrssfeed) | ### Overview Controls an RSS Feed. By sending the RSS feed's ID and the type of operation you want to perform, it will perform said action on the RSS feed checker. Operations are either: - **Update** `forces an update on the rss feed` - **Delete** `deletes the rss feed from your account permanently` - **Pause** `pauses checking the rss feed on the scan interval` - **Resume** `resumes a paused rss feed` ### Authorization Requires an API key using the Authorization Bearer Header. |
| [modifyRssFeed](#modifyrssfeed)   | ### Overview ### Authorization Requires an API key using the Authorization Bearer Header.                                                                                                                                                                                                                                                                                                                                                                                                          |

## addRssFeed

### Overview ### Authorization Requires an API key using the Authorization Bearer Header.

- HTTP Method: `POST`
- Endpoint: `/{api_version}/api/rss/addrss`

**Parameters**

| Name       | Type   | Required | Description       |
| :--------- | :----- | :------- | :---------------- |
| body       | any    | ❌       | The request body. |
| apiVersion | string | ✅       |                   |

**Example Usage Code Snippet**

```typescript
import { TorboxApi } from 'torbox-api';

(async () => {
  const torboxApi = new TorboxApi({
    token: 'YOUR_TOKEN',
  });

  const input = {};

  const { data } = await torboxApi.rssFeeds.addRssFeed('api_version');

  console.log(data);
})();
```

## controlRssFeed

### Overview Controls an RSS Feed. By sending the RSS feed's ID and the type of operation you want to perform, it will perform said action on the RSS feed checker. Operations are either: - **Update** `forces an update on the rss feed` - **Delete** `deletes the rss feed from your account permanently` - **Pause** `pauses checking the rss feed on the scan interval` - **Resume** `resumes a paused rss feed` ### Authorization Requires an API key using the Authorization Bearer Header.

- HTTP Method: `POST`
- Endpoint: `/{api_version}/api/rss/controlrss`

**Parameters**

| Name       | Type   | Required | Description       |
| :--------- | :----- | :------- | :---------------- |
| body       | any    | ❌       | The request body. |
| apiVersion | string | ✅       |                   |

**Example Usage Code Snippet**

```typescript
import { TorboxApi } from 'torbox-api';

(async () => {
  const torboxApi = new TorboxApi({
    token: 'YOUR_TOKEN',
  });

  const input = {};

  const { data } = await torboxApi.rssFeeds.controlRssFeed('api_version');

  console.log(data);
})();
```

## modifyRssFeed

### Overview ### Authorization Requires an API key using the Authorization Bearer Header.

- HTTP Method: `POST`
- Endpoint: `/{api_version}/api/rss/modifyrss`

**Parameters**

| Name       | Type   | Required | Description       |
| :--------- | :----- | :------- | :---------------- |
| body       | any    | ❌       | The request body. |
| apiVersion | string | ✅       |                   |

**Example Usage Code Snippet**

```typescript
import { TorboxApi } from 'torbox-api';

(async () => {
  const torboxApi = new TorboxApi({
    token: 'YOUR_TOKEN',
  });

  const input = {};

  const { data } = await torboxApi.rssFeeds.modifyRssFeed('api_version');

  console.log(data);
})();
```
