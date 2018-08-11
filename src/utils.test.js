const fs = require("fs");
const path = require("path");
const utils = require("./utils");

describe("utils", () => {
  describe("bucketsFromTag", () => {
    describe("when tag is well formated", () => {
      it("return array of buckets keys", () => {
        expect(utils.bucketsFromTag("client:master:001")).toEqual(["client:master:001", "client:master:latest"]);
      });
    });

    describe("when tag is malformated", () => {
      it("throws an error", () => {
        expect(() => utils.bucketsFromTag("hello")).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe("isGraphQLOperation", () => {
    const TESTS = [
      {
        isOperation: true,
        operation: "{ books { id } }",
        name: "when operation is valid"
      },
      {
        isOperation: true,
        name: "when operation is valid",
        operation: "query getOneBook($id: String) { book(id: $id) { name } }"
      },
      {
        operation: "",
        isOperation: false,
        name: "when operation is not valid"
      },
      {
        isOperation: false,
        operation: "hello {}",
        name: "when operation is not valid"
      }
    ];

    TESTS.forEach(test => {
      describe(test.name, () => {
        it(`returns ${test.isOperation}`, () => {
          expect(utils.isGraphQLOperation(test.operation)).toEqual(test.isOperation);
        });
      });
    });
  });

  describe("isJSONGraphQLSchema", () => {
    beforeAll(() => {
      this.schema = fs.readFileSync(path.resolve(__dirname, "../example/schema.json")).toString();
    });

    describe("when it is a JSON graphql schema", () => {
      it("returns true", () => {
        expect(utils.isJSONGraphQLSchema(this.schema)).toEqual(true);
      });
    });

    describe("when it is not a JSON GraphQL schema", () => {
      expect(utils.isJSONGraphQLSchema("wat")).toEqual(false);
    });
  });
});
