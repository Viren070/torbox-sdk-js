# CreateTorrentOkResponse

**Properties**

| Name    | Type                        | Required | Description |
| :------ | :-------------------------- | :------- | :---------- |
| data    | CreateTorrentOkResponseData | ❌       |             |
| detail  | string                      | ❌       |             |
| error   | any                         | ❌       |             |
| success | boolean                     | ❌       |             |

# CreateTorrentOkResponseData

**Properties**

| Name                   | Type   | Required | Description |
| :--------------------- | :----- | :------- | :---------- |
| activeLimit            | number | ❌       |             |
| currentActiveDownloads | number | ❌       |             |
| hash                   | string | ❌       |             |
| name                   | string | ❌       |             |
| queuedId               | number | ❌       |             |
| torrentId              | number | ❌       |             |
