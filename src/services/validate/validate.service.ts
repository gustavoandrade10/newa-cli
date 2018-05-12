import * as fs from 'fs';
import * as path from 'path';
import { config } from '../../config/config';

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
}