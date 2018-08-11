const fs = require("fs");
const path = require("path");
const utils = require("./utils");

async function upload(s3, options) {
  const buckets = utils.bucketsFromTag(options.tag);

  for (const filePath of options.operationsFilePaths) {
    const content = fs.readFileSync(filePath).toString();

    if (!utils.isGraphQLOperation(content)) {
      throw new Error("not a valid operation");
    }
  }

  for (const bucket of buckets) {
    await s3.createBucket({ Bucket: bucket }).promise();
    const results = await s3.listObjects({ Bucket: bucket }).promise();
    const objects = results.Contents.map(content => ({ Key: content.Key }));
    await s3.deleteObjects({ Bucket: bucket, Delete: { Objects: objects } }).promise();

    for (const filePath of options.operationsFilePaths) {
      const content = fs.readFileSync(filePath).toString();
      await s3.upload({ Bucket: bucket, Key: path.basename(filePath), Body: content }).promise();
    }
  }

  console.log("done");
}

module.exports = upload;
