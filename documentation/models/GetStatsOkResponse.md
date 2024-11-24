# GetStatsOkResponse

**Properties**

| Name    | Type                   | Required | Description |
| :------ | :--------------------- | :------- | :---------- |
| data    | GetStatsOkResponseData | ❌       |             |
| detail  | string                 | ❌       |             |
| error   | boolean                | ❌       |             |
| success | boolean                | ❌       |             |

# GetStatsOkResponseData

**Properties**

| Name                  | Type   | Required | Description |
| :-------------------- | :----- | :------- | :---------- |
| activeTorrents        | number | ❌       |             |
| activeUsenetDownloads | number | ❌       |             |
| activeWebDownloads    | number | ❌       |             |
| totalBytesDownloaded  | number | ❌       |             |
| totalBytesUploaded    | number | ❌       |             |
| totalDownloads        | number | ❌       |             |
| totalServers          | number | ❌       |             |
| totalTorrentDownloads | number | ❌       |             |
| totalUsenetDownloads  | number | ❌       |             |
| totalUsers            | number | ❌       |             |
| totalWebDownloads     | number | ❌       |             |
