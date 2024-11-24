# GetWebDownloadListOkResponse

**Properties**

| Name   | Type                               | Required | Description |
| :----- | :--------------------------------- | :------- | :---------- |
| data   | GetWebDownloadListOkResponseData[] | ❌       |             |
| detail | string                             | ❌       |             |

# GetWebDownloadListOkResponseData

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
| error            | string       | ❌       |             |
| eta              | number       | ❌       |             |
| expiresAt        | string       | ❌       |             |
| files            | DataFiles4[] | ❌       |             |
| hash             | string       | ❌       |             |
| id               | number       | ❌       |             |
| inactiveCheck    | number       | ❌       |             |
| name             | string       | ❌       |             |
| progress         | number       | ❌       |             |
| server           | number       | ❌       |             |
| size             | number       | ❌       |             |
| torrentFile      | boolean      | ❌       |             |
| updatedAt        | string       | ❌       |             |
| uploadSpeed      | number       | ❌       |             |

# DataFiles4

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
