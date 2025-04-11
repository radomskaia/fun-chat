export enum TypeNames {
  object = "object",
  string = "string",
  number = "number",
  positiveNumber = "positiveNumber",
  boolean = "boolean",
}

export interface TypesForValidator {
  [TypeNames.object]: object;
  [TypeNames.string]: string;
  [TypeNames.number]: number;
  [TypeNames.positiveNumber]: number;
  [TypeNames.boolean]: boolean;
}
