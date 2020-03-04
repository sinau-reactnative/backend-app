const AWS = require("aws-sdk");

const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;
const BUCKET_NAME = process.env.AWS_BUCKET;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

exports.uploadFile = (file, type, id) => {
  const params = {
    Bucket: BUCKET_NAME,
    ACL: "public-read",
    Key: `${id}-${type}.jpg`,
    Body: file.buffer
  };

  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    return data.Location;
  });
};
