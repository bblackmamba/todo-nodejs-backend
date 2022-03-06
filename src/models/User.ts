import crypto from 'crypto';
import { QueryResult } from 'pg';
import { db } from "./db";
import { SignUpPayload, UserRecordPayload } from '../types/index';
import { BaseError } from '../exceptions/BaseError';
import { HttpStatusCode } from '../enums/HttpStatusCode';

export class User {
  private id: number;
  private name: string;
  private login: string;
  private passwordHash: string;
  private salt: string;


  public static tableName = 'users';

  public static async create ({name, login, password}: SignUpPayload): Promise<User> {
    try {
      if (await this.findOneByLogin(login) ) {
        console.log(2);
        throw new BaseError({httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY, name: 'This login is used by another user', description: ' '});
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

      const userRecord: QueryResult = await db.getClient().query(`INSERT INTO ${User.tableName} (name, login, password_hash, salt)  VALUES ('${name}', '${login}', 
      '${passwordHash}', '${salt}') RETURNING id;`);

      let user = new User();

      user.id = await userRecord.rows[0].id;
      user.name = name;
      user.login = login;
      user.passwordHash = passwordHash;
      user.salt = salt

      return user;
    } catch (e) {
      throw e;
    }
  }

  public static async findOneById (id: number): Promise<User> {
    const userRecord: UserRecordPayload = (await db.selectWhere(User.tableName, 'id', id)).rows[0];

    if (userRecord) {
      let user = new User();

      user.id = userRecord.id;
      user.name = userRecord.name;
      user.login = userRecord.login;
      user.passwordHash = userRecord.password_hash;
      user.salt = userRecord.salt;

      return user;
    }
    else {
      return;
    }
  }

  public static async findOneByLogin (login: string): Promise<User> {
    const userRecord: UserRecordPayload = (await db.selectWhere(User.tableName, 'login', login)).rows[0];

    if (userRecord) {
      let user = new User();

      user.id = userRecord.id;
      user.name = userRecord.name;
      user.login = userRecord.login;
      user.passwordHash = userRecord.password_hash;
      user.salt = userRecord.salt;

      return user;
    }
    else {
      return
    }
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getLogin(): string {
    return this.login;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }

  public getSalt(): string {
    return this.salt;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setLogin(login: string): void {
    this.login = login;
  }
}