import { Log } from '../../utils/log';
var nrc = require('node-run-cmd');
import * as child_process from 'child_process';
import * as Ora from 'ora';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as rimraf from 'rimraf';
import * as globby from 'globby';
import { config } from '../../config/config';
import { BusinessService } from '../business/business.service';
import { ControllerService } from '../controller/controller.service';

export class ProjectService {

    private projectName: string = '';
    private spinner: Ora;
    constructor() {
        this.spinner = new Ora({ spinner: 'dots' });
    }

    create(projectName: string, installDependencies: boolean, isBlankProject: boolean) {
        this.projectName = projectName;

        fs.exists(path.resolve(process.cwd(), projectName), (exists: boolean) => {

            if (exists) {
                Log.highlight('Already exists a project with name @!' + this.projectName + '!@.');
            }
            else {

                this.spinner.text = `Creating ${this.projectName}`;
                this.spinner.start();

                // Clones repository to system .tmp folder;
                nrc.run(`git clone ${config.NEWARepository.url} ${path.resolve(os.tmpdir(), projectName)}`).then((response: any) => {

                    //Rename the project from the repository to the name of project that user choose.
                    let currentRepositoryFolderPath = path.resolve(os.tmpdir(), projectName);
                    let newRepositoryFolderPath = path.resolve(process.cwd(), projectName);

                    this.handleRepositoryFiles(currentRepositoryFolderPath, isBlankProject, () => {
                        fs.rename(currentRepositoryFolderPath, newRepositoryFolderPath, this.onCreated.bind(null, installDependencies, isBlankProject));
                    });

                }, (err: any) => {
                    Log.error('Make sure you have git installed on your machine.');
                });
            }

        });
    }


    //Will be called when the project have been created.
    private onCreated = (installDependencies: true, isBlankProject: boolean = false) => {
        const BL = '\n';
        const projectType = isBlankProject == true ? 'blank ' : '';

        this.spinner.succeed();

        if (installDependencies) {

            this.spinner.text = "Installing dependencies using npm...";
            this.spinner.start();

            setTimeout(() => {
                var npmInstallCommand = child_process.exec('npm install', { cwd: this.projectName });
                var npmInstallInfo = '';

                npmInstallCommand.stdout.on('data', (data) => {
                    npmInstallInfo = data.toString();
                });

                npmInstallCommand.on('close', (code) => {

                    if (code == 0) {
                        Log.info('\n');
                        Log.info(npmInstallInfo);
                        this.spinner.succeed();
                    }
                    else {
                        this.spinner.fail();
                    }

                    Log.info(`${BL
                        }Success! Created ${projectType}${this.projectName} at ${path.join(process.cwd(), this.projectName)}${BL
                        }Inside that directory, you can run the folowing commands:`);

                    Log.success('\n\tnpm install')
                    Log.info('\t  Install project dependencies.')

                    Log.success('\n\tgulp serve')
                    Log.info('\t  Starts the development server.')

                    Log.success('\n\tnewa')
                    Log.info('\t  If "newa-cli" is installed, then it will show newa-cli commands.')

                    Log.info('\nWe suggest that you begin by typing:\n')
                    Log.success(`  cd ${this.projectName}`)

                    if (code != 0)
                        Log.success(`  npm install`)

                    Log.success('  gulp serve\n')

                })

            }, 1000)

        }
        else {

            Log.info(`${BL
                }Success! Created ${projectType}${this.projectName} at ${path.join(process.cwd(), this.projectName)}${BL
                }Inside that directory, you can run the folowing commands:`);

            Log.success('\n\tnpm install')
            Log.info('\t  Install project dependencies.')

            Log.success('\n\tgulp serve')
            Log.info('\t  Starts the development server.')

            Log.success('\n\tnewa')
            Log.info('\t  If "newa-cli" is installed, then it will show newa-cli commands.')

            Log.info('\nWe suggest that you begin by typing:\n')
            Log.success(`  cd ${this.projectName}`)
            Log.success(`  npm install`)
            Log.success('  gulp serve\n')
        }

    }

    handleRepositoryFiles(currentRepositoryFilePath: string, isBlankProject = false, callback: Function) {

        // Only removes .git file
        if (!isBlankProject) {
            rimraf(path.join(currentRepositoryFilePath, '.git'), () => callback(true));
        }
        else {
            const businessService = new BusinessService();
            const controllerService = new ControllerService();

            rimraf(path.join(currentRepositoryFilePath, '.git'), () => {

                rimraf(path.join(currentRepositoryFilePath, 'resources'), () => {

                    globby(
                        [
                            path.join(currentRepositoryFilePath, config.NEWARepository.modelsPath, '*.ts'),
                            path.join(currentRepositoryFilePath, config.NEWARepository.repositoryPaths.interfaces +`!(IBase${config.NEWARepository.repositoryPaths.extension})`),
                            path.join(currentRepositoryFilePath, config.NEWARepository.repositoryPaths.main + `!(Base${config.NEWARepository.repositoryPaths.extension})`),
                            path.join(currentRepositoryFilePath, config.NEWARepository.businessPaths.interfaces, `!(IBase${config.NEWARepository.businessPaths.extension}|IBusinessFactory.ts|IJWTokenSignOptions.ts)`),
                            path.join(currentRepositoryFilePath, config.NEWARepository.businessPaths.main, `!(Base${config.NEWARepository.businessPaths.extension})`),
                            path.join(currentRepositoryFilePath, config.NEWARepository.controllerPaths.main, `*${config.NEWARepository.controllerPaths.extension}`)
                        ])
                        .then(function then(paths) {
                            paths.map(function map(item, index) {
                                rimraf(item, () => {
                                    if (index == paths.length - 1) {

                                        businessService.removeBusinessFactoryInterfaceDependencies(currentRepositoryFilePath, () => {
                                            businessService.removeBusinessFactoryDependencies(currentRepositoryFilePath, () => {
                                                controllerService.disattachControllerFromServer(currentRepositoryFilePath, callback);
                                            });
                                        });
                                    }
                                });
                            });
                        });

                });// resources folder

            });// git folder
        }

    }

}