// @ts-ignore
// @ts-nocheck
import I18n from '@ioc:Adonis/Addons/I18n';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import CreateUserContactValidator from 'App/Validators/Contacts/CreateUserContactValidator';
import { customPaginate } from "../../../helpers/paginate"

export default class UserContactsController {
  public async index({ request, response, auth }: HttpContextContract) {
    /**
     * get the params and queries
     */
    const params = request?.params()
    const queries = request?.qs()
    const user = auth?.use('api').user;

    /**
     * Build the query
     */
    const getQuery = async () => {
      let query = `
        SELECT up.*
        FROM user_profiles up
        WHERE up.user_id != ?
        AND NOT EXISTS (
          SELECT 1
          FROM user_contacts uc
          WHERE uc.phone = up.phone_number
          AND uc.user_id = ?
        );
      `

      const result = await Database.rawQuery(query, [user?.id, user?.id])

      return result.rows;
    }

    const contacts = await getQuery();

    const data = customPaginate(contacts)

    return response.success(data);
  }

  public async getContact({ request, response, auth }: HttpContextContract) {
    /**
     * get the params and queries
     */
    const params = request?.params()
    const queries = request?.qs()
    const user = auth?.use('api').user;

    /**
     * Build the query
     */
    const getQuery = async () => {
      let query = `
        SELECT uc.*, up.* FROM user_contacts uc
        LEFT JOIN user_profiles up ON uc.phone = up.phone_number
        WHERE uc.user_id = ?
        GROUP BY uc.id, up.id;
      `;

      const result = await Database.rawQuery(query, [user?.id])

      return result.rows;
    }

    const contacts = await getQuery();

    const data = customPaginate(contacts)

    return response.success(data);
  }

  public async create({ request, response, auth }: HttpContextContract) {

  }

  public async store({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate(CreateUserContactValidator);
    
    const trx = await Database.transaction();
    try {
      const user = auth.user;
      await user?.load('profile');

      // Checking if user already added the number or not
      const existingContact = await Database.from('user_contacts')
      .where('user_id', user?.id)
      .where('phone', payload.phone)
      .first();
      if(existingContact) return response.error('Contact already exists')
      // Check if user add number of himself
      const isUserNumber = await Database.from('user_profiles')
      .whereLike('phone_number', payload.phone)
      .andWhere('user_id', user?.id)
      .first();
      if(isUserNumber) return response.error("Can't add the number")
      // Check if the number is exist or not on current user that already registered
      const isTheNumberExist = await Database.from('user_profiles')
      .where('phone_number', payload.phone)
      .first();
      if(!isTheNumberExist) return response.error("The number isn't valid");


    
      
      // Insert the message
      await trx
        .insertQuery()
        .table('user_contacts')
        .insert({
          user_id: user.id,
          phone: payload.phone
        });

      await trx.commit();

      return response.success('Contact added successfully');
    } catch (error) {
      await trx.rollback();
      return response.error(I18n.locale().formatMessage('messages.something_wrong'));
    }
  }

  public async show({ request, response }: HttpContextContract) {
    /**
     * get the params and queries
     */
    const params = request?.params()
    const queries = request?.qs()

    /**
     * Build the query
     */
    const getQuery = async () => {
      let query = `
        SELECT uc.*, up.*
        FROM user_contacts uc
        LEFT JOIN user_profiles up ON uc.phone = up.phone_number
        WHERE uc.phone = ?
        GROUP BY uc.id, up.id;
      `;

      const result = await Database.rawQuery(query, [params?.contactId])

      return result.rows[0];
    }

    const contacts = await getQuery();

    const data = customPaginate(contacts)

    return response.success(data);
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ request, response, auth }: HttpContextContract) {

    /**
     * get the params & queries
     */
    const params = request.params();
    const qs = request.qs();
    
    try {
      const user = auth.user;

      /**
       * Update messages
       */
      let query = `
        DELETE user_contacts
        WHERE phone = ? AND user_id = ?
      `
      await Database.rawQuery(query, [qs?.id, user?.id])

      return response.success('Contact deleted successfully');
    } catch (error) {
      return response.error(I18n.locale().formatMessage('messages.something_wrong'));
    }
  }
}
