// @ts-ignore
// @ts-nocheck
import I18n from '@ioc:Adonis/Addons/I18n';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Conversation from 'App/Models/Conversation';
import Message from 'App/Models/Message';
import CreateMessageValidator from 'App/Validators/Messages/CreateMessageValidator';
import { customPaginate } from "../../../helpers/paginate"

export default class ConversationsController {
  public async index({ request, auth, response }: HttpContextContract) {

  }

  public async create({}: HttpContextContract) {}

  public async store({ request, auth, response }: HttpContextContract) {
  }

  public async show({ request, auth, response }: HttpContextContract) {

    /**
     * get params & queries
     */

    const params =  request?.params();
    const queries = request?.qs();
    const user = auth.use('api').user;

    /**
     * Build a query
     */

    const getQuery = async () => {
      let query = `
        SELECT
          c.id AS conversation_id,
          c.sender_id,
          c.receiver_id,
          json_agg(json_build_object(
            'id', m.id, 
            'sender_id', m.sender_id, 
            'receiver_id', m.receiver_id, 
            'is_readed', m.is_readed, 
            'content', m.content,
            'created_at', m.created_at,
            'updated_at', m.updated_at
          ) ORDER BY m.created_at ${queries?.orderBy?.toUpperCase() || 'DESC'}) AS messages,
          CASE
            WHEN c.sender_id = ? THEN row_to_json(receiver_profile.*)
            WHEN c.receiver_id = ? THEN row_to_json(sender_profile.*)
          END AS user_profile
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        LEFT JOIN user_profiles sender_profile ON c.sender_id = sender_profile.user_id
        LEFT JOIN user_profiles receiver_profile ON c.receiver_id = receiver_profile.user_id
        WHERE c.id = ?
        GROUP BY c.id, c.sender_id, c.receiver_id, sender_profile.id, receiver_profile.id;
      `;
      const results = await Database.rawQuery(query, [user?.id, user?.id, Number(params.conversationId)]);

      return results.rows[0];
    }
    let conversation = await getQuery();
    const data = conversation
    
    return response.success(data);

  }

  public async edit({}: HttpContextContract) {}

  public async update({ request, auth, response }: HttpContextContract) {
  }

  public async destroy({ request, auth, response }: HttpContextContract) {

  }
}
