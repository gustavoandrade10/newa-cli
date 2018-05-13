import { Log } from '../../utils/log';
import * as fs from 'fs';
import * as path from 'path';
import * as Ora from 'ora';
import { DatabaseService } from '../database/database.service';
import { IDatabaseConnection } from '../database/interfaces/IDatabaseConnection';
import { config } from '../../config/config';
import { BaseResponse } from '../../utils/BaseResponse';
import { Table } from '../database/classes/table';
import { ModelTemplate } from './classes/modelTemplate';
import { MyslToSequelizeTypes } from './constants/MyslToSequelizeTypes';

export class ModelService {

    private databaseConnection: IDatabaseConnection;
    private spinner: Ora;
    private database: DatabaseService;
    constructor() {
        this.spinner = new Ora();
        this.database = new DatabaseService();
    }

    create = (modelName: string, dataBaseConfig: string) => {

        this.spinner.text = `Generating model(${modelName}) ...`;
        this.spinner.color = 'yellow';
        this.spinner.start();

        fs.readFile(path.resolve(process.cwd(), config.NEWARepository.databaseConfigPath), 'utf8', (err: NodeJS.ErrnoException, data: Buffer) => {

            let JsonDatabaseConfig = JSON.parse(data.toString());

            if (JsonDatabaseConfig) {

                // If user dont passe enviroment tag --e  then gets the first connection of json config file
                this.databaseConnection = dataBaseConfig == 'default' ? JsonDatabaseConfig[Object.keys(JsonDatabaseConfig)[0]] : JsonDatabaseConfig[dataBaseConfig];

                if (this.databaseConnection) {

                    this.database.connect(this.databaseConnection, (response: BaseResponse) => {

                        if (response.success) {


                            let modelTable = this.database.listOfTables.find((table) => table.name == modelName);

                            if (modelTable) {
                               
                                modelName =  modelName[0].toUpperCase() + modelName.substr(1);
                                let model = this.getModelFromTable(modelTable, modelName);

                                fs.writeFile(path.resolve(process.cwd(), config.NEWARepository.modelsPath, modelName + ".ts"), model, (err) => {
                                    if (err){
                                        Log.error('Error to generate model.');
                                    }
                                    else{
                                        Log.success("\nSuccess");
                                        Log.success(path.resolve(config.NEWARepository.modelsPath, modelName + ".ts"));
                                    }
                                    
                                    this.spinner.stop();
                                    process.exit();
                                });
                            }
                            else {

                                this.spinner.stop();
                                Log.error(`Could not find a table in database "${this.databaseConnection.database}" with name "${modelName}".`);
                                process.exit();
                            }

                        }
                        else {
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

    private getModelFromTable(table: Table, modelName: string): string {
        let modelTemplate = new ModelTemplate();

        modelTemplate.name = table.name;
        modelTemplate.content = '';

        table.columns.forEach((column) => {
            let dataType, dataTypeValue = '';

            if (column.Type.indexOf('(') > -1) {
                dataType = column.Type.toUpperCase().substr(0, column.Type.indexOf('('));
                dataTypeValue = column.Type.substr(column.Type.indexOf('('));
            }
            else {
                dataType = column.Type.toUpperCase();
            }

            let attributePrimaryKey = `${column.Key === 'PRI' ? ',' : ''}
        ${column.Key == 'PRI' ? 'primaryKey: true,' : ''}
        ${column.Extra == 'auto_increment' ? 'autoIncrement: true' : ''}
    `;

            let attribute = `
    @Column({
        type: ${MyslToSequelizeTypes[dataType].dataType}${dataTypeValue},
        allowNull: ${column.Null == 'NO' ? false : true}${attributePrimaryKey.trim()}
    })
    ${column.Field}: ${MyslToSequelizeTypes[dataType].type};
    `

            modelTemplate.content += attribute;
        });

        modelTemplate.template = modelTemplate.template.replace('{{imports}}', '');
        modelTemplate.template = modelTemplate.template.replace('{{tableName}}', modelTemplate.name);
        modelTemplate.template = modelTemplate.template.replace(/{{name}}/g, modelName);
        modelTemplate.template = modelTemplate.template.replace('{{content}}', modelTemplate.content);

        return modelTemplate.template;

    }

}