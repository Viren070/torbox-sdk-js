# GetTorrentInfo1OkResponse

**Properties**

| Name    | Type                          | Required | Description |
| :------ | :---------------------------- | :------- | :---------- |
| data    | GetTorrentInfo1OkResponseData | ❌       |             |
| detail  | string                        | ❌       |             |
| error   | any                           | ❌       |             |
| success | boolean                       | ❌       |             |

# GetTorrentInfo1OkResponseData

**Properties**

| Name     | Type         | Required | Description |
| :------- | :----------- | :------- | :---------- |
| files    | DataFiles3[] | ❌       |             |
| hash     | string       | ❌       |             |
| name     | string       | ❌       |             |
| peers    | number       | ❌       |             |
| seeds    | number       | ❌       |             |
| size     | number       | ❌       |             |
| trackers | any[]        | ❌       |             |

# DataFiles3

**Properties**

| Name | Type   | Required | Description |
| :--- | :----- | :------- | :---------- |
| name | string | ❌       |             |
| size | number | ❌       |             |
