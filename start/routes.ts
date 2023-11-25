/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

// @ts-ignore
// @ts-nocheck
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route'
import View from '@ioc:Adonis/Core/View';
import { resource } from '../helpers/route';


// Api routes
Route
  .group(() => {
    Route.group(
      () => {

      /**
       * Messages Route
       */
      resource([
        
      ], `MessagesController`, ['auth', 'checkRole:1'], false, false, 'messageId', '/messages');
      
      // Route.get('/messages', 'MessagesController.index').as('messages.index').middleware('auth')

      /**
       * Conversation Route
       */
      resource([
        
      ], `ConversationsController`, ['auth', 'checkRole:1'], false, false, 'conversationId', '/conversations');

      /**
       * User Contact Route
       */
      resource([
        { name: 'mine', isParam: false, method: 'get', action: 'getContact' }
      ], `UserContactsController`, ['auth', 'checkRole:1'], false, false, 'contactId', '/contacts');

      Route.group(() => {

        // Authentication routes
        Route.get('/me', 'AuthController.me').as('me');
        Route.post('/signin', 'AuthController.signin').as('signin');
        Route.post('/signout', 'AuthController.signout').as('signout');
        Route.post('/register', 'AuthController.register').as('register');
        Route.post('/forgot-password', 'AuthController.forgotPassword').as('forgotPassword');
        
        
      }).prefix('/auth').as('auth').middleware([]);
      // Verify email
      Route.get('/verify/:email', 'AuthController.verifyEmail').as('auth.verifyEmail').prefix('/auth');
      // Change password
      Route.post('/reset-password/:email', 'AuthController.resetPassword').as('auth.resetPassword').prefix('/auth');
      
      // Generate App Token
      Route.post('auth/token/generate', 'AuthController.generateToken').as('token');

    })
      .prefix('/v1')
      .as('v1')
  })
  .prefix('/api')
  .as('api')

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

