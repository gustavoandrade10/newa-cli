export var controllerTemplate = 
`import { Response, Params, Controller, Get, Post, Body, Put, Delete } from '@decorators/express';
import { {{modelName}} } from '../../Models/Database/{{modelName}}';
import { BusinessFactory } from '../../Business/Factories/BusinessFactory';
import { I{{modelName}}Business } from '../../Business/Interfaces/I{{modelName}}Business';
import { Authorize } from '../Middlewares/Authorize';

@Controller('/{{routeName}}',[Authorize])
export class {{modelName}}Controller{

  private businessFactory: BusinessFactory;
  private currentBusinnes: I{{modelName}}Business;

  constructor() {
    this.businessFactory =  new BusinessFactory();
    this.currentBusinnes = this.businessFactory.Get{{modelName}}Business();
  }

  @Get('/')
  ListAll(@Response() res) {
    res.send(this.currentBusinnes.ListAll());
  }

  @Get('/:id')
  ListByID(@Response() res, @Params('id') id: number) {
    res.send(this.currentBusinnes.ListByID(id));
  }

  @Post('/')
  Insert(@Response() res, @Body() model: {{modelName}}) {
    res.send(this.currentBusinnes.Insert(model));
  }

  @Put('/:id')
  Update(@Response() res, @Params('id') id: number, @Body() model: {{modelName}}) {
    res.send(this.currentBusinnes.Update(id, model));
  }

  @Delete('/:id')
  Delete(@Response() res, @Params('id') id: number) {
    res.send(this.currentBusinnes.Delete(id));
  }

}
`