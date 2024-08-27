import express from "express";
import "reflect-metadata";
import { AppOptions } from "./appOptions";
import { BaseController } from "../controllerLib/baseController";
import { Container } from "inversify";

export class App {
  private _app: express.Application;
  serviceContainer: Container;
  options: AppOptions;
  env: any;

  private constructor(options: AppOptions) {
    this.env = process.env;
    this._app = express();
    this.options = options;
    this.serviceContainer = new Container(options.container);
    this.options.allowAnonymousPath = this.options.allowAnonymousPath.map(
      (p) => {
        return {
          path: this.options.routerPrefix + p.path,
          method: p.method.toUpperCase(),
        };
      },
    );
  }

  static createBuilder(fn: (options: AppOptions) => void = () => {}) {
    const options = new AppOptions();
    fn(options);
    return new App(options);
  }

  mapController(controllers: any[]) {
    controllers.forEach((c) => {
      const _ctor = this.serviceContainer.resolve(c) as BaseController;
      this._app.use(
        `${this.options.routerPrefix}${_ctor.apiPath}`,
        _ctor.mapRoutes(),
      );
    });
    return this;
  }

  useMiddleware(middleware: any) {
    this._app.use(middleware);
    return this;
  }

  useJwtValidMiddleware(handler: (req: any, res: any, next: any) => void) {
    this._app.use((req, res, next) => {
      this.options.allowAnonymousPath.filter(
        (x) => req.url.match(x.path) && x.method === req.method,
      ).length > 0
        ? next()
        : handler(req, res, next);
    });
    return this;
  }

  useJsonParser() {
    this._app.use(express.json());
    return this;
  }

  useExtension(extension: (app: App) => void) {
    extension(this);
    return this;
  }

  run() {
    const port = this.env.PORT | 3000;
    this._app.listen(port, () => {
      console.log(
        `Listening on port http://localhost:${port}${this.options.routerPrefix}`,
      );
    });
  }
}
