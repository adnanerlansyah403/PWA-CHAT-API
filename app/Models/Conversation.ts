import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'
import User from './User'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sender_id: number

  @column()
  public receiver_id: number
  
  @hasMany(() => Message, {
    foreignKey: 'conversation_id',
  })
  public messages: HasMany<typeof Message>
  
  @belongsTo(() => User, {
    foreignKey: 'sender_id',
  })
  public sender: BelongsTo<typeof User>
  
  @belongsTo(() => User, {
    foreignKey: 'receiver_id',
  })
  public receiver: BelongsTo<typeof User>
  

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
