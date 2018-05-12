import { ITable } from "../interfaces/ITable";
import { TableColumn } from "./tableColumn";

export class Table implements ITable {
    name: string;
    attributes: TableColumn[];
}