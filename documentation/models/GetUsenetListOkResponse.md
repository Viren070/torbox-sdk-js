# GetUsenetListOkResponse

**Properties**

| Name    | Type                          | Required | Description |
| :------ | :---------------------------- | :------- | :---------- |
| data    | GetUsenetListOkResponseData[] | ❌       |             |
| detail  | string                        | ❌       |             |
| error   | any                           | ❌       |             |
| success | boolean                       | ❌       |             |

# GetUsenetListOkResponseData

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
