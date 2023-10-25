import {RedirectException} from "../core/RedirectException";

export class SeeOther extends RedirectException {
  static readonly STATUS = 303;

  constructor(message: string, origin?: Error | string | any) {
    super(SeeOther.STATUS, message, origin);
  }
}
