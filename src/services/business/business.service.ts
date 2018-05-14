import { Log } from '../../utils/log';
import * as fs from 'fs';
import * as path from 'path';
import * as Ora from 'ora';
import { config } from '../../config/config';
import { ValidateService } from '../validate/validate.service';
import { BaseResponse } from '../../utils/BaseResponse';
import { iBusinessTemplate } from './constants/iBusinessTemplate';
import { businessTemplate } from './constants/businessTemplate';

export class BusinessService {

    private spinner: Ora;
    private validateService: ValidateService;
    constructor() {
        this.spinner = new Ora();
        this.validateService = new ValidateService();
    }

    create(modelName: string) {

        modelName = modelName[0].toUpperCase() + modelName.substr(1);

        this.spinner.text = `Generating business(${modelName}Business) ...`;
        this.spinner.color = 'yellow';
        this.spinner.start();

        this.validateService.hasBusinessBaseClasseInterface((response: BaseResponse) => {


            if (response.success) {

                // Check if model exits and if it is valid "empty files won´t work"
                this.validateService.modelAndClassExists(modelName, (response: BaseResponse) => {

                    if (response.success) {

                        // Check if repository exits and if it is valid "empty files won´t work"
                        this.validateService.repositoryAndClassExists(modelName, (repositoryResponse: BaseResponse) => {
                            if (repositoryResponse.success) {

                                //Check if interface alread exists before create
                                fs.exists(path.resolve(config.NEWARepository.businessPaths.interfaces + 'I' + modelName + config.NEWARepository.businessPaths.extension), (exists: boolean) => {

                                    if (exists) {
                                        this.spinner.stop();
                                        Log.highlight(`Already exists business interface @!"I${modelName}${config.NEWARepository.businessPaths.extension}"!@ file.`);
                                    }

                                    else {
                                        fs.writeFile(config.NEWARepository.businessPaths.interfaces + 'I' + modelName + config.NEWARepository.businessPaths.extension, iBusinessTemplate.replace(/{{modelName}}/g, modelName), (err: NodeJS.ErrnoException) => {

                                            if (err) {
                                                this.spinner.stop();
                                                Log.error('Failed to generate business.');
                                            }
                                            else {
                                                Log.success('\n' + (config.NEWARepository.businessPaths.interfaces + 'I' + modelName + config.NEWARepository.businessPaths.extension));

                                                //Check if classe already exists before create
                                                fs.exists(path.resolve(config.NEWARepository.businessPaths.main + modelName + config.NEWARepository.businessPaths.extension), (exists: boolean) => {

                                                    if (exists) {

                                                        this.spinner.stop();
                                                        Log.highlight(`Already exists business @!"${modelName}${config.NEWARepository.businessPaths.extension}"!@ file.`);
                                                    }
                                                    else {
                                                        fs.writeFile(config.NEWARepository.businessPaths.main + modelName + config.NEWARepository.businessPaths.extension, businessTemplate.replace(/{{modelName}}/g, modelName), (err: NodeJS.ErrnoException) => {

                                                            if (err) {
                                                                this.spinner.stop();
                                                                Log.error('Failed to generate business.');
                                                            }
                                                            else {
                                                                Log.success((config.NEWARepository.businessPaths.main + modelName + config.NEWARepository.businessPaths.extension));
                                                                this.addBusinessToBusinessFactory(modelName);
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
                                this.spinner.stop();
                                Log.error(repositoryResponse.error.title);
                                Log.highlight(repositoryResponse.error.message);
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
            else {
                this.spinner.stop();
                Log.error(response.error.title);
                Log.highlight(response.error.message);
            }

        });

    }

    private addBusinessToBusinessFactory(modelName: string) {

        fs.exists(path.resolve(config.NEWARepository.businessPaths.factories, 'BusinessFactory.ts'), (exists: boolean) => {

            if (exists) {

                fs.readFile(path.resolve(config.NEWARepository.businessPaths.factories, 'BusinessFactory.ts'), 'utf8', (err: NodeJS.ErrnoException, fileData) => {

                    // If method doesn´t exists
                    if (!(fileData.indexOf(`Get${modelName}Business()`) > -1)) {
                        const BL: string = "\n"; //Break line
                        const T: string = "\t" //Tab line
                        var lastBracketPos, businessFactoryClassePos,  breakLinePosAfterBusinessFactoryClasse = 0;
                            
                        //Add imports
                        let modelBusinessPath = path.relative(path.resolve(config.NEWARepository.businessPaths.factories),path.resolve(config.NEWARepository.businessPaths.main)).replace(/\\/g,'/');
                        let modelInterfaceBusinessPath = path.relative(path.resolve(config.NEWARepository.businessPaths.factories),path.resolve(config.NEWARepository.businessPaths.interfaces)).replace(/\\/g,'/');
                        let modelRepositoryPath = path.relative(path.resolve(config.NEWARepository.businessPaths.factories),path.resolve(config.NEWARepository.repositoryPaths.main)).replace(/\\/g,'/');
                        
                        let imports: string = `import { ${modelName}Business } from "${modelBusinessPath}/${modelName}Business";${
                        BL}import { I${modelName}Business } from "${modelInterfaceBusinessPath}/I${modelName}Business";${
                        BL}import { ${modelName}Repository } from "${modelRepositoryPath}/${modelName}Repository";\n`

                        //add imports to the beginning
                        fileData = imports + fileData;
                        //End imports
                        
                        
                        //Add private fields
                        let privateFields: string = `{${BL+T}private _i${modelName}Business: I${modelName}Business;`;

                        businessFactoryClassePos = fileData.lastIndexOf('IBusinessFactory');
                        breakLinePosAfterBusinessFactoryClasse = fileData.substr(businessFactoryClassePos).indexOf('{');
                        
                        fileData = fileData.slice(0, (businessFactoryClassePos + breakLinePosAfterBusinessFactoryClasse)) + fileData.substr(businessFactoryClassePos + breakLinePosAfterBusinessFactoryClasse).replace('{', privateFields);
                        // End private fields    

                        // Add Method
                        let insertMethod: string = `${
                        BL+T}public Get${modelName}Business(): I${modelName}Business{${
                            BL+BL+T+T}this._i${modelName}Business = new ${modelName}Business(new ${modelName}Repository());${
                            BL+BL+T+T}return this._i${modelName}Business;${
                        BL+T}}${
                        BL}}`;

                        lastBracketPos =  fileData.lastIndexOf('}');
                        // slice the string in 2, one from the start to the lastIndexOf
                        // and then replace the word in the rest
                        fileData = fileData.slice(0, lastBracketPos) + fileData.slice(lastBracketPos).replace('}', insertMethod);


                        fs.writeFile(path.resolve(config.NEWARepository.businessPaths.factories, 'BusinessFactory.ts'), fileData, 'utf8', (err: NodeJS.ErrnoException) => {
                            this.spinner.stop();

                            if (err) {
                                process.exit();
                            }
                            else {
                                Log.success(config.NEWARepository.businessPaths.factories + 'BusinessFactory.ts');
                            }

                        });
                    }
                    else{
                        this.spinner.stop();
                    }
                });


            }
            else {
                this.spinner.stop();
            }

        });

    }
}