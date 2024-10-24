class ComputedImpl {
  private _getter: Function;
  constructor(getter: any) {
    this._getter = getter;
  }

  public get value(): any {
    return this._getter();
  }
}

export function computed(getter: Function) {
  return new ComputedImpl(getter);
}
