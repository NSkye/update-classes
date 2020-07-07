type ITargetsToUpdate = Element | Element[];

declare namespace ClassesToUpdate {
  export interface IObjectNotation {
    [classToUpdate: string]: boolean | string;
  };
  export type IStringNotation = string;
  export type IArrayNotation = Array<IObjectNotation | IStringNotation | IArrayNotation>;
  export type IAnyNotation = IObjectNotation | IStringNotation | IArrayNotation;
};

interface IUpdateClassesReturn {
  and: IUpdateClasses;
  also: IUpdateClasses;
  afterTransition: (
    classes: ClassesToUpdate.IAnyNotation
  ) => IUpdateClassesReturn;
  afterAnimation: (
    classes: ClassesToUpdate.IAnyNotation
  ) => IUpdateClassesReturn;
};

interface IOptions {
  scope: string;
  ensureTargets: Element[];
  ensureClasses: Array<
    ClassesToUpdate.IStringNotation |
    ClassesToUpdate.IObjectNotation
  >;
};

interface IUpdateClasses {
  (
    targets?: ITargetsToUpdate,
    classes?: ClassesToUpdate.IAnyNotation
  ): IUpdateClassesReturn;

  scope: (scopeName: string) => IUpdateClasses;
  target: (target: ITargetsToUpdate) => IUpdateClasses;
  classes: (classes: ClassesToUpdate.IAnyNotation) => IUpdateClasses;
  __extractOriginal: () => (targets: ITargetsToUpdate, classes: ClassesToUpdate.IAnyNotation) => void;
  __extractOptions: () => IOptions;
};

declare const updateClasses: IUpdateClasses;

export default updateClasses;
