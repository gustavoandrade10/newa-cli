export class Validator{

    //Check if value contains letters,numbers,underscore and hyphen.
    static projectNameValidator(value: string) {
        if ((/^[a-zA-Z0-9&._-]+$/).test(value)) {
            return true;
        }

        return false;
    }

}