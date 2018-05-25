export var modelTemplate = 
`import { Table, Column, Model, DataType{{imports}} } from 'sequelize-typescript';

@Table({
  tableName: '{{tableName}}',
  timestamps: {{timestamps}}
})
export class {{name}} extends Model<{{name}}> {
{{content}}
}
`