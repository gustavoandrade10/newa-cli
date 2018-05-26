import * as fs from 'fs';
import * as path from 'path';
import * as Ora from 'ora';
import * as readline from 'readline';
import * as stream from 'stream';
import { Log } from '../../utils/log';
import { config } from '../../config/config';
import { ValidateService } from '../validate/validate.service';
import { BaseResponse } from '../../utils/BaseResponse';
import { iBusinessTemplate } from './constants/iBusinessTemplate';
import { businessTemplate } from './constants/businessTemplate';
import { ServiceResponse } from '../../utils/ServiceResponse';
import { ServiceResponseType } from '../../enums/ServiceResponseType';

export class BusinessService {

    spinner: Ora;
    private validateService: ValidateService;
    constructor() {
        this.spinner = new Ora({ spinner: 'dots2' });
        this.validateService = new ValidateService();
    }

    create(modelName: string, callback: Function) {

        modelName = modelName[0].toUpperCase() + modelName.substr(1);

        this.spinner.text = `Generating ${modelName}Business...`;
        this.spinner.start();

        this.validateService.hasBusinessBaseClasseInterface((response: BaseResponse) => {


            if (response.success) {

                // Check if model exits and if it is valid "empty files won´t work"
                this.validateService.modelAndClassExists(modelName, (response: BaseResponse) => {

                    if (response.success) {

                        // Check if repository exits and if it is valid "empty files won´t work"
                        this.validateService.repositoryAndClassExists(modelName, (repositoryResponse: BaseResponse) => {

                            if (repositoryResponse.success) {
                                let generatedBusinessInterface = false;

                                //Check if interface alread exists before create
                                fs.exists(path.resolve(config.NEWARepository.businessPaths.interfaces + 'I' + modelName + config.NEWARepository.businessPaths.extension), (exists: boolean) => {

                                    if (exists) {
                                        this.spinner.fail();
                                        Log.highlight(`Already exists business interface file @!I${modelName}${config.NEWARepository.businessPaths.extension}!@.`);
                                    }

                                    else {
                                        fs.writeFile(config.NEWARepository.businessPaths.interfaces + 'I' + modelName + config.NEWARepository.businessPaths.extension, iBusinessTemplate.replace(/{{modelName}}/g, modelName), (err: NodeJS.ErrnoException) => {

                                            if (err) {
                                                this.spinner.fail();
                                                Log.error('Failed to generate business.');
                                            }
                                            else {
                                                generatedBusinessInterface = true;

                                                //Check if classe already exists before create
                                                fs.exists(path.resolve(config.NEWARepository.businessPaths.main + modelName + config.NEWARepository.businessPaths.extension), (exists: boolean) => {

                                                    if (exists) {
                                                        this.spinner.fail();
                                                        Log.highlight(`Already exists business file @!${modelName}${config.NEWARepository.businessPaths.extension}!@.`);
                                                    }
                                                    else {
                                                        fs.writeFile(config.NEWARepository.businessPaths.main + modelName + config.NEWARepository.businessPaths.extension, businessTemplate.replace(/{{modelName}}/g, modelName), (err: NodeJS.ErrnoException) => {

                                                            if (err) {
                                                                this.spinner.fail();
                                                                Log.error('Failed to generate business.');
                                                                process.exit();
                                                            }
                                                            else {
                                                                this.addBusinessToInterfaceBusinessFactory(modelName, (businessInterfaceFactoryPath: string) => {

                                                                    this.addBusinessToBusinessFactory(modelName, (businessFactoryPath: string) => {

                                                                        let response: Array<ServiceResponse> = [];

                                                                        if (generatedBusinessInterface) {
                                                                            response.push({
                                                                                type: ServiceResponseType.created,
                                                                                message: path.join(process.cwd(), config.NEWARepository.businessPaths.interfaces, 'I' + modelName + config.NEWARepository.businessPaths.extension)
                                                                            });
                                                                        }

                                                                        response.push({
                                                                            type: ServiceResponseType.created,
                                                                            message: path.join(process.cwd(), config.NEWARepository.businessPaths.main, modelName + config.NEWARepository.businessPaths.extension)
                                                                        });

                                                                        if (businessInterfaceFactoryPath) {
                                                                            response.push({
                                                                                type: ServiceResponseType.updated,
                                                                                message: businessInterfaceFactoryPath
                                                                            });
                                                                        }

                                                                        if (businessFactoryPath) {
                                                                            response.push({
                                                                                type: ServiceResponseType.updated,
                                                                                message: businessFactoryPath
                                                                            });
                                                                        }

                                                                        callback(response);
                                                                    });

                                                                });
                                                            }

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
                                Log.error(repositoryResponse.error.title);
                                Log.highlight(repositoryResponse.error.message);
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
            else {
                this.spinner.fail();
                Log.error(response.error.title);
                Log.highlight(response.error.message);
                process.exit();
            }

        });

    }

    // Used when creating a blank project
    removeBusinessFactoryDependencies(projectPath: string, callback: Function) {
        const businessFactoryFilePath = path.resolve(projectPath, config.NEWARepository.businessPaths.factories, 'BusinessFactory.ts')

        fs.exists(businessFactoryFilePath, (exists: boolean) => {

            if (exists) {

                let instream = fs.createReadStream(businessFactoryFilePath);
                let rl = readline.createInterface(instream, new stream.Writable);
                let data = '';
                let insertLine = true, isInClassBody = false;

                rl.on('line', (line) => {

                    if (line.indexOf('import') > -1 && line.indexOf('IBusinessFactory') < 0) {
                        insertLine = false;
                    }
                    else {
                        insertLine = true;
                    }

                    if (insertLine && !isInClassBody) {
                        data += line + '\n';
                    }

                    if (line.indexOf('export') > -1 && line.indexOf('class') > -1 && line.indexOf('BusinessFactory') > -1) {
                        isInClassBody = true;
                    }

                });

                rl.on('close', () => {

                    data = data + '}';

                    fs.writeFile(businessFactoryFilePath, data, 'utf8', (err: NodeJS.ErrnoException) => {

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

    // Used when creating a blank project
    removeBusinessFactoryInterfaceDependencies(projectPath: string, callback: Function) {
        const businessFactoryInterfaceFilePath = path.resolve(projectPath, config.NEWARepository.businessPaths.factoryInterfaceFile)

        fs.exists(businessFactoryInterfaceFilePath, (exists: boolean) => {

            if (exists) {

                let instream = fs.createReadStream(businessFactoryInterfaceFilePath);
                let rl = readline.createInterface(instream, new stream.Writable);
                let data = '';
                let insertLine = true, isInClassBody = false;

                rl.on('line', (line) => {

                    if (line.indexOf('import') > -1) {
                        insertLine = false;
                    }
                    else {
                        insertLine = true;
                    }

                    if (insertLine && !isInClassBody) {
                        data += line + '\n';
                    }

                    if (line.indexOf('export') > -1 && line.indexOf('interface') > -1 && line.indexOf('IBusinessFactory') > -1) {
                        isInClassBody = true;
                    }

                });

                rl.on('close', () => {

                    data = data + '}';

                    fs.writeFile(businessFactoryInterfaceFilePath, data, 'utf8', (err: NodeJS.ErrnoException) => {

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

    private addBusinessToBusinessFactory(modelName: string, callback: Function) {

        fs.exists(path.resolve(config.NEWARepository.businessPaths.factories, 'BusinessFactory.ts'), (exists: boolean) => {

            if (exists) {

                fs.readFile(path.resolve(config.NEWARepository.businessPaths.factories, 'BusinessFactory.ts'), 'utf8', (err: NodeJS.ErrnoException, fileData) => {

                    // If method doesn´t exists
                    if (!(fileData.indexOf(`Get${modelName}Business()`) > -1)) {
                        const BL: string = "\n"; //Break line
                        const T: string = "\t" //Tab line
                        var lastBracketPos, businessFactoryClassePos, breakLinePosAfterBusinessFactoryClasse = 0;

                        //Add imports
                        let modelBusinessPath = path.relative(path.resolve(config.NEWARepository.businessPaths.factories), path.resolve(config.NEWARepository.businessPaths.main)).replace(/\\/g, '/');
                        let modelInterfaceBusinessPath = path.relative(path.resolve(config.NEWARepository.businessPaths.factories), path.resolve(config.NEWARepository.businessPaths.interfaces)).replace(/\\/g, '/');
                        let modelRepositoryPath = path.relative(path.resolve(config.NEWARepository.businessPaths.factories), path.resolve(config.NEWARepository.repositoryPaths.main)).replace(/\\/g, '/');

                        let imports: string = `import { ${modelName}Business } from "${modelBusinessPath}/${modelName}Business";${
                            BL}import { I${modelName}Business } from "${modelInterfaceBusinessPath}/I${modelName}Business";${
                            BL}import { ${modelName}Repository } from "${modelRepositoryPath}/${modelName}Repository";\n`

                        //add imports to the beginning
                        fileData = imports + fileData;
                        //End imports


                        //Add private fields
                        let privateFields: string = `{${BL + T}private _i${modelName}Business: I${modelName}Business;`;

                        businessFactoryClassePos = fileData.lastIndexOf('IBusinessFactory');
                        breakLinePosAfterBusinessFactoryClasse = fileData.substr(businessFactoryClassePos).indexOf('{');

                        fileData = fileData.slice(0, (businessFactoryClassePos + breakLinePosAfterBusinessFactoryClasse)) + fileData.substr(businessFactoryClassePos + breakLinePosAfterBusinessFactoryClasse).replace('{', privateFields);
                        // End private fields    

                        // Add Method
                        let insertMethod: string = `${
                            BL + T}public Get${modelName}Business(): I${modelName}Business{${
                            BL + BL + T + T}this._i${modelName}Business = new ${modelName}Business(new ${modelName}Repository());${
                            BL + BL + T + T}return this._i${modelName}Business;${
                            BL + T}}${
                            BL}}`;

                        lastBracketPos = fileData.lastIndexOf('}');
                        // slice the string in 2, one from the start to the lastIndexOf
                        // and then replace the word in the rest
                        fileData = fileData.slice(0, lastBracketPos) + fileData.slice(lastBracketPos).replace('}', insertMethod);


                        fs.writeFile(path.resolve(config.NEWARepository.businessPaths.factories, 'BusinessFactory.ts'), fileData, 'utf8', (err: NodeJS.ErrnoException) => {

                            if (err) {
                                callback('');
                            }
                            else {
                                callback(path.join(process.cwd(), config.NEWARepository.businessPaths.factories, 'BusinessFactory.ts'));
                            }

                        });
                    }
                    else {
                        callback('');
                    }
                });


            }
            else {
                callback('')
            }

        });

    }


    private addBusinessToInterfaceBusinessFactory(modelName: string, callback: Function) {

        fs.exists(path.resolve(config.NEWARepository.businessPaths.factoryInterfaceFile), (exists: boolean) => {

            if (exists) {

                fs.readFile(path.resolve(config.NEWARepository.businessPaths.factoryInterfaceFile), 'utf8', (err: NodeJS.ErrnoException, fileData) => {

                    // If method doesn´t exists
                    if (!(fileData.indexOf(`Get${modelName}Business()`) > -1)) {
                        const BL: string = "\n"; //Break line
                        const T: string = "\t" //Tab line
                        var lastBracketPos, businessFactoryClassePos, breakLinePosAfterBusinessFactoryClasse = 0;

                        //Add imports
                        let modelInterfaceBusinessPath = path.relative(path.resolve(config.NEWARepository.businessPaths.interfaces), path.resolve(config.NEWARepository.businessPaths.interfaces)).replace(/\\/g, '/');
                        modelInterfaceBusinessPath = modelInterfaceBusinessPath.length == 0 ? '.' : modelInterfaceBusinessPath;

                        let imports: string = `import { I${modelName}Business } from "${modelInterfaceBusinessPath}/I${modelName}Business";\n`;

                        //add imports to the beginning
                        fileData = imports + fileData;
                        //End imports

                        // Add Method
                        let insertMethod: string = `${
                            T}Get${modelName}Business(): I${modelName}Business;${
                            BL}}`;

                        lastBracketPos = fileData.lastIndexOf('}');
                        // slice the string in 2, one from the start to the lastIndexOf
                        // and then replace the word in the rest
                        fileData = fileData.slice(0, lastBracketPos) + fileData.slice(lastBracketPos).replace('}', insertMethod);


                        fs.writeFile(path.resolve(config.NEWARepository.businessPaths.factoryInterfaceFile), fileData, 'utf8', (err: NodeJS.ErrnoException) => {

                            if (err) {
                                callback('');
                            }
                            else {
                                callback(path.join(process.cwd(), config.NEWARepository.businessPaths.interfaces, 'IBusinessFactory.ts'));
                            }

                        });
                    }
                    else {
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