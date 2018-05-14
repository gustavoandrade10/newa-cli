export var businessTemplate = 
`import { BaseBusiness } from "./BaseBusiness";
import { {{modelName}} } from "../../Models/Database/{{modelName}}";
import { I{{modelName}}Business } from "../Interfaces/I{{modelName}}Business";
import { I{{modelName}}Repository } from "../../Repository/Interfaces/I{{modelName}}Repository";

export class {{modelName}}Business extends BaseBusiness<I{{modelName}}Repository, {{modelName}}> implements I{{modelName}}Business {

    constructor(private _repository: I{{modelName}}Repository) {
        super(_repository);
    }

}
`