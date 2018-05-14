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

    modelAndClassExists(modelName: string, callback: Function){

        this.verifyFileAndClass(path.resolve(config.NEWARepository.modelsPath), modelName + '.ts', modelName, (response:BaseResponse) => {
            
            if(response.error && response.error.title === 'FILE_NOT_FOUND'){
                response.error.title = 'MODEL_FILE_NOT_FOUND';
                response.error.message = `Could not find model @!${modelName}.ts!@ file in ${config.NEWARepository.modelsPath}`;
            }
            else if(response.error && response.error.title === 'FILE_CLASS_NOT_FOUND'){
                response.error.title = 'INVALID_MODEL_FILE';
                response.error.message = `Could not find @!"export class ${modelName}"!@ member on model @!${modelName}.ts!@ file in ${config.NEWARepository.modelsPath}`;
            }

            callback(response);
        })

    }

    hasRepositoryBaseClasseInterface(callback: Function){
        let response = new BaseResponse();

        if(fs.existsSync(path.resolve(config.NEWARepository.repositoryPath.interfaces, 'IBaseRepository.ts'))){
            if(fs.existsSync(path.resolve(config.NEWARepository.repositoryPath.main, 'BaseRepository.ts'))){
                response.success = true;
                callback(response);
            }
            else{
                response.success = false;
                response.error = new LogErrorResponse('Cannot generate repository without "BaseRepository.ts" file.',`BaseRepository folder path: @!${config.NEWARepository.repositoryPath.main}!@`)
                callback(response);
            }
        }
        else{
            response.success = false;
            response.error = new LogErrorResponse('Cannot generate repository without "IBaseRepository.ts" file.',`IBaseRepository folder path: @!${config.NEWARepository.repositoryPath.interfaces}!@`)
            callback(response);
        }
      
    }

    hasBusinessBaseClasseInterface(callback: Function){
        let response = new BaseResponse();

        if(fs.existsSync(path.resolve(config.NEWARepository.businessPath.interfaces, 'IBaseBusiness.ts'))){
            if(fs.existsSync(path.resolve(config.NEWARepository.businessPath.main, 'BaseBusiness.ts'))){
                response.success = true;
                callback(response);
            }
            else{
                response.success = false;
                response.error = new LogErrorResponse('Cannot generate business without "BaseBusiness.ts" file.',`BaseBusiness folder path: @!${config.NEWARepository.businessPath.main}!@`)
                callback(response);
            }
        }
        else{
            response.success = false;
            response.error = new LogErrorResponse('Cannot generate business without "IBaseBusiness.ts" file.',`IBaseBusiness folder path: @!${config.NEWARepository.businessPath.interfaces}!@`)
            callback(response);
        }
    }

      // Will check if file exists and if it has 'export class filename' inside of it
      private verifyFileAndClass(fileFolderPath: string, fileNamWithExtension: string, className:string, callback: Function){
        let response = new BaseResponse();

        if(fs.existsSync(path.resolve(fileFolderPath,fileNamWithExtension))){
          
            let fileData = fs.readFileSync(path.resolve(fileFolderPath,fileNamWithExtension));

            if(fileData.indexOf(`export class ${className}`) > -1){
                response.success = true;
            }
            else{
                response.success = false;
                response.error = new LogErrorResponse('FILE_CLASS_NOT_FOUND', `Could not find "export class" inside of ${fileNamWithExtension} file in ${fileFolderPath}`);
            }

            callback(response);
        }
        else{
            response.success = false;
            response.error = new LogErrorResponse('FILE_NOT_FOUND',`Could not find file: ${fileNamWithExtension} in ${fileFolderPath}`);
            callback(response);
        }
      
    }
}