export class Util {

    static camelize(str: string) {
        return str.replace(/\W+(.)/g, function (match: any, chr: any) {
            return chr.toUpperCase();
        });
    }

    static lowercaseFistLetter(str: string) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
}