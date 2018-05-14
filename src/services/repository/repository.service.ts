import { Log } from '../../utils/log';
import * as fs from 'fs';
import * as path from 'path';
import * as Ora from 'ora';
import { config } from '../../config/config';
import { ValidateService } from '../validate/validate.service';
import { BaseResponse } from '../../utils/BaseResponse';
import { iRepositoryTemplate } from './constants/iRepositoryTemplate';
import { repositoryTemplate } from './constants/repositoryTemplate';

export class RepositoryService {

    private spinner: Ora;
    private validateService: ValidateService;
    constructor() {
        this.spinner = new Ora();
        this.validateService = new ValidateService();
    }

    create(modelName: string) {

        modelName = modelName[0].toUpperCase() + modelName.substr(1);

        this.spinner.text = `Generating respository(${modelName}Repository) ...`;
        this.spinner.color = 'yellow';
        this.spinner.start();

        this.validateService.hasRepositoryBaseClasseInterface((response: BaseResponse) => {

            if (response.success) {

                // Check if model exits and if it is valid "empty files won´t work"
                this.validateService.modelAndClassExists(modelName, (response: BaseResponse) => {

                    if (response.success) {

                        //Check if interface alread exists before create
                        fs.exists(path.resolve(config.NEWARepository.repositoryPaths.interfaces + 'I' + modelName + config.NEWARepository.repositoryPaths.extension), (exists: boolean) => {

                            if (exists) {
                                this.spinner.stop();
                                Log.highlight(`Already exists repository interface @!"${modelName}${config.NEWARepository.repositoryPaths.extension}"!@ file.`);
                            }

                            else {
                                fs.writeFile(config.NEWARepository.repositoryPaths.interfaces + 'I' + modelName + config.NEWARepository.repositoryPaths.extension, iRepositoryTemplate.replace(/{{modelName}}/g, modelName), (err: NodeJS.ErrnoException) => {

                                    if (err) {
                                        this.spinner.stop();
                                        Log.error('Failed to generate repository.');
                                    }
                                    else {
                                        Log.success('\n'+(config.NEWARepository.repositoryPaths.interfaces + 'I' + modelName + config.NEWARepository.repositoryPaths.extension));

                                        //Check if classe alread exists before create
                                        fs.exists(path.resolve(config.NEWARepository.repositoryPaths.main + modelName + config.NEWARepository.repositoryPaths.extension), (exists: boolean) => {

                                            if (exists) {
                                                
                                                this.spinner.stop();
                                                Log.highlight(`Already exists repository @!"${modelName}${config.NEWARepository.repositoryPaths.extension}"!@ file.`);
                                            }
                                            else {
                                                fs.writeFile(config.NEWARepository.repositoryPaths.main + modelName + config.NEWARepository.repositoryPaths.extension, repositoryTemplate.replace(/{{modelName}}/g, modelName), (err: NodeJS.ErrnoException) => {

                                                    this.spinner.stop();

                                                    if (err) {
                                                        Log.error('Failed to generate repository.');
                                                    }
                                                    else {
                                                        Log.success((config.NEWARepository.repositoryPaths.main + modelName + config.NEWARepository.repositoryPaths.extension));
                                                    }

                                                    process.exit();
                                                });

                                            }
                                        });

                                    }

                                });

                            }
                        });

                    }
                    else {
                        this.spinner.stop();
                        Log.error(response.error.title);
                        Log.highlight(response.error.message);
                    }
                }); // End of Model class validation

            }
            else {
                this.spinner.stop();
                Log.error(response.error.title);
                Log.highlight(response.error.message);
            }

        }); // End has base classe and interface

    }

}