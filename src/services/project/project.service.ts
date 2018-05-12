import {Log} from '../../utils/log';
var nrc = require('node-run-cmd');
import * as child_process from 'child_process';
import * as Ora from 'ora';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../../config/config';

export class ProjectService {

    projectName: string = '';
    spinner: Ora;
    constructor() {
        this.spinner = new Ora();
    }

    create = (projectName: string, installDependencies: boolean) => {
        this.projectName = projectName;

        fs.exists(path.resolve(process.cwd(), projectName), (exists: boolean) => {

            if (exists) {
                Log.error('Already exists an folder with name "' + this.projectName + '"');
            }
            else {

                this.spinner.text = `Creating Project(${this.projectName})`;
                this.spinner.color = 'yellow';
                this.spinner.start();

                nrc.run('git clone ' + config.NEWARepository.url).then((response: any) => {

                    //Rename the project from the repository to the name of project that user choose.
                    let currentRepositoryFolderPath = path.resolve(process.cwd(), config.NEWARepository.name);
                    let newRepositoryFolderPath = path.resolve(process.cwd(), projectName);

                    fs.rename(currentRepositoryFolderPath, newRepositoryFolderPath, this.onCreated.bind(null, installDependencies));

                }, (err: any) => {
                    Log.error('Make sure you have git installed on your machine.');
                });
            }

        });
    }


    //Will be called when the project have been created.
    private onCreated = (installDependencies: true) => {
        this.spinner.stop();
        Log.success(`\n Project(${this.projectName}) created successfully!`);

        if (installDependencies) {

            this.spinner.text = "Installing dependencies...";
            this.spinner.start();

            setTimeout(() => {
                child_process.exec(`(cd ${this.projectName} && npm install && cd..)`, (err: any, stdout: any, stderr: any) => {
                    this.spinner.stop();

                    if (!err) {
                        Log.success('\n Dependencies installed successfully!.');
                        Log.info('\n To serve your application run:');
                        Log.yellow(` cd ${this.projectName} && gulp serve`);
                    }
                    else {
                        Log.error(`\n Could not install dependencies try running cd ${this.projectName} && npm install.`);
                    }
                });
            }, 150)

        }

    }

}