import * as mysql from 'mysql';
import { IDatabaseConnection } from "./interfaces/IDatabaseConnection";
import { LogErrorResponse } from '../../utils/LogErrorResponse';
import { BaseResponse } from '../../utils/BaseResponse';
import { Table } from './classes/table';
import { TableColumn } from './classes/tableColumn';

export class DatabaseService {

    listOfTables: Array<Table> = [];
    private mysqlConnection: mysql.Connection;
    private response: BaseResponse;

    constructor() {
        this.response = new BaseResponse();
    }

    connect(databaseConnection: IDatabaseConnection, callback: Function) {

        switch (databaseConnection.dialect) {

            case 'mysql':
                this.mysqlGetTablesAndAttributes(databaseConnection, callback);
                break;

            default:
                //Implement others dialects connections
                break;
        }

    }

    private mysqlGetTablesAndAttributes(databaseConnection: IDatabaseConnection, callback: Function) {

        this.mysqlConnection = mysql.createConnection({
            host: databaseConnection.host,
            user: databaseConnection.username,
            password: databaseConnection.password,
            database: databaseConnection.database
        });

        this.mysqlConnection.connect((err: mysql.MysqlError) => {
            if (err) {
                this.response.success = false;
                this.response.error = new LogErrorResponse(`Could not connect to "${databaseConnection.environment}" environment`, err.message);
                callback(this.response);
                return false;
            }

            // List all tables
            this.mysqlConnection.query('SHOW TABLES', (err: mysql.MysqlError, tables: Array<any>) => {
                if (err) {
                    this.response.success = false;
                    this.response.error = new LogErrorResponse(`Insuficient previlegies in database "${databaseConnection.database}"`, err.message);
                    callback(this.response);
                    return false;
                }

                // Get tables names
                tables.forEach((table) => {
                    this.listOfTables.push({ name: table[Object.keys(table)[0]], columns: [] });
                });

                // Get tables attributes
                this.listOfTables.forEach((table: Table, index: number) => {

                    this.mysqlConnection.query('DESCRIBE ' + table.name, (err: mysql.MysqlError, tableColumns: Array<TableColumn>) => {
                        if (err) {
                            this.response.success = false;
                            this.response.error = new LogErrorResponse(`Insuficient previlegies in database "${databaseConnection.database}" for table ${table.name}`, err.message);
                            callback(this.response);
                            return false;
                        }

                        table.columns = tableColumns;

                        // Success
                        if (index == this.listOfTables.length - 1) {
                            this.response.success = true;
                            this.response.error = null;
                            callback(this.response);
                        }
                    });

                });// End of foreach

            });

        }); //End Mysql Connection
    }
}