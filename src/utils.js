const graphql = require("graphql");
const language = require("graphql/language");
const validation = require("graphql/validation");
const parser = require("graphql/language/parser");

function isJSONGraphQLSchema(content) {
  try {
    graphql.buildClientSchema(JSON.parse(content));
  } catch (e) {
    return false;
  }

  return true;
}

function isValidTag(tag) {
  const parts = tag.split(":");

  if (parts.length !== 3) {
    return false;
  }

  return parts.every(part => part.length > 0);
}

function parseTag(tag) {
  if (!isValidTag(tag)) {
    throw new Error("tag is not valid");
  }

  const parts = tag.split(":");

  return {
    name: parts[0],
    branch: parts[1],
    commit: parts[2]
  };
}

function bucketsFromTag(tag) {
  const parsedTag = parseTag(tag);
  const parsedTags = [parsedTag, { ...parsedTag, commit: "latest" }];
  return parsedTags.map(t => `${t.name}:${t.branch}:${t.commit}`);
}

function lint(schemaJSON, operationSDL) {
  const schema = graphql.buildClientSchema(schemaJSON);
  const operationAST = language.parse(operationSDL);
  return validation.validate(schema, operationAST);
}

function isGraphQLOperation(content) {
  try {
    parser.parse(content);
  } catch (e) {
    return false;
  }

  return true;
}

module.exports = {
  isJSONGraphQLSchema,
  isGraphQLOperation,
  bucketsFromTag,
  lint
};
