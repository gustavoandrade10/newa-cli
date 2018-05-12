import {Log} from '../../utils/log';
import * as fs from 'fs';
import * as path from 'path';
import * as Ora from 'ora';
import { DatabaseService } from '../database/database.service';
import { IDatabaseConnection } from '../database/interfaces/IDatabaseConnection';
import { config } from '../../config/config';
import { BaseResponse } from '../../utils/BaseResponse';

export class ModelService {

    private databaseConnection: IDatabaseConnection;
    private modelName: string;
    private spinner: Ora;
    private database: DatabaseService;
    constructor() {
        this.spinner = new Ora();
        this.database = new DatabaseService();
    }

    newModel = (modelName: string, dataBaseConfig: string) => {
        this.modelName = modelName;

        this.spinner.text = `Generating model(${this.modelName}) ...`;
        this.spinner.color = 'yellow';
        this.spinner.start();

        fs.readFile(path.resolve(process.cwd(), config.NEWARepository.databaseConfigPath), 'utf8', (err: NodeJS.ErrnoException, data: Buffer) => {

            let JsonDatabaseConfig = JSON.parse(data.toString());

            if (JsonDatabaseConfig) {

                // If user dont passe enviroment tag --e  then gets the first connection of json config file
                this.databaseConnection = dataBaseConfig == 'default' ? JsonDatabaseConfig[Object.keys(JsonDatabaseConfig)[0]] : JsonDatabaseConfig[dataBaseConfig];

                if (this.databaseConnection) {
                    
                    this.database.connect(this.databaseConnection, (response: BaseResponse) => {

                        if(response.success){
                            
                            let modelTable = this.database.listOfTables.find((table) => table.name == this.modelName);

                            if(modelTable){
                               //do the model logic here
                            }  
                            else{
                                this.spinner.stop();
                                Log.error(`Could not find a table in database "${this.databaseConnection.database}" with name "${this.modelName}".`);
                                process.exit();
                            }
                        }
                        else{
                            this.spinner.stop();
                            Log.error(response.error.title);
                            Log.yellow(response.error.message);
                        }
                    });

                }
                else {
                    this.spinner.stop();
                    Log.error(`Could not find the enviroment "${dataBaseConfig}" on database config file.`);
                    Log.yellow(` database config file path to search: ${path.resolve(process.cwd(), config.NEWARepository.databaseConfigPath)}`);
                }

            }
            else {
                this.spinner.stop();
                Log.error(`The database config json file is empty`);
                Log.yellow(` database config file path to search: ${path.resolve(process.cwd(), config.NEWARepository.databaseConfigPath)}`);
            }
        });
    }


    //It will be called when found a table with same name as model in database.
/*    private handleTableModel(databaseTableName: string){

    //TODO
    private createModel(){

let text = 
`import {Table, Column, Model, DataType, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
        
@Table({
    tableName: '${this.modelName}',
    timestamps: true
})
export class ${this.modelName} extends Model<${this.modelName}> {
    
        
}`;
        
        fs.writeFile(path.resolve(process.cwd(), config.NEWARepository.modelsPath, this.modelName + ".ts"), text, function (err) {
            if (err) throw err;
            console.log('Saved!');
            
        this.spinner.stop();
        process.exit();
          });

    }*/
}