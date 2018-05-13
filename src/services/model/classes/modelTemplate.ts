import { baseModelTemplate } from "../constants/baseModelTemplate";

export class ModelTemplate {
    imports: string;
    name: string;
    tableName: string;
    content: string;
    template: string = baseModelTemplate;
}