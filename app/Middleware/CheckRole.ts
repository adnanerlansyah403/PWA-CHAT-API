// @ts-ignore
// @ts-nocheck
import I18n from '@ioc:Adonis/Addons/I18n';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import type { GuardsList } from '@ioc:Adonis/Addons/Auth'

export default class CheckRole {
  
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>, allowedRoles: any) {
    const user = auth.user;
    // await user?.load('role'); 
    const roleId = user?.role_id;
    const validRole = allowedRoles.some(role => Number(role) === roleId);

    if(!validRole) {
      return response.error(I18n.locale().formatMessage('messages.access_denied'), 403)
    }

    await next()
  }
}
