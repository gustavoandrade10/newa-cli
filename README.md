# NEWA-CLI

A cli for [Node Express Web Api (NEWA)](https://github.com/TalissonJunior/NodeExpressWebApi) writing in [typescript](https://www.typescriptlang.org/).

# Development

This document will give you some information about what tools you will need, to develop and build this project.

So first clone or download this repository.

### Prerequisites

Node.js 
 
>First you need to install [Node.js](https://nodejs.org/), recomended to download any stable version above 8.11.1


### Installing Dependencies

Install the dependencies listed inside of **package.json** file.

```sh
$ npm install 
```

### Runnig the Project for development proporse.


```sh
$ npm run watch:build
```

Use this command to compile typescripts and watch for changes. 

```sh
$ tsc
```

Use this command to compile typescripts once.

### Usage

```sh
$ newa help
```

### Generating project, model, repository, business and controller.

You can find all possible commands in the table below:

Scaffold  | Usage | Options
---       | ---   | ---
[Project](https://github.com/TalissonJunior/NodeExpressWebApi) | `newa new my-new-project`   |  `--e|--example`
[All]() | `newa g|generate a|all my-new-model-repository-business-controller` | `--t|--table my-table-name     --env|--environment my-environment`
[Model]()           | `newa g|generate m|model my-model-name`  | `--t|--table my-table-name     --env|--environment my-environment` 
[Repository]()     | `newa g|generate r|repository my-model-name` | `----` 
[Business]()     | `newa g|generate b|business my-model-name` | `----` 
[Controller]()     | `newa g|generate c|controller my-model-name` | `----` 
