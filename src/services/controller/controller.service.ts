import { Log } from '../../utils/log';
import * as fs from 'fs';
import * as path from 'path';
import * as Ora from 'ora';
import { config } from '../../config/config';
import { ValidateService } from '../validate/validate.service';
import { BaseResponse } from '../../utils/BaseResponse';
import { controllerTemplate } from './constants/controllerTemplate';

export class ControllerService {

    private spinner: Ora;
    private validateService: ValidateService;
    constructor() {
        this.spinner = new Ora();
        this.validateService = new ValidateService();
    }

    create(modelName: string) {

        modelName = modelName[0].toUpperCase() + modelName.substr(1);

        this.spinner.text = `Generating controller(${modelName}Controller) ...`;
        this.spinner.color = 'yellow';
        this.spinner.start();

        // Check if model exits and if it is valid "empty files won´t work"
        this.validateService.modelAndClassExists(modelName, (response: BaseResponse) => {

            if (response.success) {

                // Check if business exits and if it is valid "empty files won´t work"
                this.validateService.businessAndClassExists(modelName, (businessResponse: BaseResponse) => {
                    
                    if (businessResponse.success) {

                        //Check if interface alread exists before create
                        fs.exists(path.resolve(config.NEWARepository.controllerPaths.main + modelName + config.NEWARepository.controllerPaths.extension), (exists: boolean) => {

                            if (exists) {
                                this.spinner.stop();
                                Log.highlight(`Already exists controller @!"${modelName}${config.NEWARepository.controllerPaths.extension}"!@ file.`);
                            }

                            else {

                                let controllTemplate = controllerTemplate.replace(/{{modelName}}/g, modelName);
                                controllTemplate = controllTemplate.replace(/{{routeName}}/g, modelName.toLowerCase())

                                fs.writeFile(config.NEWARepository.controllerPaths.main + modelName + config.NEWARepository.controllerPaths.extension, controllTemplate, (err: NodeJS.ErrnoException) => {
                                    this.spinner.stop();

                                    if (err) {
                                        console.log(err)
                                        Log.error('Failed to generate controller.');
                                    }
                                    else {
                                        Log.success('\n' + (config.NEWARepository.controllerPaths.main + modelName + config.NEWARepository.controllerPaths.extension));
                                    }

                                });

                            }
                        });

                    }
                    else {
                        this.spinner.stop();
                        Log.error(businessResponse.error.title);
                        Log.highlight(businessResponse.error.message);
                    }
                });
            }
            else {
                this.spinner.stop();
                Log.error(response.error.title);
                Log.highlight(response.error.message);
            }

        });
    }

}
