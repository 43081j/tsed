import {cleanObject, deepMerge, Type} from "@tsed/core";
import {IResponseOptions} from "../../interfaces/IResponseOptions";
import {EndpointFn} from "./endpointFn";

const isSuccessStatus = (code: number | undefined) => code && 200 <= code && code < 300;

/**
 * @ignore
 */
function mapStatusResponseOptions(args: any[]): any {
  const configuration: any = {};

  args.forEach((value: any) => {
    configuration[typeof value] = value;
  });

  const {number: code, object: options = {} as any, function: type} = configuration;

  if (type) {
    options.type = type;
  }

  return {
    ...options,
    code,
    type: options.type || options.use,
    collectionType: options.collectionType || options.collection
  };
}

/**
 * Define the returned type for the serialization.
 *
 * ::: warning
 * This decorator will be removed in v6 in favor of @@Returns@@ from @tsed/schema.
 * For v5 user, use @@Returns@@ decorator from @tsed/common then in v6 switch to @tsed/schema.
 * :::
 *
 * ```typescript
 * @Controller('/')
 * export class Ctrl {
 *    @Get('/')
 *    @ReturnType({code: 200, type: User, collectionType: Map})
 *    get(): Promise<Map<User>> { }
 * }
 *
 * ```
 *
 * @returns {Function}
 * @param response
 * @decorator
 * @operation
 * @response
 * @deprecated Use @Returns decorator from @tsed/schema
 */
export function ReturnType(response: Partial<IResponseOptions> = {}): Function {
  return EndpointFn(endpoint => {
    const {responses, statusCode} = endpoint;
    const code = response.code || statusCode; // implicit

    if (isSuccessStatus(response.code)) {
      const {response} = endpoint;
      responses.delete(statusCode);
      endpoint.statusCode = code;
      endpoint.responses.set(code, response);
    }

    response = {
      description: "",
      ...deepMerge(endpoint.responses.get(code), cleanObject(response)),
      code
    };

    endpoint.responses.set(response.code!, response as IResponseOptions);
  });
}

/**
 * Add responses documentation for a specific status code.
 *
 * ::: warning
 * This decorator will be removed in v6 in favor of @@Returns@@ from @tsed/schema.
 * For v5 user, use @@Returns@@ decorator from @tsed/common then in v6 switch to @tsed/schema.
 * :::
 *
 * ## Examples
 * ## With status code
 *
 * ```typescript
 *  @Returns(404, {description: "Not found"})
 *  @Returns(200, {description: "OK", type: Model})
 *  async myMethod(): Promise<Model>  {
 *
 *  }
 * ```
 *
 * This example will produce this documentation in swagger:
 *
 * ```json
 * {
 *   "responses": {
 *     "404": {
 *       "description": "Description"
 *     },
 *     "2OO": {
 *       "description": "Description",
 *       "schema": {"schemaOfModel": "..."}
 *     }
 *   }
 * }
 * ```
 *
 * ### Without status code
 *
 * Returns can be use without status code. In this case, the response will be added to the default status code
 * (200 or the status code seated with `@Status`).
 *
 * ```typescript
 *  @Returns({description: "Description"})
 *  async myMethod(): Promise<Model>  {
 *
 *  }
 * ```
 *
 * This example will produce this documentation in swagger:
 *
 * ```json
 * {
 *   "responses": {
 *     "200": {
 *       "description": "Description"
 *     }
 *   }
 * }
 * ```
 *
 * ### With type schema
 *
 * Returns accept another signature with a type.
 *
 * ```typescript
 *  @Returns(Model, {description: "Description"}) //OR
 *  @Returns(Model)
 *  async myMethod(): Promise<Model>  {
 *
 *  }
 * ```
 *
 * This example will produce this documentation in swagger:
 *
 * ```json
 * {
 *   "responses": {
 *     "200": {
 *       "description": "Description",
 *       "schema": {"schemaOfModel": "..."}
 *     }
 *   }
 * }
 * ```
 * @param statusCode Code status
 * @param options Swagger responses documentations
 * @operation
 * @response
 * @decorator
 */
export function Returns(statusCode: number, options: Partial<IResponseOptions>): any;
export function Returns(statusCode: number, model: Type<any>): any;
export function Returns(options: Partial<IResponseOptions>): any;
export function Returns(model: Type<any>): any;
export function Returns(model: Type<any>, options: Partial<IResponseOptions>): any;
export function Returns(...args: any[]) {
  return ReturnType(mapStatusResponseOptions(args));
}

/**
 * Add responses documentation for a specific status code.
 *
 * ::: warning
 * This decorator will be removed in v6 in favor of @@Returns@@ from @tsed/schema.
 * For v5 user, use @@ReturnsArray@@ decorator from @tsed/common then in v6 switch to `@Returns(Array).Of(User)` from @tsed/schema.
 * :::
 *
 * ## Examples
 * ## With status code
 *
 * ```typescript
 *  @ReturnsArray(200, {description: "OK", type: Model})
 *  async myMethod(): Promise<Model>  {
 *
 *  }
 * ```
 *
 * This example will produce this documentation in swagger:
 *
 * ```json
 * {
 *   "responses": {
 *     "2OO": {
 *       "description": "Description",
 *       "schema": {"type": "array"}
 *     }
 *   }
 * }
 * ```
 *
 * ### Without status code
 *
 * ReturnsArray can be use without status code. In this case, the response will be added to the default status code
 * (200 or the status code seated with `@Status`).
 *
 * ```typescript
 *  @ReturnsArray({description: "Description"})
 *  async myMethod(): Promise<Model>  {
 *
 *  }
 * ```
 *
 * This example will produce this documentation in swagger:
 *
 * ```json
 * {
 *   "responses": {
 *     "200": {
 *       "description": "Description",
 *       "schema": {"type": "array"}
 *     }
 *   }
 * }
 * ```
 *
 * ### With type schema
 *
 * ReturnsArray accept another signature with a type.
 *
 * ```typescript
 *  @ReturnsArray(Model, {description: "Description"}) //OR
 *  @ReturnsArray(Model)
 *  async myMethod(): Promise<Model>  {
 *
 *  }
 * ```
 *
 * This example will produce this documentation in swagger:
 *
 * ```json
 * {
 *   "responses": {
 *     "200": {
 *       "description": "Description",
 *       "schema": {
 *         "type": "array",
 *         "items": {
 *           $ref: "Model"
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param statusCode Code status
 * @param options Swagger responses documentations
 * @returns {Function}
 * @decorator
 * @swagger
 * @operation
 * @response
 */
export function ReturnsArray(statusCode: number, options: Partial<IResponseOptions>): any;
export function ReturnsArray(statusCode: number, model: Type<any>): any;
export function ReturnsArray(options: Partial<IResponseOptions>): any;
export function ReturnsArray(model: Type<any>): any;
export function ReturnsArray(model: Type<any>, options: Partial<IResponseOptions>): any;
export function ReturnsArray(...args: any[]) {
  return ReturnType({...mapStatusResponseOptions(args), collectionType: Array});
}
