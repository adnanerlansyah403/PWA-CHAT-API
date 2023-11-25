// @ts-ignore
// @ts-nocheck
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from '@ioc:Adonis/Core/Env'
import User from "App/Models/User";
import I18n from '@ioc:Adonis/Addons/I18n'
import CreateUserValidator from "App/Validators/User/CreateUserValidator";
import Hash from '@ioc:Adonis/Core/Hash'
import Database from "@ioc:Adonis/Lucid/Database";
import Mail from "@ioc:Adonis/Addons/Mail";
import Route from '@ioc:Adonis/Core/Route'
// import ForgotPasswordValidator from "App/Validators/Auth/ForgotPasswordValidator";
// import ResetPasswordValidator from "App/Validators/Auth/ResetPasswordValidator";

export default class AuthController {

    public async me({ request, auth, response }: HttpContextContract) {

      try {
        const isAuth = await auth.use('api').check()
        if(!isAuth) return response.error("Token is not valid")
        const user = auth.use('api').user;
        await user?.load('profile');
        return response.success(user)
      } catch(error) {
        console.log(error);
        return response.error('Token was already expired')
      }
    }

    public async signin({ request, auth, response }: HttpContextContract) {
      const body = request.body();
      const email = body.email;
      const password = body.password;
      const phone_number = body.phone_number;

      try {
        // Query
        const query = `
          SELECT * FROM users 
          LEFT JOIN user_profiles ON users.id = user_profiles.user_id
          WHERE user_profiles.phone_number = ?
          GROUP BY users.id, user_profiles.id;
        `;
        // Get the user
        let user = await Database.rawQuery(query, [phone_number]);
        // Check if phone number of user is exist and valid
        if(user.rows[0]) {
          user = user.rows[0];
          const token = await auth.use('api').generate(user, {
            expiresIn: '1 days',
          })
          return response.success({
            type: token.type,
            token: token.token,
            tokenHash: token.tokenHash,
            user: token.user
          });
        }
        throw new Error()
      } catch(e) {
        console.error(e);
        return response.error('Invalid credentials')
      }
    }

    public async signout({ auth, response }: HttpContextContract) {
      if(await auth.use('api').check() === false) return response.error('Invalid Tokens')
      else await auth.use('api').revoke() 

      return response.success('')
    }

    public async register({ request, response }: HttpContextContract) {
      const { email, password, status, role_id, is_approved, ...restPayload } = await request.validate(CreateUserValidator);
      const payloadUser = { email, password, created_at: new Date(), updated_at: new Date() };
      payloadUser.password = payloadUser.password || '';

      const trx = await Database.transaction();
      try {
        const user = await trx.insertQuery().table('users').insert({...payloadUser}).withoutColumns(['password']);
        await trx.table('user_profiles').insert({
          user_id: user[0].id,
          ...restPayload
        });

        await trx.commit();
        
        const url = Route.makeSignedUrl('api.v1.auth.verifyEmail', {
          email: user[0].email,
        }, {
          expiresIn: '30m',
        });

        await Mail.send((message) => {
          message
            .from(Env.get('DEFAULT_EMAIL'))
            .to(user[0].email)
            .subject('Welcome Onboard!, Let verify your email address')
            .htmlView('emails/welcome', {
              user: user[0],
              url: url,
            });
        });

        return response.success(user);
      } catch (error) {
        console.log(error);
        await trx.rollback();
        return response.error(I18n.locale().formatMessage('messages.something_wrong'));
      }
    }

    public async generateToken({ response }: HttpContextContract) {

      const codes = generateCode(8)

      const expiresIn = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
      const jwtToken = jwt.sign({
        data: codes
      }, Env.get('APP_SECRET_KEY'), { expiresIn: '1d' });

      const dotIndex = jwtToken.indexOf('.');

      const { code, token } = encryptToken(jwtToken.substring(0, dotIndex), jwtToken.substring(dotIndex + 1))

      const data = {
        code, token, expiry: expiresIn
      }

      return response.success(data);

    }

    public async verifyEmail({ request, response }: HttpContextContract) {

      if (request.hasValidSignature()) {
        try {
          const user = await (await User.findByOrFail('email', request.param('email'))).merge({ is_approved: true }).save();
      
          return response.success(user);
        } catch (error) {
          return response.error(I18n.locale().formatMessage('messages.something_wrong'));
        }
      }
    
      return response.error('Signature is missing or URL was tampered')

    }

    public async forgotPassword({ request, response }: HttpContextContract) {

      const payload = await request.validate(ForgotPasswordValidator);
      try {
        const user = await User.findBy('email', payload.email);
        if(!user) return response.error(I18n.locale().formatMessage(`messages.invalid_credentials`))
        
        const url = Route.makeSignedUrl('api.v1.auth.resetPassword', { // url nya di ganti dengan halaman forgot password dari websitenya
          email: user.email,
        }, {
          expiresIn: '30m',
        });

        await Mail.send((message) => {
          message
            .from(Env.get('DEFAULT_EMAIL'))
            .to(user.email)
            .subject("Let's go to change your password")
            .htmlView('auth/change_password', {
              user: user,
              url: url,
            });
        });
        return response.success();
      } catch (error) {
        return response.error(I18n.locale().formatMessage(`messages.${error.code}`), 401);
      }

    }

    public async resetPassword({ request, response }: HttpContextContract) {

      const payload = await request.validate(ResetPasswordValidator);
      
      if (request.hasValidSignature()) {
        try {
          const user = await (await User.findByOrFail('email', request.param('email'))).merge({ password: payload.newPassword }).save();
      
          return response.success(user);
        } catch (error) {
          return response.error(I18n.locale().formatMessage('messages.something_wrong'));
        }
      }
    
      return response.error("Signature is invalid");
      
    }

}
