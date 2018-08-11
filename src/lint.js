const utils = require("./utils");

async function lint(s3, options) {
  const result = await s3.getObject({ Bucket: options.schemaTag, Key: "schema" }).promise();
  const schema = JSON.parse(result.Body.toString());
  const errors = {};

  for (const bucket of options.operationsTags) {
    const results = await s3.listObjects({ Bucket: bucket }).promise();
    const keys = results.Contents.map(content => content.Key);

    for (const key of keys) {
      const operation = await s3.getObject({ Bucket: bucket, Key: key }).promise();
      const lintErrors = utils.lint(schema, operation.Body.toString());

      if (lintErrors.length > 0) {
        errors[key] = lintErrors;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    console.log(JSON.stringify(errors, null, 2));
    process.exit(1);
  } else {
    console.log("done");
    process.exit(0);
  }
}

module.exports = lint;
