# GetTorrentInfoOkResponse

**Properties**

| Name    | Type                         | Required | Description |
| :------ | :--------------------------- | :------- | :---------- |
| data    | GetTorrentInfoOkResponseData | ❌       |             |
| detail  | string                       | ❌       |             |
| error   | any                          | ❌       |             |
| success | boolean                      | ❌       |             |

# GetTorrentInfoOkResponseData

**Properties**

| Name  | Type         | Required | Description |
| :---- | :----------- | :------- | :---------- |
| files | DataFiles2[] | ❌       |             |
| hash  | string       | ❌       |             |
| name  | string       | ❌       |             |
| size  | number       | ❌       |             |

# DataFiles2

**Properties**

| Name | Type   | Required | Description |
| :--- | :----- | :------- | :---------- |
| name | string | ❌       |             |
| size | number | ❌       |             |
