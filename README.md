## React - AWS Cognito - MongoDb Stitch.

### Update src/config.json according to your aws and stitch configuration
```
{
  "cognito": {
    "REGION":"<REGION-AWS-USER-POOL>",
    "USER_POOL_ID":"<AWS-USER-POOL-ID>",
    "APP_CLIENT_ID":"<AWS-APP-CLIENT-ID>"
  },
  "stitch": {
    "appId": "<STITCH-APP-ID>", 
    "jwtKey" : "<KEY-FOR-GENERATING-JWT>"
  }
}
```

## Running the project
```
npm i
npm run start
```


## Screenshots for AWS and Stitch setup

#### get user pool Id from aws
<img src="ss/poolid.png" width="50%">

#### AWS App Client ID
<img src="ss/appclientaws.png" width="50%">

#### get Stitch App Id
<img src="ss/stitchappId.png" width="50%">

#### setup Custom provider on stitch panel
>>stitch application >> users and providers
<img src="ss/customprovider1.png" width="50%">
<img src="ss/customprovider2.png" width="50%">

#### setup secret key on stitch panel
<img src="ss/addsecret1.png" width="50%">
<img src="ss/addsecret2.png" width="50%">
