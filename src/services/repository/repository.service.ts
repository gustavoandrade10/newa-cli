import { Log } from '../../utils/log';
import * as fs from 'fs';
import * as path from 'path';
import * as Ora from 'ora';
import { config } from '../../config/config';
import { ValidateService } from '../validate/validate.service';
import { BaseResponse } from '../../utils/BaseResponse';
import { iRepositoryTemplate } from './constants/iRepositoryTemplate';
import { repositoryTemplate } from './constants/repositoryTemplate';
import { ServiceResponseType } from '../../enums/ServiceResponseType';
import { ServiceResponse } from '../../utils/ServiceResponse';

export class RepositoryService {

    spinner: Ora;
    private validateService: ValidateService;
    constructor() {
        this.spinner = new Ora({ spinner: 'dots' });
        this.validateService = new ValidateService();
    }

    create(modelName: string, callback: Function) {

        modelName = modelName[0].toUpperCase() + modelName.substr(1);

        this.spinner.text = `Generating ${modelName}Repository...`;
        this.spinner.start();

        this.validateService.hasRepositoryBaseClasseInterface((response: BaseResponse) => {
         
            if (response.success) {

                // Check if model exits and if it is valid "empty files won´t work"
                this.validateService.modelAndClassExists(modelName, (response: BaseResponse) => {
                    
                    if (response.success) {
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
                                            process.exit();
                                        }
                                        else {
                                            let response: Array<ServiceResponse> = [];

                                            response.push({
                                                type: ServiceResponseType.created,
                                                message: path.join(process.cwd(), config.NEWARepository.repositoryPaths.main, modelName + config.NEWARepository.repositoryPaths.extension)
                                            });

                                            callback(response);
                                        }

                                    });

                                }
                            });

                    }
                    else {
                        this.spinner.fail();
                        Log.error(response.error.title);
                        Log.highlight(response.error.message);
                        process.exit();
                    }
                }); // End of Model class validation

            }
            else {
                this.spinner.fail();
                Log.error(response.error.title);
                Log.highlight(response.error.message);
                process.exit();
            }

        }); // End has base classe and interface

    }

}