import "@tsed/ajv";
import {$log, Configuration, PlatformApplication, ProviderScope, ProviderType, Inject} from "@tsed/common";
import "@tsed/graphql";
import "@tsed/mongoose";
import "@tsed/multipartfiles";
import "@tsed/seq";
import "@tsed/socketio";
import {join, resolve} from "path";
import {ErrorsCtrl} from "./controllers/errors/ErrorsCtrl";
import {SocketPageCtrl} from "./controllers/pages/SocketPageCtrl";
import {PingCtrl} from "./controllers/ping/PingCtrl";
import TestAcceptMimeMiddleware from "./middlewares/acceptmime";
import {InitSessionMiddleware} from "./middlewares/InitSessionMiddleware";
import {NotFoundMiddleware} from "./middlewares/NotFoundMiddleware";
import {FeatureModule} from "./module/feature/FeatureModule";

const rootDir = resolve(__dirname);
const spec = require(`${rootDir}/spec/swagger.default.json`);

@Configuration({
  rootDir,
  port: 8001,
  httpsPort: false,
  logger: {
    level: "info",
    logRequest: true
  },
  mount: {
    "/": [SocketPageCtrl],
    "/rest": ["${rootDir}/controllers/Base/**.ts", "${rootDir}/controllers/calendars/**.ts", ErrorsCtrl, PingCtrl],
    "/rest/v1": "${rootDir}/controllers/{calendars,users}/**.ts"
  },

  componentsScan: ["${rootDir}/services/**/*.ts", "${rootDir}/graphql/**/*.ts"],
  imports: [FeatureModule],

  uploadDir: "${rootDir}/uploads",

  statics: {
    "/": "${rootDir}/views"
  },
  graphql: {
    default: {
      path: "/api/graphql"
    }
  },
  socketIO: {},
  swagger: [
    {
      path: "/api-doc",
      cssPath: "${rootDir}/spec/style.css",
      viewPath: join(rootDir, "views", "swagger.ejs"),
      showExplorer: true,
      spec
    },
    {
      path: "/auth",
      doc: "authentication",
      cssPath: "${rootDir}/spec/style.css",
      showExplorer: true,
      spec
    },
    {
      path: "/errors-doc",
      doc: "errors",
      showExplorer: true,
      spec
    },
    {
      path: "/hidden-doc",
      doc: "hidden",
      showExplorer: true,
      spec
    }
  ],
  scopes: {
    [ProviderType.CONTROLLER]: ProviderScope.REQUEST
  },
  seq: {
    url: "http://localhost:5341"
  }
})
export class Server {
  @Inject()
  app: PlatformApplication;

  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  public $beforeRoutesInit(): void {
    const cookieParser = require("cookie-parser"),
      bodyParser = require("body-parser"),
      compress = require("compression"),
      methodOverride = require("method-override"),
      expressSession = require("express-session");

    this.app
      .use(TestAcceptMimeMiddleware)
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride());

    this.app.raw
      .engine(".html", require("ejs").__express)
      .set("views", `${rootDir}/views`)
      .set("view engine", "html")
      .set("trust proxy", 1);

    this.app
      .use(
        expressSession({
          secret: "keyboard cat",
          resave: false,
          saveUninitialized: true,
          cookie: {}
        })
      )
      .use(InitSessionMiddleware);
  }

  public $afterRoutesInit() {
    this.app.use(NotFoundMiddleware);
  }

  /**
   *
   */
  public $onReady() {
    $log.info("Server started...");
  }
}
