import { IMysqlSequelizeType } from "../services/model/interfaces/IMysqlSequelizeType";

let MyslToSequelizeTypes: Array<IMysqlSequelizeType>;

MyslToSequelizeTypes.push(
    {
        mysqlType: 'DECIMAL',
        sequelizeType: 'DataType.DECIMAL'
    },
    {
        mysqlType: 'TINY',
        sequelizeType: 'DataType.TINYINT'
    },
    {
        mysqlType: 'SHORT',
        sequelizeType: 'DataType.SMALLINT'
    },
    {
        mysqlType: 'LONG',
        sequelizeType: 'DataType.MEDIUMINT'
    },
    {
        mysqlType: 'LONGLONG',
        sequelizeType: 'DataType.BIGINT'
    },
    {
        mysqlType: 'INTEGER',
        sequelizeType: 'DataType.INTEGER'
    },
    {
        mysqlType: 'INT24',
        sequelizeType: 'DataType.MEDIUMINT'
    },
    {
        mysqlType: 'NULL',
        sequelizeType: 'DataType.NONE'
    },
    {
        mysqlType: 'FLOAT',
        sequelizeType: 'DataType.FLOAT'
    },
    {
        mysqlType: 'DOUBLE',
        sequelizeType: 'DataType.DOUBLE'
    },
    {
        mysqlType: 'TIMESTAMP',
        sequelizeType: 'DataType.DATE'
    },
    {
        mysqlType: 'DATE',
        sequelizeType: 'DataType.DATEONLY'
    },
    {
        mysqlType: 'TIME',
        sequelizeType: 'DataType.TIME'
    },
    {
        mysqlType: 'DATETIME',
        sequelizeType: 'DataType.DATE'
    },
    {
        mysqlType: 'VARCHAR',
        sequelizeType: 'DataType.STRING'
    },
    {
        mysqlType: 'STRING',
        sequelizeType: 'DataType.STRING'
    },
    {
        mysqlType: 'ENUM',
        sequelizeType: 'DataType.ENUM'
    },
    {
        mysqlType: 'GEOMETRY',
        sequelizeType: 'DataType.GEOMETRY'
    },
    {
        mysqlType: 'TEXT',
        sequelizeType: 'DataType.TEXT'
    },
    {
        mysqlType: 'BOOLEAN',
        sequelizeType: 'DataType.BOOLEAN'
    },
    {
        mysqlType: 'BLOB',
        sequelizeType: 'DataType.BLOB'
    },
    {
        mysqlType: 'DECIMAL',
        sequelizeType: 'DataType.DECIMAL'
    },
    {
        mysqlType: 'CHAR',
        sequelizeType: 'DataType.CHAR'
    }
   
)
