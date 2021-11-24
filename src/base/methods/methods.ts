export type MethodsClass<TMethod extends Method, TMethods extends Methods<TMethod>> = new(methods: TMethod[]) => TMethods;
export type MethodClass<TMethod extends Method> = new(...args: any[]) => TMethod;

export interface Parameter {
  components: any;
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
export interface Methods<TMethod extends Method> {
  container: BaseMethodContainerMap<TMethod>;

  explain(): MethodDefinition[];
}

export class MethodsImpl<TMethod extends Method> implements Methods<TMethod> {
  container: BaseMethodContainerMap<TMethod>;

  constructor(methodAbis: TMethod[]) {
    this.container = this.parse(methodAbis);
  }

  explain(): MethodDefinition[] {
    return Object.keys(this.container).map((name: string) => this.container[name].explain());
  }

  private parse(methods: TMethod[]): BaseMethodContainerMap<TMethod> {
    return methods.reduce((collector: BaseMethodContainerMap<TMethod>, method: TMethod) => {
      collector[method.name] = method;
      return collector;
    }, {});
  }
}

export interface BaseMethodContainerMap<TMethod extends Method> {
  [key: string]: TMethod;
}
