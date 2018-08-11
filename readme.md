# graphql-lint

graphql-lint is a CLI tool to upload and lint GraphQL schemas and operations (S3).

##### example

upload a schema and graphql operations:

```bash
> graphql-lint upload-schema     --tag my-graphql-server:master:001         ./example/schema.json
> graphql-lint upload-operations --tag my-graphql-client:feature-branch:001 ./example/*.gql
```

lint the server schema against a set of clients:

```bash
> graphql-lint lint --schema_tag my-graphql-server:master:latest my-graphql-client:feature-branch:001

  {
    "query_3.gql": [
      {
        "message": "Cannot query field \"fieldThatDoesNotExist\" on type \"Post\".",
        "locations": [
          {
            "line": 4,
            "column": 5
          }
        ]
      }
    ]
  }
```
