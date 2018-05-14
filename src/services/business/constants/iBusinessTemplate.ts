export var iBusinessTemplate = 
`import { IBaseBusiness } from "./IBaseBusiness";
import { {{modelName}} } from "../../Models/Database/{{modelName}}";

export interface I{{modelName}}Business extends IBaseBusiness<{{modelName}}>{
}
`