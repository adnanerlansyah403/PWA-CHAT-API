import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Conversation from './Conversation'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public conversation_id: number

  @column()
  public sender_id: number

  @belongsTo(() => User, {
    foreignKey: 'sender_id',
  })
  public sender: BelongsTo<typeof User>
  
  @belongsTo(() => User, {
    foreignKey: 'receiver_id',
  })
  public receiver: BelongsTo<typeof User>
  
  @belongsTo(() => Conversation, {
    foreignKey: 'conversation_id',
  })
  public conversation: BelongsTo<typeof Conversation>
  
  @column()
  public is_readed: boolean

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
