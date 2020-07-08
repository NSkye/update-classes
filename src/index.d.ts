type ITargetsToUpdate = Element | Element[];

declare namespace ClassesToUpdate {
  export interface IObjectNotation {
    [classToUpdate: string]: boolean | string;
  }
  export type IStringNotation = string
  export type IArrayNotation = Array<IAnyNotation>
  export type IFunctionNotation = () => IAnyNotation
  export type IAnyNotation = IObjectNotation |
    IStringNotation |
    IArrayNotation |
    IFunctionNotation
}

interface IUpdateClassesReturn {
  and: IUpdateClasses;
  also: IUpdateClasses;
  afterTransition: (
    classes: ClassesToUpdate.IAnyNotation,
    ignoreScope?: boolean,
  ) => IUpdateClassesReturn;
  afterAnimation: (
    classes: ClassesToUpdate.IAnyNotation,
    ignoreScope?: boolean,
  ) => IUpdateClassesReturn;
}

interface IOptions {
  scope: string;
  ensureTargets: Element[];
  ensureClasses: Array<
    ClassesToUpdate.IStringNotation |
    ClassesToUpdate.IObjectNotation
  >;
}

interface IUpdateClasses {
  (
    targets?: ITargetsToUpdate,
    classes?: ClassesToUpdate.IAnyNotation,
    ignoreScope?: boolean,
  ): IUpdateClassesReturn;

  (
    classes?: ClassesToUpdate.IAnyNotation,
    ignoreScope?: boolean,
  ): IUpdateClassesReturn;

  (
    ignoreScope?: boolean,
  ): IUpdateClassesReturn;

  readonly scope: (scopeName: string) => IUpdateClasses;
  readonly target: (target: ITargetsToUpdate) => IUpdateClasses;
  readonly classes: (classes: ClassesToUpdate.IAnyNotation) => IUpdateClasses;
  readonly __extractOriginal: () => (
    targets: ITargetsToUpdate,
    classes: ClassesToUpdate.IAnyNotation,
  ) => void;
  readonly __extractOptions: () => IOptions;
}

declare const updateClasses: IUpdateClasses;

export default updateClasses;
