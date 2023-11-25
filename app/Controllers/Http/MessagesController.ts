// @ts-check
// @ts-ignore
// @ts-nocheck
import I18n from '@ioc:Adonis/Addons/I18n';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext';
import Conversation from 'App/Models/Conversation';
import Message from 'App/Models/Message';
import CreateMessageValidator from 'App/Validators/Messages/CreateMessageValidator';
import { customPaginate } from "../../../helpers/paginate"
import Ws from 'App/Services/Ws'

export default class MessagesController {
  public async index({ socket, request, auth, response }: WsContextContract) {
    /**
     * get params & references data
     */

    const queries = request?.qs();
    const user = auth.use('api').user;

    /**
     * Build Query
     */
    const getQuery = async () => {
      const query = `
        SELECT
          c.id AS conversation_id,
          c.sender_id as sender_id,
          json_agg(
            json_build_object(
              'id', m.id, 
              'sender_id', m.sender_id, 
              'receiver_id', m.receiver_id, 
              'is_readed', m.is_readed,
              'content', m.content,
              'created_at', m.created_at,
              'updated_at', m.updated_at
            )
            ORDER BY m.created_at ${queries?.orderBy?.toUpperCase() || 'ASC'}
          ) AS messages,
          CASE
            WHEN c.sender_id = ? THEN row_to_json(receiver_profile.*)
            WHEN c.receiver_id = ? THEN row_to_json(sender_profile.*)
          END AS user_profile
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        LEFT JOIN user_profiles sender_profile ON c.sender_id = sender_profile.user_id
        LEFT JOIN user_profiles receiver_profile ON c.receiver_id = receiver_profile.user_id
        WHERE c.sender_id = ? OR c.receiver_id = ?
        GROUP BY c.id, c.sender_id, c.receiver_id, sender_profile.id, receiver_profile.id;
      `;

      const result = await Database.rawQuery(query, [user?.id, user?.id, user?.id, user?.id]);

      return result.rows;
    }

    let messages = await getQuery();

    const data = customPaginate(messages)

    return data;
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(CreateMessageValidator);
    
    const trx = await Database.transaction();
    try {
      const user = auth.user;

      // Find the previous conversation
      /** Select All Conversations */
      const allConversations = await trx
        .query()
        .from('conversations')
        .select('*');
      /** Checking the conversation that already made before if there is */
      const previousConversation = allConversations.find(conversation => {
        const senderId = Number(conversation.sender_id);
        const receiverId = Number(conversation.receiver_id);
        
        if (
          (senderId === payload.sender_id && receiverId === payload.receiver_id) ||
          (senderId === payload.receiver_id && receiverId === payload.sender_id)
        ) {
          return true;
        }
        return false;
      });
      /** If there's a previously conversation than don't create a new one just create the new message */
      if(previousConversation) {
        // Insert the message
        const message = await trx
        .insertQuery()
        .table('messages')
        .insert({
          conversation_id: previousConversation.id,
          sender_id: payload.sender_id ?? user.id,
          receiver_id: payload.receiver_id,
          content: payload.content
        })
      } else {

        // Insert the conversation
        const conversation = await trx
          .insertQuery()
          .table('conversations')
          .insert({
            sender_id: payload.sender_id ?? user.id,
            receiver_id: payload.receiver_id,
          }).withData();

          // Insert the message
          const message = await trx
            .insertQuery()
            .table('messages')
            .insert({
              conversation_id: conversation.id,
              sender_id: payload.sender_id ?? user.id,
              receiver_id: conversation.receiver_id,
              content: payload.content
            })
      }

      await trx.commit();

      return response.success('Message sent successfully');
    } catch (error) {
      await trx.rollback();
      return response.error(I18n.locale().formatMessage('messages.something_wrong'));
    }
  }

  public async show({ request, auth, response }: HttpContextContract) {
    /**
     * get params & queries
     */
    let queries = request?.qs();
    let params = request?.params();

    try {
      /**
       * Update messages
       */
      let query = `
        UPDATE messages
        SET is_readed = true
        WHERE id = ?
      `
      await Database.rawQuery(query, [params?.messageId])

      return response.success('Message updated successfully');
    } catch (error) {
      console.log(error)
      return response.error(I18n.locale().formatMessage('messages.something_wrong'));
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({ request, auth, response }: HttpContextContract) {
    const messageSchema = schema.create({
      isReaded: schema.boolean(),
      content: schema.string(),
    })
    const payload = await request.validate({ schema: messageSchema, messages: {
      required: 'The {{ field }} is required',
    }});
    /**
     * get params & queries
     */
    let queries = request?.qs();
    let params = request?.params();

    try {
      /**
       * Update messages
       */
      let query = `
        UPDATE messages
        SET is_readed = true,
          content = ?
        WHERE id = ?
      `
      await Database.rawQuery(query, [payload?.content, params?.messageId])

      return response.success('Message updated successfully');
    } catch (error) {
      console.log(error)
      return response.error(I18n.locale().formatMessage('messages.something_wrong'));
    }

  }

  public async destroy({ request, auth, response }: HttpContextContract) {

  }
}
