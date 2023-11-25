import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import UserProfile from 'App/Models/UserProfile'

export default class extends BaseSeeder {

  public async run () {
    await User.createMany([
      {
        email: 'johndoe@gmail.com',
        password: 'semuasama',
        status: true,
      },
      {
        email: 'adnanerlansyah403@gmail.com',
        password: 'semuasama',
        status: false
      }
    ])
    await UserProfile.createMany([
      {
        userId: 1,
        name: 'John Doe',
        gender: 'male',
        phone_number: '087748310753',
        address: '123 Main Street',
        place_of_birth: 'Bandung',
        birth_date: '2023-03-27',
      },
      {
        userId: 2,
        name: 'Adnan Erlansyah',
        gender: 'male',
        phone_number: '081957440893',
        address: '123 Main Street',
        place_of_birth: 'Bekasi',
        birth_date: '2023-12-18',
      }
    ])
  }
}
