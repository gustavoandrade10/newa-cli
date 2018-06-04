export var repositoryTemplate = 
`import { BaseRepository } from "./BaseRepository";
import { {{modelName}} } from "../../Models/Database/{{modelName}}";

export class {{modelName}}Repository extends BaseRepository<{{modelName}}> {

    constructor() {
        super({{modelName}});
    }

}
`