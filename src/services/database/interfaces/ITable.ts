import { ITableColumn } from "./ITableColumn";

export interface ITable {
    name: string;
    columns: Array<ITableColumn>;
}