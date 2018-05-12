#!/usr/bin/env node
import * as commander from 'commander';
import * as inquirer from 'inquirer';
import { Log } from './utils/log';
import { Validator} from './utils/validator';

// import services
import { ProjectService } from './services/project/project.service';
import { ModelService } from './services/model/model.service';

class App {
    
    private project: ProjectService;
    private model: ModelService;
    constructor() {
        this.project = new ProjectService();
        this.model =  new ModelService();
        this.commands();
    }

    commands(): void {

        commander
            .version('1.0.0')
            .description('Cli for Node Express Web Api (NEWA) with typescript')
            .option('-n, new, --new <n>', 'Create new project', (value: string) => {

                if (Validator.projectNameValidator(value)) {
                    return value;
                }

                Log.error('Project name may only include letters, numbers, hyphen and underscore.');
                return false;
            })
            .option('-g model, generate model, --generate model <n>', 'Creates a model')
            .option('--e , --environment <n>', 'Enviroment commad')
            .parse(process.argv);

        //Execute tasks
        if (commander.new) {

            let projectName = commander.new;

            inquirer.prompt({
                type: 'input',
                name: 'install_dependencies',
                message: `Do you want NEWA to install the project(${commander.new}) dependencies after creation?`,
                validate: Validator.inquirerYesOrNoAnswerValidator
            }).then((answers: any) => {
                
                let result = Validator.yesOrNoAnswerValidator(answers.install_dependencies);
                
                this.project.create(projectName, result);
               
            });
        }
        else if(commander.model){
            
            let databaseEnviroment = commander.environment != undefined ? commander.environment : 'default';

            // if users don´t uses flag --e or --environment with generate model flag
            if(!commander.environment){
                Log.yellow('Flag --e wasn´t detected, it will use "development" database config connection.')
            }

            this.model.newModel(commander.model,databaseEnviroment);
            
        }
        else{
            Log.showLogo();
        }

    }
}

// export
export default new App();