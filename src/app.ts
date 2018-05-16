#!/usr/bin/env node
import * as program from 'commander';
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
import { HELP } from './constants/help';

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

        program
            .version('1.0.0')
            .description('Cli for Node Express Web Api (NEWA) with typescript')

        // Creates a project
        program
            .command('new <projectname>')
            .alias('n')
            .description('Creates a new project')
            .action((projectname) => {

                if (Validator.projectNameValidator(projectname)) {

                    inquirer.prompt({
                        type: 'input',
                        name: 'install_dependencies',
                        message: `Do you want NEWA to install the project(${projectname}) dependencies after creation?`,
                        validate: Validator.inquirerYesOrNoAnswerValidator
                    }).then((answer: any) => {

                        let hasToInstallDepedencies = Validator.yesOrNoAnswerValidator(answer.install_dependencies);

                        this.projectService.create(projectname, hasToInstallDepedencies);

                    });
                }
                else{
                    Log.error('Project name may only include letters, numbers, hyphen and underscore.');
                }

            });

        
        // Main command to generate
        program
            .command('generate')
            .alias('g')
            .description('Generates a new (model,repository,business or controller)')
        
        if(process.argv[2] == 'generate' || process.argv[2] == 'g')
            process.argv.splice(2, 1);

        // Generates a model
        program
            .command('model <modelname>')
            .alias('m')
            .option('--e , --environment <environment>', 'Sets the config database enviroment to use.')
            .option('--t , --table <tablename>', 'Sets the name of table to use')
            .description('Generates a new model')
            .action((modelname, options) => {

                if (this.validateService.isInsideNEWAProject()) {

                    let databaseEnviroment = options.environment != undefined ? options.environment : 'default';

                    this.modelService.create(modelname, options.table, databaseEnviroment);
                }
                else {
                    Log.error('You are not in a root "NEWA" project directory.');
                    Log.highlight('Run: @!"newa new your-project-name"!@ to create a new one.');
                }

            });

        // Generates a repository
        program
            .command('repository <modelname>')
            .alias('r')
            .description('Generates a new repository, based on a model')
            .action((modelname) => {

                if (this.validateService.isInsideNEWAProject()) {

                    this.repositoryService.create(modelname);
                }
                else {
                    Log.error('You are not in a root "NEWA" project directory.');
                    Log.highlight('Run: @!"newa new your-project-name"!@ to create a new one.');
                }

            });

        // Generates a business
        program
            .command('business <modelname>')
            .alias('b')
            .description('Generates a new business, based on a model')
            .action((modelname) => {

                if (this.validateService.isInsideNEWAProject()) {

                    this.businessService.create(modelname);
                }
                else {
                    Log.error('You are not in a root "NEWA" project directory.');
                    Log.highlight('Run: @!"newa new your-project-name"!@ to create a new one.');
                }

            });

        // Generates a controller
        program
            .command('controller <modelname>')
            .alias('c')
            .description('Generates a new controller, based on a model')
            .action((modelname) => {

                if (this.validateService.isInsideNEWAProject()) {

                    this.controllerService.create(modelname);
                }
                else {
                    Log.error('You are not in a root "NEWA" project directory.');
                    Log.highlight('Run: @!"newa new your-project-name"!@ to create a new one.');
                }

            });
        
        // Invalid commands
        program
            .on('command:*', () => {
                Log.error('Command not found.');
            });
        
        program.parse(process.argv);

    }
}

// export
export default new App();