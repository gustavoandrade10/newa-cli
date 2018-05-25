import * as fs from 'fs';
import * as path from 'path';
import * as Ora from 'ora';
import * as readline from 'readline';
import * as stream from 'stream';
import { Log } from '../../utils/log';
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

    
    disattachControllerFromServer(projectPath: string, callback: Function) {
        const serverFilePath = path.resolve(projectPath, config.NEWARepository.serverFilePath)

        fs.exists(serverFilePath, (exists: boolean) => {

            if (exists) {

                let instream = fs.createReadStream(serverFilePath);
                let rl = readline.createInterface(instream, new stream.Writable);
                let data = '';
                let insertLine = true;

                rl.on('line', (line) => {
                    
                    if(line.indexOf('import') > -1 && line.toLowerCase().indexOf('controller') > -1){
                        insertLine = false;
                    }
                    else if (line.toLowerCase().indexOf('//import') > -1){
                        insertLine = false;
                    }
                    else{
                        insertLine = true;
                    }
                    
                    if(line.indexOf('import') < 0 && line.toLowerCase().indexOf('attachcontrollers') > - 1){
                        let attachControllersInitial = line.substr(0, line.indexOf(','));

                        line = attachControllersInitial + ', []);';
                    }

                    if(insertLine){
                        data += line + '\n';
                    }
                    
                });

                rl.on('close', () => {
                    
                    fs.writeFile(serverFilePath, data, 'utf8', (err: NodeJS.ErrnoException) => {

                        if (err) {
                            callback(false);
                        }
                        else {
                            callback(true);
                        }

                    });
                });

            }
            else {
                callback(false);
            }

        });
    }

}
