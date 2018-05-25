#!/usr/bin/env node
import * as program from 'commander';
import * as inquirer from 'inquirer';
import { Log } from './utils/log';
import { Validator } from './utils/validator';
import * as json from '../package.json'

// import services
import { ProjectService } from './services/project/project.service';
import { ModelService } from './services/model/model.service';
import { ValidateService } from './services/validate/validate.service';
import { BusinessService } from './services/business/business.service';
import { RepositoryService } from './services/repository/repository.service';
import { ControllerService } from './services/controller/controller.service';
import { COMMANDOPTIONS } from './constants/commandOptionsHelp';

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
            .version((<any>json).version)
            .description((<any>json).description)

        // Creates a project
        program
            .command('new <projectname>')
            .alias('n')
            .description('Creates a new project')
            .option('--b , --blank', 'Generates a blank project.')
            .action((projectname, options) => {

                if (Validator.projectNameValidator(projectname)) {

                    inquirer.prompt({
                        type: 'input',
                        name: 'install_dependencies',
                        message: `Do you want NEWA to install the dependencies of ${projectname}?`,
                        validate: Validator.inquirerYesOrNoAnswerValidator
                    }).then((answer: any) => {

                        let hasToInstallDepedencies = Validator.yesOrNoAnswerValidator(answer.install_dependencies);
                        let isBlankProject = options.blank === undefined ? false : true;

                        this.projectService.create(projectname, hasToInstallDepedencies, isBlankProject);

                    });
                }
                else {
                    Log.error('Project name may only include letters, numbers, hyphen and underscore.');
                }

            });


        // Main command to generate
        program
            .command('generate', 'Generates a new (model,repository,business or controller)', { noHelp: true })
            .alias('g')

        if (process.argv[2] == 'generate' || process.argv[2] == 'g')
            process.argv.splice(2, 1);

        // Generate sub commands
        // Generates a model
        program
            .command('model <modelname>')
            .alias('m')
            .description('Generates a new model')
            .option('--env , --environment <environment>', 'Sets the config database enviroment to use.')
            .option('--t , --table <tablename>', 'Sets the name of table to use')
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

        program
            .command('all <modelname>')
            .alias('a')
            .description('Generates model, repository, business and controller, based on a model name.')
            .option('--env , --environment <environment>', 'Sets the config database enviroment to use.')
            .option('--t , --table <tablename>', 'Sets the name of table to use')
            .action((modelname) => {

                if (this.validateService.isInsideNEWAProject()) {

                    
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

        program
            .on('--help', () => {
                Log.info(COMMANDOPTIONS);
            });

        program.parse(process.argv);

    }
}

// export
export default new App();