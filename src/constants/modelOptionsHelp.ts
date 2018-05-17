import * as json from './../../package.json'

let packJson = <any>json;

export let MODELOPTIONS: string = `
    options for model:
        --t|--table <tablename>         Sets the name of table to use.
        --env|--environment <enviroment>  Sets the config database enviroment to use.
`