type TargetsToUpdate = Element | Element[]

declare namespace ClassesToUpdate {
  export interface objectNotation {
    [classToUpdate: string]: boolean | string
  }
  export type stringNotation = string
  export type arrayNotation = Array<objectNotation | stringNotation | arrayNotation>
  export type anyNotation = objectNotation | stringNotation | arrayNotation
}

interface IUpdateClasses {
  and: (
    targets: TargetsToUpdate,
    classes: ClassesToUpdate.anyNotation
  ) => IUpdateClasses,
  also: (
    targets: TargetsToUpdate,
    classes: ClassesToUpdate.anyNotation
  ) => IUpdateClasses,
  afterTransition: (
    classes: ClassesToUpdate.anyNotation
  ) => IUpdateClasses,
  afterAnimation: (
    classes: ClassesToUpdate.anyNotation
  ) => IUpdateClasses
}

export default function updateClasses(
  targets: TargetsToUpdate,
  classes: ClassesToUpdate.anyNotation
): IUpdateClasses
