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

  scope: (scopeName: string) => IUpdateClasses;
  target: (target: ITargetsToUpdate) => IUpdateClasses;
  classes: (classes: ClassesToUpdate.IAnyNotation) => IUpdateClasses;
  __extractOriginal: () => (
    targets: ITargetsToUpdate,
    classes: ClassesToUpdate.IAnyNotation,
  ) => void;
  __extractOptions: () => IOptions;
}

declare const updateClasses: IUpdateClasses;

export default updateClasses;
