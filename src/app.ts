#!/usr/bin/env node
import * as commander from 'commander';
import * as inquirer from 'inquirer';
import { Log } from './utils/log';
import { Validator} from './utils/validator';

//services
import { ProjectService } from './services/project.service';

class App {
    
    private project: ProjectService;
    constructor() {
        this.project = new ProjectService();
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
            .parse(process.argv);

        //Execute tasks
        if (commander.new) {

            let projectName = commander.new;

            inquirer.prompt({
                type: 'input',
                name: 'install_dependencies',
                message: `Do you want NEWA to install the project(${commander.new}) dependencies after creation?`
            }).then((answers: any) => {
                
                let result = Validator.yerOrNoAnswerValidator(answers.install_dependencies);
                
                if(result === true || result === false){
                    this.project.create(projectName, result);
                }
                else{
                    Log.error(` "${answers.install_dependencies}" it is not a valid option, try 'yes' or 'no' as option.`);
                }

            });
        }
        else{
            Log.showLogo();
        }

    }
}

// export
export default new App();