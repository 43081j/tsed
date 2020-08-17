import {IResponseOptions} from "@tsed/common";
import {Header, Schema} from "swagger-schema-official";

declare global {
  namespace TsED {
    interface ResponseHeader extends Header {}

    /**
     * @deprecated
     */
    interface ResponseOptions {
      description: string;
      schema?: Schema;
      examples?: {[exampleName: string]: {}};
    }
  }
}

/**
 * @deprecated
 */
export interface ISwaggerResponses extends IResponseOptions {}
