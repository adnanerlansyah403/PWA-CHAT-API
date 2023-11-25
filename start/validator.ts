/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import { validator } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'

validator.rule('notSame', (value, _, options) => {

//   console.log(value === options.root[_]);
console.log(options)
  if (value === options.root[_]) {
    options.errorReporter.report(
      options.pointer,
      'notSame',
      'notSame validation failed',
      options.arrayExpressionPointer
    )
  }
})

validator.rule('uniquePhoneForUser', async (value, [userId], options) => {
  const user_id = userId;
  const existingContact = await Database.from('user_contacts')
    .where('user_id', user_id)
    .where('phone', value)
    .first();
    
    
  if (existingContact) {
    options.errorReporter.report(
      options.pointer,
      'uniquePhoneForUser',
      'uniquePhoneForUser validation failed',
      options.arrayExpressionPointer
    )
  }
});

validator.rule('notMyPhone', async (value, _, options) => {
  const existingContact = await Database.from('user_profiles')
    .where('phone_number', value)
    .first();
        
  if (existingContact) {
    options.errorReporter.report(
      options.pointer,
      'notMyPhone',
      'notMyPhone validation failed',
      options.arrayExpressionPointer
    )
  }
});

