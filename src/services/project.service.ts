var nrc = require('node-run-cmd');
import * as inquirer from 'inquirer';
import * as Ora from 'ora';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config/config';
import { Log } from '../utils/log';

export class ProjectService {

    projectName: string = '';
    spinner: Ora;
    constructor() {
        this.spinner = new Ora();
    }

    create = (projectName: string) => {
        this.projectName = projectName;

        fs.exists(path.resolve(process.cwd(), projectName), (exists: boolean) => {

            if (exists) {
                Log.error('Already exists an folder with name "' + this.projectName + '"');
            }
            else {

                this.spinner.text = 'Creating ' + this.projectName;
                this.spinner.color = 'yellow';
                this.spinner.start();

                nrc.run('git clone ' + config.NEWARepository.url).then((response: any) => {

                    //Moves the downloaded project to .tmp folder  
                    let currentRepositoryFolderPath = path.resolve(process.cwd(), config.NEWARepository.name);
                    let newRepositoryFolderPath = path.resolve(process.cwd(), projectName);

                    fs.rename(currentRepositoryFolderPath, newRepositoryFolderPath, this.onCreated);

                }, (err: any) => {
                    Log.error('Make sure you have git installed on your machine.');
                });
            }

        });
    }


    //Will be called when the project have been created.
    private onCreated = (result: any) => {
        this.spinner.stop();
        Log.success('\n' + this.projectName + " was successfully created!");
    }

}