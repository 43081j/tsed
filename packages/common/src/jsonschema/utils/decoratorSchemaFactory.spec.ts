import {expect} from "chai";
import * as Sinon from "sinon";
import {JsonSchemesRegistry, PropertyMetadata} from "../../../src/jsonschema";
import {decoratorSchemaFactory} from "../../../src/jsonschema/utils/decoratorSchemaFactory";

class Test {
}

const sandbox = Sinon.createSandbox();
describe("decoratorSchemaFactory()", () => {
  describe("when it's a property", () => {
    beforeEach(() => {
      // @ts-ignore
      sandbox.stub(PropertyMetadata, "get").returns({schema: "schema"});
    });
    afterEach(() => {
      // @ts-ignore
      sandbox.restore();
    });

    it("should call PropertyMetadata", () => {
      const decoratorStub = Sinon.stub();
      const cbStub = Sinon.stub().returns(decoratorStub);

      decoratorSchemaFactory(cbStub)(Test, "test");

      expect(PropertyMetadata.get).to.have.been.calledWithExactly(Test, "test");
      expect(cbStub).to.have.been.calledWithExactly("schema", [Test, "test"]);
      expect(decoratorStub).to.have.been.calledWithExactly(Test, "test");
    });
  });

  describe("when it's is a class", () => {
    beforeEach(() => {
      // @ts-ignore
      sandbox.stub(JsonSchemesRegistry, "createIfNotExists");
    });
    afterEach(() => {
      // @ts-ignore
      sandbox.restore();
    });

    it("should call PropertyMetadata.get()", () => {
      const decoratorStub = Sinon.stub();
      const cbStub = Sinon.stub().returns(decoratorStub);

      decoratorSchemaFactory(cbStub)(Test);

      expect(JsonSchemesRegistry.createIfNotExists).to.have.been.calledWithExactly(Test);
    });
  });
});
