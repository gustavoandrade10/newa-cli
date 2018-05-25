import { Colors } from "../enums/colors";
import { LOGO } from '../constants/logo';

export class Log {

    constructor(){}

    static success(message: string){
        console.log(Colors.Cyan, message);
    }

    static error(message: string){
        console.log(Colors.Red, message);
    }
    
    static info(message: string){
        console.log(Colors.White, message);
    }

    static yellow(message: string){
        console.log(Colors.Yellow, message);
    }

    // use @! text to highlight !@ to highlight a text
    static highlight(message: string){
        
        while(message.indexOf('@!') > -1 || message.indexOf('!@') > -1){

            message = message.replace('@!', Colors.CyanNoReset);
            message = message.replace('!@', Colors.WhiteNoReset);
        }

        console.log(message, Colors.Reset);
    }

    static showLogo(){
        console.log(Colors.White, LOGO);
    }

}