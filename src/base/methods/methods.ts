export type MethodsClass<M extends Method, T extends Methods<M>> = new(methods: M[]) => T;
export type MethodClass<T extends Method> = new(...args: any[]) => T;

export interface Parameter {
  name: string
  type: string;
}

export interface MethodDefinition {
  name: string,
  type: string;
}

export interface MethodResponse {
  data: string;
}

export interface Method {
  id: string;
  name: string;
  call(params: { [key: string]: any }): any;
  explain(): MethodDefinition;
}

/**
 * This represents the set of methods that conform a contract instance
 */
export interface Methods<M extends Method> {
  container: BaseMethodContainerMap<M>;

  call(params: { [key: string]: any }): MethodResponse;
  explain(): MethodDefinition[];
}

export class MethodsImpl<M extends Method> implements Methods<M> {
  container: BaseMethodContainerMap<M>;

  constructor(methodAbis: M[]) {
    this.container = this.parse(methodAbis);
  }

  call(params: { [key: string]: any }): any {
    throw Error();
  }

  explain(): MethodDefinition[] {
    return Object.keys(this.container).map((name: string) => this.container[name].explain());
  }

  private parse(methods: M[]): BaseMethodContainerMap<M> {
    return methods.reduce((collector: BaseMethodContainerMap<M>, method: M) => {
      collector[method.name] = method;
      return collector;
    }, {});
  }
}

export interface BaseMethodContainerMap<k extends Method> {
  [key: string]: k;
}
