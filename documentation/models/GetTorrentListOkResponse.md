# GetTorrentListOkResponse

**Properties**

| Name    | Type                           | Required | Description |
| :------ | :----------------------------- | :------- | :---------- |
| data    | GetTorrentListOkResponseData[] | ❌       |             |
| detail  | string                         | ❌       |             |
| success | boolean                        | ❌       |             |

# GetTorrentListOkResponseData

**Properties**

| Name             | Type         | Required | Description |
| :--------------- | :----------- | :------- | :---------- |
| active           | boolean      | ❌       |             |
| authId           | string       | ❌       |             |
| availability     | number       | ❌       |             |
| createdAt        | string       | ❌       |             |
| downloadFinished | boolean      | ❌       |             |
| downloadPresent  | boolean      | ❌       |             |
| downloadSpeed    | number       | ❌       |             |
| downloadState    | string       | ❌       |             |
| eta              | number       | ❌       |             |
| expiresAt        | string       | ❌       |             |
| files            | DataFiles1[] | ❌       |             |
| hash             | string       | ❌       |             |
| id               | number       | ❌       |             |
| inactiveCheck    | number       | ❌       |             |
| magnet           | string       | ❌       |             |
| name             | string       | ❌       |             |
| peers            | number       | ❌       |             |
| progress         | number       | ❌       |             |
| ratio            | number       | ❌       |             |
| seeds            | number       | ❌       |             |
| server           | number       | ❌       |             |
| size             | number       | ❌       |             |
| torrentFile      | boolean      | ❌       |             |
| updatedAt        | string       | ❌       |             |
| uploadSpeed      | number       | ❌       |             |

# DataFiles1

**Properties**

| Name      | Type   | Required | Description |
| :-------- | :----- | :------- | :---------- |
| id        | number | ❌       |             |
| md5       | string | ❌       |             |
| mimetype  | string | ❌       |             |
| name      | string | ❌       |             |
| s3Path    | string | ❌       |             |
| shortName | string | ❌       |             |
| size      | number | ❌       |             |
