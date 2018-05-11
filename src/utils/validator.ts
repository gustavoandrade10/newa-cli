export class Validator{

    //Check if value contains letters,numbers,underscore and hyphen.
    static projectNameValidator(value: string) {
        if ((/^[a-zA-Z0-9&._-]+$/).test(value)) {
            return true;
        }

        return false;
    }

    //Returns true if it is a positive answer and false if it isn´t.
    static yerOrNoAnswerValidator(value: string): boolean{
        
        let validAnwers: any = {
            'yes': true, 'ye': true, 'y': true, 'sim': true, 's': true, '': true,
            'no': false, 'not': false, 'n': false, 'nao': false, 'não': false 
        }

        if(value.length)
            value = value.trim().toLowerCase();
        
        if(validAnwers[value] === true){
            return true;
        }

        return false;
    }


    static inquirerYerOrNoAnswerValidator = (value: string) => {
        
        let validAnwers: any = {
            'yes': true, 'ye': true, 'y': true, 'sim': true, 's': true, '': true,
            'no': false, 'not': false, 'n': false, 'nao': false, 'não': false 
        }

        if(value.length)
            value = value.trim().toLowerCase();
        
        if(validAnwers[value] === true || validAnwers[value] === false){
            return  true;
        }
        else{
            return `"${value}" it is not a valid option, try 'yes' or 'no' as option.`;;
        }
    }


}