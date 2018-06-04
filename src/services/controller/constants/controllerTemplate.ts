export var controllerTemplate = 
`import { Response, Params, Controller, Get, Post, Body, Put, Delete } from '@decorators/express';
import { BusinessFactory } from '../../Business/Factories/BusinessFactory';
import { {{modelName}}Business } from '../../Business/Rules/{{modelName}}Business';
import { {{modelName}} } from '../../Models/Database/{{modelName}}';

@Controller('/{{routeName}}')
export class {{modelName}}Controller{

  private businessFactory: BusinessFactory;
  private {{modelNameCamelCase}}Businnes: {{modelName}}Business;

  constructor() {
    this.businessFactory =  new BusinessFactory();
    this.{{modelNameCamelCase}}Businnes = this.businessFactory.Get{{modelName}}Business();
  }

  // @description List all {{modelName}}s
  @Get('/')
  ListAll(@Response() res) {
    res.send(this.{{modelNameCamelCase}}Businnes.ListAll());
  }

  // @description Get {{modelName}} by id
  @Get('/:id')
  GetByID(@Response() res, @Params('id') id: number) {
    res.send(this.{{modelNameCamelCase}}Businnes.GetByID(id));
  }

  // @description Create new {{modelName}}
  @Post('/')
  Insert(@Response() res, @Body() model: {{modelName}}) {
    res.send(this.{{modelNameCamelCase}}Businnes.Insert(model));
  }

  // @description Update {{modelName}} by id
  @Put('/:id')
  Update(@Response() res, @Params('id') id: number, @Body() model: {{modelName}}) {
    res.send(this.{{modelNameCamelCase}}Businnes.Update(id, model));
  }

  // @description Delete {{modelName}} by id
  @Delete('/:id')
  Delete(@Response() res, @Params('id') id: number) {
    res.send(this.{{modelNameCamelCase}}Businnes.Delete(id));
  }

}
`