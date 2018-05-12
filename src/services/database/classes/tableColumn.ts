import { ITableColumn } from "../interfaces/ITableColumn";

export class TableColumn implements ITableColumn {
    Field: string;
    Type: string;
    Null: string;
    Key: string;
    Default: string;
    Extra: string;
}