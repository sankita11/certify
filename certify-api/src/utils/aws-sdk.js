const aws = require('aws-sdk'); 
const { v4: uuidv4 } =  require('uuid');

require('dotenv').config(); 

aws.config.update({
  region: process.env.region, 
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey:  process.env.AWSSecretKey
})

const S3_BUCKET = process.env.bucket;

exports.getS3SignedURL = (file, callback) => {

    const s3 = new aws.S3();  
    let fileName = uuidv4();
    const fileType = file.fileType;

    const fileExtensions = fileType.split(/\//)
    fileName += "." + fileExtensions[1]; 

    const s3Params = {
        Bucket: S3_BUCKET,
        Key: 'uploads/' + fileName,
        Expires: 1000,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            console.log(err);
            callback(err, null);
            return;
        }

        const urlData = {
          signedRequest: data,
          url: `https://${S3_BUCKET}.s3.amazonaws.com/uploads/${fileName}`
        };
        callback(null, urlData)
    });
}

// exports.moveAndDeleteFile = async (file) => {
//   const s3 = new aws.S3();

//   const copyparams = {
//       Bucket : S3_BUCKET,
//       CopySource : S3_BUCKET + "/temp/" + file, 
//       Key :   "uploads/" + file
//   };

//   await s3.copyObject(copyparams).promise();
  

//   const deleteparams = {
//       Bucket : S3_BUCKET,
//       Key : "temp/" + file
//   };

//   await s3.deleteObject(deleteparams).promise();

//   return `https://${S3_BUCKET}.s3.amazonaws.com/uploads/${file}`
// }


