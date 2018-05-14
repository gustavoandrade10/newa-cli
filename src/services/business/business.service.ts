import {Log} from '../../utils/log';
import * as fs from 'fs';
import * as path from 'path';
import * as Ora from 'ora';
import { config } from '../../config/config';
import { ValidateService } from '../validate/validate.service';
import { BaseResponse } from '../../utils/BaseResponse';

export class BusinessService {

    private spinner: Ora;
    private validateService: ValidateService;
    constructor() {
        this.spinner = new Ora();
        this.validateService = new ValidateService();
    }

    create(businessModelName: string){

        businessModelName = businessModelName[0].toUpperCase() + businessModelName.substr(1);

        this.spinner.text = `Generating business(${businessModelName}Business) ...`;
        this.spinner.color = 'yellow';
        this.spinner.start();

        this.validateService.hasBusinessBaseClasseInterface((response: BaseResponse) => {

            this.spinner.stop();

            if(response.success){
                
            }
            else{
                Log.error(response.error.title);
                Log.highlight(response.error.message);
            }

        });
      
    }

}