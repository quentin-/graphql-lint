const fs = require("fs");
const utils = require("./utils");

async function upload(s3, options) {
  const content = fs.readFileSync(options.schemaPath).toString();

  if (!utils.isJSONGraphQLSchema(content)) {
    throw new Error("file is not a JSON graphql schema");
  }

  const buckets = utils.bucketsFromTag(options.tag);

  for (const bucket of buckets) {
    await s3.createBucket({ Bucket: bucket }).promise();
    await s3.upload({ Bucket: bucket, Key: "schema", Body: content }).promise();
  }

  console.log("done");
}

module.exports = upload;
