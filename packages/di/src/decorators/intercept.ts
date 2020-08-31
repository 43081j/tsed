import {Store, Type} from "@tsed/core";
import {INJECTABLE_PROP} from "../constants";
import {IInjectableProperties, InjectablePropertyType, IInterceptor} from "../interfaces";

/**
 * Attaches interceptor to method call and executes the before and after methods
 *
 * @param interceptor
 * @param options
 * @decorator
 */
export function Intercept<T extends IInterceptor>(interceptor: Type<T>, options?: any): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Store.from(target).merge(INJECTABLE_PROP, {
      [propertyKey]: {
        bindingType: InjectablePropertyType.INTERCEPTOR,
        propertyKey,
        useType: interceptor,
        options
      }
    } as IInjectableProperties);

    return descriptor;
  };
}
