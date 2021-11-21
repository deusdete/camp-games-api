'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Helpers = use('Helpers');
const Drive = use('Drive');

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('/auth/login', 'AuthController.login')
Route.post('/auth/register', 'AuthController.register')

Route.get('/files/:fileName', async ({params, response}) => {
    const filePath = `uploads/${params.fileName}`;
    const isExist = await Drive.exists(filePath);

    if (isExist) {
        return response.download(Helpers.tmpPath(filePath));
    }
    return 'File does not exist';
})

Route.delete('/files/:fileName', async ({params, response}) => {
  const filePath = `uploads/${params.fileName}`;
 
  const isExist = await Drive.exists(filePath);
  if (isExist) {
    await Drive.delete(filePath)

    return response.send({message: `Arquivo ${params.fileName} apagado com sucesso.`})
  }
  return 'File does not exist';

})

Route.resource('category', 'CategoryController')
Route.resource('tournament', 'ToumamentController')
Route.resource('ticket', 'TicketController').middleware('auth')
