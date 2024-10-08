import { Container, injectable, interfaces } from "inversify";
import { Module } from "../containerLib/containerModule";
import { Mediator } from "./mediator";
import { IMediatorMap } from "./interfaces/IMediatorMap";
import { IMediator } from "./interfaces/IMediator";
import { ISender } from "./interfaces/ISender";
import { IPublisher } from "./interfaces/IPublisher";
import { MEDIATOR_TYPES } from "./types";
import { MediatorPipe } from "./mediatorPipe";

export class MediatorModule extends Module {
  constructor(
    private readonly _container: Container,
    private readonly _mediatorMap: any,
    private readonly _pipeline: (typeof MediatorPipe)[],
  ) {
    super();
  }

  protected bindModule(
    fn: (
      regis: interfaces.ContainerModuleCallBack,
    ) => interfaces.ContainerModuleCallBack,
  ): interfaces.ContainerModuleCallBack {
    return fn((bind) => {
      bind<IMediatorMap>(MEDIATOR_TYPES.IMediatorMap)
        .to(this._mediatorMap)
        .inSingletonScope();
      bind<IMediator>(MEDIATOR_TYPES.IMediator).to(Mediator).inTransientScope();
      bind<ISender>(MEDIATOR_TYPES.ISender).to(Mediator).inTransientScope();
      bind<IPublisher>(MEDIATOR_TYPES.IPublisher)
        .to(Mediator)
        .inTransientScope();
      bind<Container>(Container).toConstantValue(this._container);
      bind<(typeof MediatorPipe)[]>(MEDIATOR_TYPES.Pipeline).toConstantValue(
        this._pipeline,
      );
    });
  }
}
