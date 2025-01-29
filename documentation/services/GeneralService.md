# GeneralService

A list of all methods in the `GeneralService` service. Click on the method name to view detailed information about that method.

| Methods                     | Description                                                                                                                                            |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [getUpStatus](#getupstatus) | ### Overview Simply gets if the TorBox API is available for use or not. Also might include information about downtimes. ### Authorization None needed. |
| [getStats](#getstats)       | ### Overview Simply gets general stats about the TorBox service. ### Authorization None needed.                                                        |

## getUpStatus

### Overview Simply gets if the TorBox API is available for use or not. Also might include information about downtimes. ### Authorization None needed.

- HTTP Method: `GET`
- Endpoint: `/`

**Return Type**

`GetUpStatusOkResponse`

**Example Usage Code Snippet**

```typescript
import { TorboxApi } from '@torbox/torbox-api';

(async () => {
  const torboxApi = new TorboxApi({
    token: 'YOUR_TOKEN',
  });

  const { data } = await torboxApi.general.getUpStatus();

  console.log(data);
})();
```

## getStats

### Overview Simply gets general stats about the TorBox service. ### Authorization None needed.

- HTTP Method: `GET`
- Endpoint: `/{api_version}/api/stats`

**Parameters**

| Name       | Type   | Required | Description |
| :--------- | :----- | :------- | :---------- |
| apiVersion | string | ✅       |             |

**Return Type**

`GetStatsOkResponse`

**Example Usage Code Snippet**

```typescript
import { TorboxApi } from '@torbox/torbox-api';

(async () => {
  const torboxApi = new TorboxApi({
    token: 'YOUR_TOKEN',
  });

  const { data } = await torboxApi.general.getStats('api_version');

  console.log(data);
})();
```
