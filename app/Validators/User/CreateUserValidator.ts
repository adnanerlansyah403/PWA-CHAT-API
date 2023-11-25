import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomReport from 'App/Reporters/CustomReport'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = CustomReport;

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    email: schema.string([
      rules.email(),
      rules.unique({ table: 'users', column: 'email' })
    ]),
    password: schema.string.optional([
      rules.minLength(4)
    ]),
    name: schema.string.optional(),
    status: schema.boolean.optional(),
    role_id: schema.number.optional(),
    birth_date: schema.string.optional(),
    place_of_birth: schema.string.optional(),
    phone_number: schema.string([
      rules.unique({ table: 'user_profiles', column: 'phone_number' }),
    ]),
    gender: schema.string.optional(),
    address: schema.string.optional(),
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
    'email.email': 'Email must be valid',
    'password.length': 'Password must be at least {{ password.length }} characters',
    'email.unique': 'Invalid email',
    'phone_number.required': 'Phone number is required',
    'phone_number.unique': 'Invalid phone number',
  }
}
