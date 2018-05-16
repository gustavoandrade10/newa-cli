//docs[http://www.kammerl.de/ascii/AsciiSignature.php]
import * as json from './../../package.json'

let packJson = <any>json;

export let HELP: string = `
${packJson.description}

Options:

 -V, --version                  output the version number
 -h, --help                     output usage information

 Commands:
    
    new|n <projectname>                     Creates a new project.
    generate|g model|m <modelname>         Generates a new model.

        options:
            --t|--table <tablename>         Sets the name of table to use.
            --e|--environment <enviroment>  Sets the config database enviroment to use.

    generate|g repository|r <modelname>    Generates a new repository, base on a existing model.
    generate|g business|b <modelname>      Generates a new business, base on a existing model.
    generate|g controller|c <modelname>    Generates a new controller, base on a existing model.

`