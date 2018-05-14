export var repositoryTemplate = 
`import { BaseRepository } from "./BaseRepository";
import { {{modelName}} } from "../../Models/Database/{{modelName}}";
import { I{{modelName}}Repository } from "../Interfaces/I{{modelName}}Repository";

export class {{modelName}}Repository extends BaseRepository<{{modelName}}> implements I{{modelName}}Repository{

    constructor() {
        super({{modelName}});
    }

}
`