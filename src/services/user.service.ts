import crypto from "crypto";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Config } from '../config/app';
import { User } from "../models/User";
import { BaseError } from "../exceptions/BaseError";
import { SignUpPayload, UserJwtPayload } from '../types/index';
import { HttpStatusCode } from "../enums/HttpStatusCode";

export class UserService {

  public static async signUp({ name, login, password }: SignUpPayload): Promise<number> {
    const user = await User.create({
      password: password,
      login: login,
      name: name,
    });

    if (!user) {
      throw new BaseError({httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR, name: 'Intrenal server error', description: 'User record was not created'})
    }

    return user.getId();
  }

  public static async login(login: string, password: string): Promise<string> {

    const userRecord: User = await User.findOneByLogin(login);
    
    if (!userRecord) {
      throw new BaseError({httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY, name: 'User not found', description: 'incorected login'});
    }
    
    if (userRecord.getPasswordHash() !== crypto.pbkdf2Sync(password, userRecord.getSalt(), 1000, 64, `sha512`).toString(`hex`)) {
      throw new BaseError({httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY, name: 'Invalid password', description: 'An incorrect password was entered'});
    }
    else {
      return this.genrateJWT({ id: userRecord.getId(), name: userRecord.getName(), login: userRecord.getLogin() });
    }
  }

  public static genrateJWT(data: UserJwtPayload): string {
    const signature: string = Config.signatureJWT;
    const expiration: string = '6h';

    return jwt.sign({ data, }, signature, { expiresIn: expiration });
  }

  public static async checkToken(token: string): Promise<void|User> {
    return await jwt.verify(token, Config.signatureJWT, async (err: Error, payload: JwtPayload) => {
      if (payload){
        const userRecord: User = await User.findOneById(payload.data.id);

        if (!userRecord) {
          throw new BaseError({httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY, name: 'User not found', description: 'incorected login'});
        }

        return await userRecord;
      }
      if (err) throw new BaseError({ httpCode: HttpStatusCode.UNAUTHORIZED, name: 'User not found', description: '' });
    });
  }

}
