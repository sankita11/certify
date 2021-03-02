# Certify API
This is a small scale Javascript based certify API service. This is written in [Node.js](https://nodejs.org/en/) and uses SQLite as databases

# How to use

### 1. Install Dependencies
```
npm install
```

### 2. Run API server
```
npm start
```

The server should be running on ```http://localhost:3001/```. The database will automatically be created if db file does not exist on startup

## Rest API Endpoints

#### ```GET```

* ```/certificate/all```: Retrieve all stored certificates
* ```/certificate/:id```: Retrieves the certificate corresponding to the id provided

#### ```POST```

* ```/certificate```: Adds an entry

REQUEST BODY:

{
   "title":"title",
   "productionYear":"2000",
   "artist":{
      "firstName":"FIRST NAME",
      "lastName":"LAST NAME"
   },
   "file":{
      "url":"URL",
      "fileSize":10000,
      "fileType":"image/png"
   }
}

* ```/certificate/:id```: Updates an existing entry

REQUEST BODY:

{
   "title":"title",
   "productionYear":"2000",
   "fileID":0,
   "artistID" : 2,
   "artist":{
      "firstName":"FIRST NAME",
      "lastName":"LAST NAME"
   },
   "file":{
      "url":"URL",
      "fileSize":10000,
      "fileType":"image/png"
   }
}

* ```/upload```: Get S3 signed URL to upload the file

{
  "fileName": "FILE NAME",
  "fileType": "FILE TYPE"
}





