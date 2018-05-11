import * as fs from 'fs';
import * as path from 'path';
import * as mysql from 'mysql';
import * as Ora from 'ora';
import { config } from '../config/config';
import { IDatabaseConnection } from '../interfaces/IDatabaseConnection';
import { Log } from '../utils/log';
import { ITableColumn } from '../interfaces/iTableColumn';

export class ModelService{

    private databaseConnection:IDatabaseConnection;
    private modelName:string; 
    private mysqlCon: mysql.Connection;
    private connectionEnviroment: string;
    private spinner: Ora;
    constructor(){
        this.spinner = new Ora();
    }

    newModel = (modelName: string, dataBaseConfig: string) => {
        this.modelName = modelName;

        this.spinner.text = `Generating model(${this.modelName}) ...`;
        this.spinner.color = 'yellow';
        this.spinner.start();

        fs.readFile(path.resolve(process.cwd(), config.NEWARepository.databaseConfigPath), 'utf8', (err: NodeJS.ErrnoException, data: Buffer) => {

            let JsonDatabaseConfig = JSON.parse(data.toString());

            if(JsonDatabaseConfig){

                // If user dont passe enviroment tag --e  then gets the first connection of json config file
                this.databaseConnection = dataBaseConfig == 'default' ? JsonDatabaseConfig[Object.keys(JsonDatabaseConfig)[0]] : JsonDatabaseConfig[dataBaseConfig];
                this.connectionEnviroment = dataBaseConfig == 'default' ? Object.keys(JsonDatabaseConfig)[0] : dataBaseConfig;

               if(this.databaseConnection){
                    this.handleConnection();
               }
               else{
                   this.spinner.stop();
                   Log.error(`Could´nt find the enviroment "${dataBaseConfig}" on database config file.`);
                   Log.yellow(` database config file path to search: ${path.resolve(process.cwd(),config.NEWARepository.databaseConfigPath)}`);
               }
               
            }
            else{
                this.spinner.stop();
                Log.error(`The database config json file is empty`);
                Log.yellow(` database config file path to search: ${path.resolve(process.cwd(),config.NEWARepository.databaseConfigPath)}`);
            }
        });
    }


    //This method will be call when this.databaseConnetion have data and the config database file have been found.
    private handleConnection(){
        let listOfTables: Array<string> = [];

        this.mysqlCon = mysql.createConnection({
            host: this.databaseConnection.host,
            user: this.databaseConnection.username,
            password: this.databaseConnection.password,
            database: this.databaseConnection.database
        });

        this.mysqlCon.connect((err: mysql.MysqlError) => {
            if(err){
                this.spinner.stop();
                Log.error(`Could not connect to "${this.connectionEnviroment}" environment`);
                Log.yellow(err.message);
                return false;
            }

            //List all tables
            this.mysqlCon.query('SHOW TABLES', (err: mysql.MysqlError, tables: Array<any>) => {
                if(err){
                    this.spinner.stop();
                    Log.error(`Insuficient previlegies in database "${this.databaseConnection.database}"`);
                    Log.yellow(err.message);
                    return false;
                }
                
                tables.forEach((table)=> {
                    listOfTables.push(table[Object.keys(table)[0]]);
                });

                let tableNameFound = listOfTables.find((table) => table == this.modelName);

                if(tableNameFound){
                   this.handleTableModel(tableNameFound);
                }  
                else{
                    this.spinner.stop();
                    Log.error(`Could not find a table in database "${this.databaseConnection.database}" with name "${this.modelName}".`);
                    process.exit();
                }

            });
            
        });
    }

    //It will be called when found a table with same name as model in database.
    private handleTableModel(databaseTableName: string){

        this.mysqlCon.query('DESCRIBE ' + databaseTableName, (err: mysql.MysqlError, tableAttributes: Array<any>) => {
            if(err){
                this.spinner.stop();
                Log.error(`Insuficient previlegies in database "${this.databaseConnection.database}"`);
                Log.yellow(err.message);
                return false;
            }

           tableAttributes.forEach((column: ITableColumn) => {
               //Create here logic to generate model file
                console.log(column.Field);
           });

           this.createModel();
        });
    }

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

    }
}