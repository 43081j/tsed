import {isBoolean, isNumber, isStream, isString} from "@tsed/core";
import {Middleware} from "../../mvc/decorators/class/middleware";
import {Req} from "../../mvc/decorators/params/request";
import {Res} from "../../mvc/decorators/params/response";
import {IMiddleware} from "../../mvc/interfaces";
import {ConverterService} from "../../mvc/services/ConverterService";

/**
 * See example to override SendResponseMiddleware [here](/docs/middlewares/override/send-response.md).
 * @middleware
 */
@Middleware()
export class SendResponseMiddleware implements IMiddleware {
  constructor(protected converterService: ConverterService) {}

  public use(@Req() req: Req, @Res() response: Res) {
    const {data, endpoint} = req.ctx;
    if (data === undefined) {
      return response.send();
    }

    if (this.shouldBeStreamed(data)) {
      data.pipe(response);

      return response;
    }

    if (this.shouldBeSent(data)) {
      return response.send(data);
    }

    return response.json(this.converterService.serialize(data, {type: endpoint.type, withIgnoredProps: false}));
  }

  protected shouldBeSent(data: any) {
    return Buffer.isBuffer(data) || isBoolean(data) || isNumber(data) || isString(data) || data === null;
  }

  protected shouldBeStreamed(data: any) {
    return isStream(data);
  }
}
