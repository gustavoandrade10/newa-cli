#!/usr/bin/env node
import * as commander from 'commander';
import * as inquirer from 'inquirer';
import { Log } from './utils/log';
import { Validator } from './utils/validator';

// import services
import { ProjectService } from './services/project/project.service';
import { ModelService } from './services/model/model.service';
import { ValidateService } from './services/validate/validate.service';
import { BusinessService } from './services/business/business.service';
import { RepositoryService } from './services/repository/repository.service';
import { ControllerService } from './services/controller/controller.service';

class App {

    private validateService: ValidateService;
    private projectService: ProjectService;
    private modelService: ModelService;
    private repositoryService: RepositoryService;
    private businessService: BusinessService;
    private controllerService: ControllerService;

    constructor() {
        this.validateService = new ValidateService();
        this.projectService = new ProjectService();
        this.modelService = new ModelService();
        this.repositoryService = new RepositoryService();
        this.businessService = new BusinessService();
        this.controllerService = new ControllerService();
        this.commands();
    }

    commands(): void {

        commander
            .version('1.0.0')
            .description('Cli for Node Express Web Api (NEWA) with typescript')
            .option('-n, new, --new <n>', 'Creates new project', (value: string) => {

                if (Validator.projectNameValidator(value)) {
                    return value;
                }

                Log.error('Project name may only include letters, numbers, hyphen and underscore.');
                return false;
            })
            .option('-g model, generate model, --generate model <n>', 'Generates model')
            .option('--e , --environment <n>', 'Enviroment commad')
            .option('--t , --table <n>', 'Table for model')
            .option('-g repository, generate repository, --generate repository <n>', 'Generates repository base on model')
            .option('-g business, generate business, --generate business <n>', 'Generates business base on model')
            .option('-g controller, generate controller, --generate controller <n>', 'Generates controller base on model')
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

                let hasToInstallDepedencies = Validator.yesOrNoAnswerValidator(answers.install_dependencies);

                this.projectService.create(projectName, hasToInstallDepedencies);

            });
        }
        else if (commander.model) {

            if (this.validateService.isInsideNEWAProject()) {

                let databaseEnviroment = commander.environment != undefined ? commander.environment : 'default';

                this.modelService.create(commander.model, commander.table, databaseEnviroment);

            }
            else {
                Log.error('You are not in a root "NEWA" project directory.');
                Log.highlight('Run: @!"newa new your-project-name"!@ to create a new one.');
            }
        } 
        else if (commander.repository) {

            if (this.validateService.isInsideNEWAProject()) {

                this.repositoryService.create(commander.repository);
            }
            else {
                Log.error('You are not in a root "NEWA" project directory.');
                Log.highlight('Run: @!"newa new your-project-name"!@ to create a new one.');
            }
        }
        else if (commander.business) {

            if (this.validateService.isInsideNEWAProject()) {

                this.businessService.create(commander.business);
            }
            else {
                Log.error('You are not in a root "NEWA" project directory.');
                Log.highlight('Run: @!"newa new your-project-name"!@ to create a new one.');
            }
        }
        else if (commander.controller) {

            if (this.validateService.isInsideNEWAProject()) {

                this.controllerService.create(commander.controller);
            }
            else {
                Log.error('You are not in a root "NEWA" project directory.');
                Log.highlight('Run: @!"newa new your-project-name"!@ to create a new one.');
            }
        }
        else {
            Log.showLogo();
        }

    }
}

// export
export default new App();