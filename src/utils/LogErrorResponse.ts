export class LogErrorResponse {
    //Usually set by hand
    title:string; 
    // Real erro that was generated by event or function.
    message:string;

    constructor(title: string, message: string = ''){
        this.title = title;
        this.message = message;
    }
}