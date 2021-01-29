import { BaseMethodContainerMap, Method, Methods } from '../methods/methods';

export interface Contract<T extends Method> {
  name: string;
  instance(name?: string): Instance<T, Methods<T>>;
}

export class Instance<M extends Method, T extends Methods<M>> {
  name: string;
  address: string;
  methodsHandler: T;

  constructor(name: string, address: string, methodsHandler: T) {
    this.name = name;
    this.address = address;
    this.methodsHandler = methodsHandler;
  }

  methods(): BaseMethodContainerMap<M> {
    return this.methodsHandler.container;
  }
}
