#!/usr/bin/env node
import * as commander from 'commander';
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
            this.project.create(commander.new);
        }

    }
}

// export
export default new App();