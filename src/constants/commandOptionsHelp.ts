import * as json from './../../package.json'

let packJson = <any>json;

export let COMMANDOPTIONS: string = `
    options for project:
        --e|--example                 If set, Generates a example project.

    options for model:
        --t|--table <tablename>         Sets the name of table to use.
        --env|--environment <enviroment>  Sets the config database enviroment to use.
`