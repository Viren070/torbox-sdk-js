# GetUserDataOkResponse

**Properties**

| Name    | Type                      | Required | Description |
| :------ | :------------------------ | :------- | :---------- |
| data    | GetUserDataOkResponseData | ❌       |             |
| detail  | string                    | ❌       |             |
| success | boolean                   | ❌       |             |

# GetUserDataOkResponseData

**Properties**

| Name             | Type     | Required | Description |
| :--------------- | :------- | :------- | :---------- |
| authId           | string   | ❌       |             |
| baseEmail        | string   | ❌       |             |
| cooldownUntil    | string   | ❌       |             |
| createdAt        | string   | ❌       |             |
| customer         | string   | ❌       |             |
| email            | string   | ❌       |             |
| id               | number   | ❌       |             |
| isSubscribed     | boolean  | ❌       |             |
| plan             | number   | ❌       |             |
| premiumExpiresAt | string   | ❌       |             |
| server           | number   | ❌       |             |
| settings         | Settings | ❌       |             |
| totalDownloaded  | number   | ❌       |             |
| updatedAt        | string   | ❌       |             |
| userReferral     | string   | ❌       |             |

# Settings

**Properties**

| Name           | Type   | Required | Description |
| :------------- | :----- | :------- | :---------- |
| anothersetting | string | ❌       |             |
| setting        | string | ❌       |             |
