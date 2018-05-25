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
        this.spinner = new Ora({ spinner: 'dots' });
        this.validateService = new ValidateService();
    }

    create(modelName: string) {

        modelName = modelName[0].toUpperCase() + modelName.substr(1);

        this.spinner.text = `Generating ${modelName}Repository...`;
        this.spinner.start();

        this.validateService.hasRepositoryBaseClasseInterface((response: BaseResponse) => {

            if (response.success) {

                // Check if model exits and if it is valid "empty files won´t work"
                this.validateService.modelAndClassExists(modelName, (response: BaseResponse) => {

                    if (response.success) {
                        let generatedRepositoryInterface = false;

                        //Check if interface alread exists before create
                        fs.exists(path.resolve(config.NEWARepository.repositoryPaths.interfaces + 'I' + modelName + config.NEWARepository.repositoryPaths.extension), (exists: boolean) => {

                            if (exists) {
                                this.spinner.stop();
                                Log.highlight(`Already exists repository interface file @!I${modelName}${config.NEWARepository.repositoryPaths.extension}!@.`);
                            }

                            else {
                                fs.writeFile(config.NEWARepository.repositoryPaths.interfaces + 'I' + modelName + config.NEWARepository.repositoryPaths.extension, iRepositoryTemplate.replace(/{{modelName}}/g, modelName), (err: NodeJS.ErrnoException) => {

                                    if (err) {
                                        this.spinner.fail();
                                        Log.error('Failed to generate repository.');
                                    }
                                    else {
                                        generatedRepositoryInterface = true;

                                        //Check if classe alread exists before create
                                        fs.exists(path.resolve(config.NEWARepository.repositoryPaths.main + modelName + config.NEWARepository.repositoryPaths.extension), (exists: boolean) => {

                                            if (exists) {

                                                this.spinner.fail();
                                                Log.highlight(`Already exists repository file @!${modelName}${config.NEWARepository.repositoryPaths.extension}!@.`);
                                            }
                                            else {
                                                fs.writeFile(config.NEWARepository.repositoryPaths.main + modelName + config.NEWARepository.repositoryPaths.extension, repositoryTemplate.replace(/{{modelName}}/g, modelName), (err: NodeJS.ErrnoException) => {

                                                    if (err) {
                                                        this.spinner.fail()
                                                        Log.error('Failed to generate repository.');
                                                    }
                                                    else {
                                                        this.spinner.succeed();

                                                        if (generatedRepositoryInterface) {
                                                            Log.createdTag(path.join(process.cwd(), config.NEWARepository.repositoryPaths.interfaces, 'I' + modelName + config.NEWARepository.repositoryPaths.extension));
                                                        }
                                                        Log.createdTag(path.join(process.cwd(), config.NEWARepository.repositoryPaths.main, modelName + config.NEWARepository.repositoryPaths.extension));
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
                        this.spinner.fail();
                        process.exit();
                        Log.error(response.error.title);
                        Log.highlight(response.error.message);
                    }
                }); // End of Model class validation

            }
            else {
                this.spinner.fail();
                process.exit();
                Log.error(response.error.title);
                Log.highlight(response.error.message);
            }

        }); // End has base classe and interface

    }

}