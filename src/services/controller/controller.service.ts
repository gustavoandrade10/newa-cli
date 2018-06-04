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
import { ServiceResponse } from '../../utils/ServiceResponse';
import { ServiceResponseType } from '../../enums/ServiceResponseType';
import { validUpdatedDateFields } from '../model/constants/validCreatedUpdatedDateFields';
import { Util } from '../../utils/utils';

export class ControllerService {

    spinner: Ora;
    private validateService: ValidateService;
    constructor() {
        this.spinner = new Ora({spinner: 'dots'});
        this.validateService = new ValidateService();
    }

    create(modelName: string, callback: Function) {

        modelName = modelName[0].toUpperCase() + modelName.substr(1);

        this.spinner.text = `Generating ${modelName}Controller...`;
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
                                this.spinner.fail();
                                Log.highlight(`Already exists controller file @!${modelName}${config.NEWARepository.controllerPaths.extension}!@.`);
                            }

                            else {

                                let controllTemplate = controllerTemplate.replace(/{{modelName}}/g, modelName);
                                controllTemplate = controllTemplate.replace(/{{routeName}}/g, modelName.toLowerCase())
                                controllTemplate = controllTemplate.replace(/{{modelNameCamelCase}}/g, Util.lowercaseFistLetter(modelName));

                                fs.writeFile(config.NEWARepository.controllerPaths.main + modelName + config.NEWARepository.controllerPaths.extension, controllTemplate, (err: NodeJS.ErrnoException) => {

                                    if (err) {
                                        this.spinner.fail();
                                        Log.error('Failed to generate controller.');
                                        process.exit();
                                    }
                                    else {

                                        this.attachControllerToServer(modelName+'Controller',(controllerPath: string) => {
                                            let response: Array<ServiceResponse> = [];

                                            response.push({
                                                type: ServiceResponseType.created,
                                                message: path.join(process.cwd(), config.NEWARepository.controllerPaths.main, modelName + config.NEWARepository.controllerPaths.extension)
                                            });

                                            if (controllerPath) {
                                                response.push({
                                                    type: ServiceResponseType.updated,
                                                    message: controllerPath
                                                });
                                            }

                                            callback(response);
                                        });
                                    }
                                });

                            }
                        });

                    }
                    else {
                        this.spinner.fail();
                        Log.error(businessResponse.error.title);
                        Log.highlight(businessResponse.error.message);
                        process.exit();
                    }
                });
            }
            else {
                this.spinner.fail();
                Log.error(response.error.title);
                Log.highlight(response.error.message);
                process.exit();
            }

        });
    }

    // Used when creating a blank project
    disattachControllerFromServer(projectPath: string, callback: Function) {
        const serverFilePath = path.resolve(projectPath, config.NEWARepository.serverFilePath)

        fs.exists(serverFilePath, (exists: boolean) => {

            if (exists) {

                let instream = fs.createReadStream(serverFilePath);
                let rl = readline.createInterface(instream, new stream.Writable);
                let data = '';
                let insertLine = true;

                rl.on('line', (line) => {
                    
                    if(line.indexOf('import') > -1 && line.toLowerCase().indexOf('controller/controllers') > -1){
                        insertLine = false;
                    }
                    // Remove comments that starts with '//import'
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

    private attachControllerToServer(controllerFullName: string, callback: Function) {
        const serverFilePath = path.resolve(process.cwd(), config.NEWARepository.serverFilePath);

        fs.exists(serverFilePath, (exists: boolean) => {

            if (exists) {

                let instream = fs.createReadStream(serverFilePath);
                let rl = readline.createInterface(instream, new stream.Writable);
                let data = '';
                let isImportLine = false, isAlreadyImported = false, isLastImportWord = false, insertLine = true;
                let imporLinePos = 0;

                rl.on('line', (line) => {

                    if(line.indexOf('import') && line.toLowerCase().indexOf('controller/' + controllerFullName.toLowerCase()) > -1){
                        isAlreadyImported = true;
                    }
                    
                    if (line.indexOf('import') > -1){
                        isImportLine = true;
                    }
                    // Save the positions of the last 'import' line
                    else if (line.indexOf('import') < 0 && isImportLine){
                        isImportLine = false;
                        imporLinePos = data.length;
                    }

                    // If found class it is beacause the last 'import' position was found
                    // So import to the file here
                    if(line.indexOf('class') > -1 && line.toLowerCase().indexOf('server') > -1){
                        let controllerImportPath = path.relative(path.resolve('src/'), path.resolve(config.NEWARepository.controllerPaths.main)).replace(/\\/g, '/');
                        let importLine = `import { ${controllerFullName} } from "./${controllerImportPath}/${controllerFullName}";\n\n`
                        
                        data = data.slice(0, imporLinePos) + importLine + data.substr(imporLinePos + importLine.length);
                    }
                    
                    if(line.indexOf('import') < 0 && line.toLowerCase().indexOf('attachcontrollers') > - 1){
                        let attachControllersInitial = line.substr(0, line.indexOf('['));

                        line = attachControllersInitial + `[${controllerFullName}, `+ line.substr(line.indexOf('[') + 1);
                    }

                    if(insertLine){
                        data += line + '\n';
                    }
                    
                });

                rl.on('close', () => {
                    
                    if(!isAlreadyImported){
                        fs.writeFile(serverFilePath, data, 'utf8', (err: NodeJS.ErrnoException) => {

                            if (err) {
                                callback('');
                            }
                            else {
                                callback(path.join(serverFilePath));
                            }

                        });
                    }
                    else{
                        callback('');
                    }
                });

            }
            else {
                callback('');
            }

        });
    }
}
