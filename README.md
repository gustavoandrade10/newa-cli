# NEWA-CLI

A cli for [Node Express Web Api (NEWA)](https://github.com/TalissonJunior/NodeExpressWebApi).

# Usage

Install newa-cli globally.
```sh
npm install newa -g
```

## Newa new and generate.

Create a project, generate model, repository, business and controller.

### New synopsis

```sh
newa n|new your-project-name --e|--example
```

The above command will create a new project by the name of ```your-project-name``` the flag ```--e|--example``` is optional and if used, it will create an example project.

### Generate synopsis

```sh
newa g|generate [<type>] [<modelname>]
```

### Details

Automatically create project and [MRBC](####DEFINITIONS) for your project.

The generated files are all based on a existent ```Model```, so you have to create the ```Model``` first. 

For example, ```newa generate model user``` creates a model by the name of ```User``` in ```src/Models/Database/```.

```newa generate repository user``` creates a repository by the name of ```UserRepository``` in ```src/Repository/Repositories/``` .

```newa generate business user``` creates a business by the name of ```UserBusiness``` in ```src/Business/Rules/``` .

```newa generate controller user``` creates a controller by the name of ```UserController``` in ```src/Controller/Controllers/``` .

```newa generate all user``` creates a model, repository, business and controller .

| Input        | Description          
| ------------- | -------------
| ```type```      | The type of generator (e.g. model, repository, business, controller)
| ``modelname``    | The name of the model.   



| Option        | Description          
| ------------- | -------------
| ```--t\|--table my-table-name```      | Generates a model refering to a diferent table name, instead of using model name as table name.
| ``--env\|--environment my-environment``    | Sets the environment (production, development, local) to be used when generating a model.    

### Examples 

```sh
newa new <projectname> --example

newa generate model <modelname> --table <tablename> --environment  <enviromentname>

newa generate repository <modelname>

newa generate business <modelname>

newa generate controller <modelname>

newa generate all <modelname> --table <tablename> --environment  <enviromentname>

```

shortcuts:

```sh
newa n <projectname> --example

newa g m <modelname> --t <tablename> --env  <enviromentname>

newa g r <modelname>

newa g b <modelname>

newa g c <modelname>

newa g a <modelname> --t <tablename> --env <enviromentname>

```

#### Definitions
- MRBC - abbreviation for model, repository, business and controller.
- Model - Representation of a table in your database.


### Resources (available only for example projects).

You can find a dump file of the database and postman resources that were used in this project on **"resources/"** folder.

Just import them and you are good to go.


## Development Hints for working on NEWA CLI


### Prerequisites

Node.js 
 
>First install [Node.js](https://nodejs.org/), recomended to download any stable version above 8.11.1


### Installing Dependencies

Install typescript globally.

```sh
npm install -g typescript 
```

Install the dependencies listed inside of **package.json** file.

```sh
npm install 
```

### Running the project.


To compile typescript files and watch for changes use this command. 
```sh
npm run watch:build
```

or if you just want to compile then run:

```sh
tsc
```

To server the cli you can either type once:

```sh
npm link
```

and then just type ```newa commands``` normally or type 

```sh
node /dist/app.js
```