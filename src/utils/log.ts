import { Colors } from "../enums/colors";
import { LOGO } from '../constants/logo';

export class Log {

    constructor(){}

    static success(message: string){
        console.log(Colors.Green, message);
    }

    static error(message: string){
        console.log(Colors.Red, message);
    }
    
    static info(message: string){
        console.log(Colors.White, message);
    }

    static showLogo(){
        console.log(Colors.Yellow, LOGO);
    }

}