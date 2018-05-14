export var iRepositoryTemplate = 
`import { IBaseRepository } from "./IBaseRepository";
import { {{modelName}} } from "../../Models/Database/{{modelName}}";

export interface I{{modelName}}Repository extends IBaseRepository<{{modelName}}>{
}
`