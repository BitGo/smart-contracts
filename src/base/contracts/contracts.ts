import { BaseMethodContainerMap, Method, MethodDefinition, Methods } from '../methods/methods';

/**
 * This defines the base abstraction of contracts
 */
export interface Contract<TMethod extends Method> {
  name: string;
  instance(name?: string): Instance<TMethod, Methods<TMethod>>;
  listMethods(): MethodDefinition[];
}

/**
 * This represents the concrete contract on the network
 */
export interface Instance<TMethod extends Method, TMethods extends Methods<TMethod>> {
  name: string;
  address?: string;
  methodsHandler: TMethods

  methods(): BaseMethodContainerMap<TMethod>;
  explain(): MethodDefinition[];
}

export class InstanceImpl<TMethod extends Method, TMethods extends Methods<TMethod>> implements Instance<TMethod, TMethods> {
  name: string;
  address?: string;
  methodsHandler: TMethods;

  constructor(name: string, methodsHandler: TMethods, address?: string) {
    this.name = name;
    this.address = address;
    this.methodsHandler = methodsHandler;
  }

  methods(): BaseMethodContainerMap<TMethod> {
    return this.methodsHandler.container;
  }

  explain(): MethodDefinition[] {
    return this.methodsHandler.explain();
  }
}
