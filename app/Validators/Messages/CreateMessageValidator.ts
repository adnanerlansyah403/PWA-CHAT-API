// @ts-ignore
// @ts-nocheck
import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomReport from 'App/Reporters/CustomReport'

export default class CreateMessageValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = CustomReport;

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    // conversation_id: schema.number([
    //   // rules.unique({ table: 'conversations', column: 'id' })
    // ]),
    sender_id: schema.number([
      // rules.unique({ table: 'users', column: 'id' })
      rules.notSame('receiver_id')
    ]),
    receiver_id: schema.number([
      // rules.unique({ table: 'users', column: 'id' })
      rules.notSame('sender_id')
    ]),
    content: schema.string(),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'sender_id.notSame': `User shouldn't be same as receiver`,
    'receiver_id.notSame': `User shouldn't be same as sender`,
    'content.required': 'Message is required',
  }
}
