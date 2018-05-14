import { Log } from '../../utils/log';
import * as fs from 'fs';
import * as path from 'path';
import * as Ora from 'ora';
import { DatabaseService } from '../database/database.service';
import { IDatabaseConnection } from '../database/interfaces/IDatabaseConnection';
import { config } from '../../config/config';
import { BaseResponse } from '../../utils/BaseResponse';
import { Table } from '../database/classes/table';
import { Model } from './classes/model';
import { MyslToSequelizeTypes } from './constants/MyslToSequelizeTypes';
import { validCreatedDateFields, validUpdatedDateFields } from './constants/validCreatedUpdatedDateFields';

export class ModelService {

    private databaseConnection: IDatabaseConnection;
    private spinner: Ora;
    private database: DatabaseService;
    constructor() {
        this.spinner = new Ora();
        this.database = new DatabaseService();
    }

    create(modelName: string, tableName: string, dataBaseConfig: string){

        this.spinner.text = `Generating model(${modelName}) ...`;
        this.spinner.color = 'yellow';
        this.spinner.start();

        fs.readFile(path.resolve(config.NEWARepository.databaseConfigPath), 'utf8', (err: NodeJS.ErrnoException, data: Buffer) => {

            let JsonDatabaseConfig = JSON.parse(data.toString());

            if (JsonDatabaseConfig) {

                // If user dont passe enviroment tag --e  then gets the first connection of json config file
                this.databaseConnection = dataBaseConfig == 'default' ? JsonDatabaseConfig[Object.keys(JsonDatabaseConfig)[0]] : JsonDatabaseConfig[dataBaseConfig];

                if (this.databaseConnection) {

                    this.database.connect(this.databaseConnection, (response: BaseResponse) => {

                        if (response.success) {
                            let modelTable;

                            //If user provides table name, then use it otherwise use modelName.
                            if(tableName)
                                modelTable = this.database.listOfTables.find((table) => table.name == tableName);
                            else
                                modelTable = this.database.listOfTables.find((table) => table.name == modelName);

                            if (modelTable) {

                                modelName = modelName[0].toUpperCase() + modelName.substr(1);
                                let model = this.getModelFromTable(modelTable, modelName);

                                fs.writeFile(path.resolve(config.NEWARepository.modelsPath, modelName + ".ts"), model, (err: NodeJS.ErrnoException) => {
                                    
                                    this.spinner.stop();

                                    if (err) {
                                        Log.error('Error to generate model.');
                                    }
                                    else {
                                        Log.success((config.NEWARepository.modelsPath + modelName + '.ts'));
                                    }

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
                    Log.highlight(` database config file path to search: @!${path.resolve(process.cwd(), config.NEWARepository.databaseConfigPath)}!@`);
                }

            }
            else {
                this.spinner.stop();
                Log.error(`The database config json file is empty`);
                Log.highlight(` database config file path to search: @!${path.resolve(process.cwd(), config.NEWARepository.databaseConfigPath)}!@`);
            }
        });
    }

    private getModelFromTable(table: Table, modelName: string): string {
        let modelTemplate = new Model();

        modelTemplate.tableName = table.name;
        modelTemplate.name = modelName;
        modelTemplate.content = '';

        table.columns.forEach((column) => {
            let dataType, attribute, dataTypeValue = '';
            const N = "\n"; //Break line
            const T = "\t" //Tab line

            if (column.Type.indexOf('(') > -1) {
                dataType = column.Type.toUpperCase().substr(0, column.Type.indexOf('('));
                dataTypeValue = column.Type.substr(column.Type.indexOf('('));
            }
            else {
                dataType = column.Type.toUpperCase();
            }

            if (validCreatedDateFields[column.Field.toLowerCase()]) {
                
                attribute = `${
                    N+T}@CreatedAt${
                    N+T}${column.Field}: ${MyslToSequelizeTypes[dataType].type};
                `
                modelTemplate.imports += ', CreatedAt';
            }
            else if(validUpdatedDateFields[column.Field.toLowerCase()]){
                attribute = `${
                    N+T}@UpdatedAt${
                    N+T}${column.Field}: ${MyslToSequelizeTypes[dataType].type};
                `
                modelTemplate.imports += ', UpdatedAt';
            }
            else {

                let attributePrimaryKey = `${column.Key === 'PRI' ? ',' : ''}${
                    N+T+T}${column.Key == 'PRI' ? 'primaryKey: true,' : ''}${
                    N+T+T}${column.Extra == 'auto_increment' ? 'autoIncrement: true' : ''}
                `;

                attribute = `${
                    N+T}@Column({${
                        N+T+T}type: ${MyslToSequelizeTypes[dataType].dataType}${dataTypeValue},${
                        N+T+T}allowNull: ${column.Null == 'NO' ? false : true}${attributePrimaryKey.trim()}${
                    N+T}})${
                    N+T}${column.Field}: ${MyslToSequelizeTypes[dataType].type};
                `
            }

            modelTemplate.content += attribute;
        });

        modelTemplate.template = modelTemplate.template.replace('{{imports}}', modelTemplate.imports);
        modelTemplate.template = modelTemplate.template.replace('{{tableName}}', modelTemplate.tableName);
        modelTemplate.template = modelTemplate.template.replace(/{{name}}/g, modelTemplate.name);
        modelTemplate.template = modelTemplate.template.replace('{{content}}', modelTemplate.content);

        return modelTemplate.template;

    }

}