export var businessTemplate = 
`import { BaseBusiness } from "./BaseBusiness";
import { {{modelName}} } from "../../Models/Database/{{modelName}}";
import { {{modelName}}Repository } from "../../Repository/Repositories/{{modelName}}Repository";

export class {{modelName}}Business extends BaseBusiness<{{modelName}}Repository, {{modelName}}> {

    constructor(private _repository: {{modelName}}Repository) {
        super(_repository);
    }

}
`