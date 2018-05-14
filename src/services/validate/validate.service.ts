import * as fs from 'fs';
import * as path from 'path';
import { config } from '../../config/config';
import { BaseResponse } from '../../utils/BaseResponse';
import { LogErrorResponse } from '../../utils/LogErrorResponse';

export class ValidateService {

    constructor() { }

    isInsideNEWAProject(): boolean {
        let InvalidPathException = {};
        let response: boolean = true;

        try {
            config.NEWARepository.baseFoldersStructure.forEach((p) => {
                if (!fs.existsSync(path.resolve(process.cwd(), p))) {
                    throw InvalidPathException;
                }
            });
        }
        catch (e) {
            if (e !== InvalidPathException) throw e;
            else response = false;
        }

        return response;
    }

    // Checks if a model exists and if it is valid (has 'export class modelName')
    modelAndClassExists(modelName: string, callback: Function) {

        this.verifyFileAndClass(path.resolve(config.NEWARepository.modelsPath), modelName + '.ts', modelName, (response: BaseResponse) => {

            if (response.error && response.error.title === 'FILE_NOT_FOUND') {
                response.error.title = 'MODEL_FILE_NOT_FOUND';
                response.error.message = `Could not find model @!${modelName}.ts!@ file in ${config.NEWARepository.modelsPath}`;
            }
            else if (response.error && response.error.title === 'FILE_CLASS_NOT_FOUND') {
                response.error.title = 'INVALID_MODEL_FILE';
                response.error.message = `Could not find @!"export class ${modelName}"!@ member on model @!${modelName}.ts!@ file in ${config.NEWARepository.modelsPath}`;
            }

            callback(response);
        })

    }

    // Checks if a repository exists and if it is valid (has 'export class modelNameRepository')
    repositoryAndClassExists(modelName: string, callback: Function) {

        this.verifyFileAndClass(path.resolve(config.NEWARepository.repositoryPaths.main), modelName + config.NEWARepository.repositoryPaths.extension, modelName, (response: BaseResponse) => {

            if (response.error && response.error.title === 'FILE_NOT_FOUND') {
                response.error.title = 'REPOSITORY_FILE_NOT_FOUND';
                response.error.message = `Could not find repository @!${modelName}${config.NEWARepository.repositoryPaths.extension}!@ file in ${config.NEWARepository.repositoryPaths.main}`;
            }
            else if (response.error && response.error.title === 'FILE_CLASS_NOT_FOUND') {
                response.error.title = 'INVALID_REPOSITORY_FILE';
                response.error.message = `Could not find @!"export class ${modelName}Repository"!@ member on repository @!${modelName}${config.NEWARepository.repositoryPaths.extension}!@ file in ${config.NEWARepository.repositoryPaths.main}`;
            }

            callback(response);
        })

    }

     // Checks if a business exists and if it is valid (has 'export class modelNameBusiness')
     businessAndClassExists(modelName: string, callback: Function) {

        this.verifyFileAndClass(path.resolve(config.NEWARepository.businessPaths.main), modelName + config.NEWARepository.businessPaths.extension, modelName, (response: BaseResponse) => {

            if (response.error && response.error.title === 'FILE_NOT_FOUND') {
                response.error.title = 'BUSINESS_FILE_NOT_FOUND';
                response.error.message = `Could not find business @!${modelName}${config.NEWARepository.businessPaths.extension}!@ file in ${config.NEWARepository.businessPaths.main}`;
            }
            else if (response.error && response.error.title === 'FILE_CLASS_NOT_FOUND') {
                response.error.title = 'INVALID_BUSINESS_FILE';
                response.error.message = `Could not find @!"export class ${modelName}Business"!@ member on business @!${modelName}${config.NEWARepository.businessPaths.extension}!@ file in ${config.NEWARepository.businessPaths.main}`;
            }

            callback(response);
        })

    }

    //Check if repository default folder contains IBaseRepository, BaseRepository classes;
    hasRepositoryBaseClasseInterface(callback: Function) {
        let response = new BaseResponse();

        if (fs.existsSync(path.resolve(config.NEWARepository.repositoryPaths.interfaces, 'IBaseRepository.ts'))) {
            if (fs.existsSync(path.resolve(config.NEWARepository.repositoryPaths.main, 'BaseRepository.ts'))) {
                response.success = true;
                callback(response);
            }
            else {
                response.success = false;
                response.error = new LogErrorResponse('Cannot generate repository without "BaseRepository.ts" file.', `BaseRepository folder path: @!${config.NEWARepository.repositoryPaths.main}!@`)
                callback(response);
            }
        }
        else {
            response.success = false;
            response.error = new LogErrorResponse('Cannot generate repository without "IBaseRepository.ts" file.', `IBaseRepository folder path: @!${config.NEWARepository.repositoryPaths.interfaces}!@`)
            callback(response);
        }

    }

    //Check if business default folder contains IBaseBusiness, BaseBusiness classes;
    hasBusinessBaseClasseInterface(callback: Function) {
        let response = new BaseResponse();

        if (fs.existsSync(path.resolve(config.NEWARepository.businessPaths.interfaces, 'IBaseBusiness.ts'))) {
            if (fs.existsSync(path.resolve(config.NEWARepository.businessPaths.main, 'BaseBusiness.ts'))) {
                response.success = true;
                callback(response);
            }
            else {
                response.success = false;
                response.error = new LogErrorResponse('Cannot generate business without "BaseBusiness.ts" file.', `BaseBusiness folder path: @!${config.NEWARepository.businessPaths.main}!@`)
                callback(response);
            }
        }
        else {
            response.success = false;
            response.error = new LogErrorResponse('Cannot generate business without "IBaseBusiness.ts" file.', `IBaseBusiness folder path: @!${config.NEWARepository.businessPaths.interfaces}!@`)
            callback(response);
        }
    }


    // Will check if file exists and if it has 'export class filename' inside of it
    private verifyFileAndClass(fileFolderPath: string, fileNamWithExtension: string, className: string, callback: Function) {
        let response = new BaseResponse();

        if (fs.existsSync(path.resolve(fileFolderPath, fileNamWithExtension))) {

            let fileData = fs.readFileSync(path.resolve(fileFolderPath, fileNamWithExtension));

            if (fileData.indexOf(`export class ${className}`) > -1) {
                response.success = true;
            }
            else {
                response.success = false;
                response.error = new LogErrorResponse('FILE_CLASS_NOT_FOUND', `Could not find "export class" inside of ${fileNamWithExtension} file in ${fileFolderPath}`);
            }

            callback(response);
        }
        else {
            response.success = false;
            response.error = new LogErrorResponse('FILE_NOT_FOUND', `Could not find file: ${fileNamWithExtension} in ${fileFolderPath}`);
            callback(response);
        }

    }
}