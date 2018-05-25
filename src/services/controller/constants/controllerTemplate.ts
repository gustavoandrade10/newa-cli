export var controllerTemplate = 
`import { Response, Params, Controller, Get, Post, Body, Put, Delete } from '@decorators/express';
import { {{modelName}} } from '../../Models/Database/{{modelName}}';
import { BusinessFactory } from '../../Business/Factories/BusinessFactory';
import { I{{modelName}}Business } from '../../Business/Interfaces/I{{modelName}}Business';
import { Authorize } from '../Middlewares/Authorize';

@Controller('/{{routeName}}')
export class {{modelName}}Controller{

  private businessFactory: BusinessFactory;
  private currentBusinnes: I{{modelName}}Business;

  constructor() {
    this.businessFactory =  new BusinessFactory();
    this.currentBusinnes = this.businessFactory.Get{{modelName}}Business();
  }

  // @description List all {{modelName}}s
  @Get('/')
  ListAll(@Response() res) {
    res.send(this.currentBusinnes.ListAll());
  }

  // @description Get {{modelName}} by id
  @Get('/:id')
  ListByID(@Response() res, @Params('id') id: number) {
    res.send(this.currentBusinnes.ListByID(id));
  }

  // @description Create new {{modelName}}
  @Post('/')
  Insert(@Response() res, @Body() model: {{modelName}}) {
    res.send(this.currentBusinnes.Insert(model));
  }

  // @description Update {{modelName}} by id
  @Put('/:id')
  Update(@Response() res, @Params('id') id: number, @Body() model: {{modelName}}) {
    res.send(this.currentBusinnes.Update(id, model));
  }

  // @description Delete {{modelName}} by id
  @Delete('/:id')
  Delete(@Response() res, @Params('id') id: number) {
    res.send(this.currentBusinnes.Delete(id));
  }

}
`