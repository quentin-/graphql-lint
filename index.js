const AWS = require("aws-sdk");
const program = require("commander");

const lint = require("./src/lint");
const uploadSchema = require("./src/upload_schema");
const uploadOperations = require("./src/upload_operations");

function clientFromOptions(options) {
  return new AWS.S3({
    endpoint: options.aws_endpoint || process.env.AWS_ENDPOINT,
    accessKeyId: options.aws_access_key_id || process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: options.aws_secret_access_key || process.env.AWS_SECRET_ACCESS_KEY
  });
}

program
  .command("upload-schema <schema>")
  .description("upload a graphql schema")
  .option("--aws_endpoint [key]", "The AWS endpoint")
  .option("--aws_access_key_id [key]", "AWS access key id")
  .option("--aws_secret_access_key [key]", "AWS secret access key")
  .option("--tag [tag]", "The schema tag $name:$branch:$commit")
  .action((schema, options) => {
    uploadSchema(clientFromOptions(options), {
      schemaPath: schema,
      tag: options.tag
    });
  });

program
  .command("upload-operations <files...>")
  .description("upload graphql operations ")
  .option("--aws_endpoint [key]", "The AWS endpoint")
  .option("--aws_access_key_id [key]", "AWS access key id")
  .option("--aws_secret_access_key [key]", "AWS secret access key")
  .option("--tag [tag]", "The schema tag $name:$branch:$commit")
  .action((files, options) => {
    uploadOperations(clientFromOptions(options), {
      operationsFilePaths: files,
      tag: options.tag
    });
  });

program
  .command("lint <operations_tags...>")
  .description("upload graphql operations")
  .option("--aws_endpoint [key]", "The AWS endpoint")
  .option("--aws_access_key_id [key]", "AWS access key id")
  .option("--aws_secret_access_key [key]", "AWS secret access key")
  .option("--schema_tag [tag]", "The schema tag")
  .action((tags, options) => {
    lint(clientFromOptions(options), {
      schemaTag: options.schema_tag,
      operationsTags: tags
    });
  });

program.parse(process.argv);
