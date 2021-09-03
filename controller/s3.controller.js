const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const crypto = require("crypto");
const { promisify } = require("util");
const randomBytes = promisify(crypto.randomBytes);
const bucketName = "trimbaybucket";

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});

async function generateUploadURL() {
  const rawBytes = await randomBytes(32);
  const imageName = rawBytes.toString("hex");
  const imageNameExt = imageName + ".jpg";

  const params = {
    Bucket: bucketName,
    Key: imageNameExt,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
}

exports.s3Url = async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
};
