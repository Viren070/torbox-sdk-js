# QueuedService

A list of all methods in the `QueuedService` service. Click on the method name to view detailed information about that method.

| Methods                                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [getQueuedDownloads](#getqueueddownloads)         | ### Overview Retrieves all of a user's queued downloads by type. If you want to get all 3 types, "torrent", "usenet" and "webdl" then you will need to run this request 3 times, each with the different type. ### Authorization Requires an API key using the Authorization Bearer Header.                                                                                                                                   |
| [controlQueuedDownloads](#controlqueueddownloads) | ### Overview Controls a queued torrent. By sending the queued torrent's ID and the type of operation you want to perform, it will perform that action on the queued torrent. Operations are either: - **Delete** `deletes the queued download from your account` - **Start** `starts a queued download, cannot be used with the "all" parameter` ### Authorization Requires an API key using the Authorization Bearer Header. |

## getQueuedDownloads

### Overview Retrieves all of a user's queued downloads by type. If you want to get all 3 types, "torrent", "usenet" and "webdl" then you will need to run this request 3 times, each with the different type. ### Authorization Requires an API key using the Authorization Bearer Header.

- HTTP Method: `GET`
- Endpoint: `/{api_version}/api/queued/getqueued`

**Parameters**

| Name        | Type   | Required | Description                                                                                                                                                                                   |
| :---------- | :----- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiVersion  | string | ✅       |                                                                                                                                                                                               |
| bypassCache | string | ❌       | Allows you to bypass the cached data, and always get fresh information. Useful if constantly querying for fresh download stats. Otherwise, we request that you save our database a few calls. |
| id          | string | ❌       | Determines the queued download requested, will return an object rather than list. Optional.                                                                                                   |
| offset      | string | ❌       | Determines the offset of items to get from the database. Default is 0. Optional.                                                                                                              |
| limit       | string | ❌       | Determines the number of items to recieve per request. Default is 1000. Optional.                                                                                                             |
| type        | string | ❌       | The type of the queued download you want to retrieve. Can be "torrent", "usenet" or "webdl". Optional. Default is "torrent".                                                                  |

**Example Usage Code Snippet**

```typescript
import { TorboxApi } from '@torbox/torbox-api';

(async () => {
  const torboxApi = new TorboxApi({
    token: 'YOUR_TOKEN',
  });

  const { data } = await torboxApi.queued.getQueuedDownloads('api_version', {
    bypassCache: 'boolean',
    id: 'integer',
    offset: 'integer',
    limit: 'integer',
    type: 'string',
  });

  console.log(data);
})();
```

## controlQueuedDownloads

### Overview Controls a queued torrent. By sending the queued torrent's ID and the type of operation you want to perform, it will perform that action on the queued torrent. Operations are either: - **Delete** `deletes the queued download from your account` - **Start** `starts a queued download, cannot be used with the "all" parameter` ### Authorization Requires an API key using the Authorization Bearer Header.

- HTTP Method: `POST`
- Endpoint: `/{api_version}/api/queued/controlqueued`

**Parameters**

| Name       | Type   | Required | Description       |
| :--------- | :----- | :------- | :---------------- |
| body       | any    | ❌       | The request body. |
| apiVersion | string | ✅       |                   |

**Example Usage Code Snippet**

```typescript
import { TorboxApi } from '@torbox/torbox-api';

(async () => {
  const torboxApi = new TorboxApi({
    token: 'YOUR_TOKEN',
  });

  const input = {};

  const { data } = await torboxApi.queued.controlQueuedDownloads('api_version');

  console.log(data);
})();
```
