import * as json from './../../package.json'

let packJson = <any>json;

export let COMMANDOPTIONS: string = `
    options for project:
        --b|--blank                 If set, Generates a blank project without defaults(model,repository,business and controller).

    options for model:
        --t|--table <tablename>         Sets the name of table to use.
        --env|--environment <enviroment>  Sets the config database enviroment to use.
`