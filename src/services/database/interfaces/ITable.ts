import { ITableColumn } from "./ITableColumn";

export interface ITable {
    name: string;
    attributes: Array<ITableColumn>;
}