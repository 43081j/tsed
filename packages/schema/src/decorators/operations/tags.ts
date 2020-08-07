import {decorateMethodsOf, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonTag} from "../../interfaces/JsonOpenSpec";
import {JsonEntityFn} from "../common/jsonEntityFn";

function mapTags(tags: (string | JsonTag)[]) {
  return tags.map((tag) => {
    if (typeof tag === "string") {
      return {
        name: tag
      };
    }

    return tag;
  });
}

/**
 * Add tags metadata on the decorated element.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * @Controller("/")
 * class MyController {
 *  @Tags("api")
 *  get() {}
 * }
 * ```
 *
 * @param tags
 * @decorator
 * @swagger
 * @schema
 * @classDecorator
 * @operation
 */
export function Tags(...tags: (string | JsonTag)[]) {
  return JsonEntityFn((store, args) => {
    switch (store.decoratorType) {
      case DecoratorTypes.METHOD:
        store.operation!.addTags(mapTags(tags));
        break;
      case DecoratorTypes.CLASS:
        decorateMethodsOf(args[0], Tags(...tags));
        break;

      default:
        throw new UnsupportedDecoratorType(Tags, args);
    }
  });
}
