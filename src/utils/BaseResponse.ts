import { LogErrorResponse } from "./LogErrorResponse";

export class BaseResponse {
    success: boolean;
    error: LogErrorResponse;

    constructor(success: boolean = false){
        this.success = success;
    }

}