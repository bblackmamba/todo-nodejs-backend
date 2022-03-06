import { Client, QueryResult } from 'pg';
import { User } from './User';
import { Item } from './todo.item';
import { Config } from '../config/app';

export class db {
  private static client: Client;

  private static async init (): Promise<void> {
    db.client = new Client({
      user: Config.pgUser,
      host: Config.pgHost,
      database: Config.pgDatabase,
      password: Config.pgPassword,
      port: Config.pgPort,
    });

    db.client.connect().catch((e) => {
      console.log(e.message);
      process.exit(22);
    });

    db.client.query(`CREATE TABLE IF NOT EXISTS ${User.tableName}(
      id serial PRIMARY KEY,
      name VARCHAR(20) NOT NULL,
      login VARCHAR(20) NOT NULL,
      password_hash VARCHAR NOT NULL,
      salt VARCHAR NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`).catch((e) => console.log(e.message));
    
    db.client.query(`CREATE TABLE IF NOT EXISTS ${Item.tableName}(
      id serial PRIMARY KEY,
      text VARCHAR(50) NOT NULL,
      is_completed BOOLEAN DEFAULT FALSE,
      user_id INTEGER REFERENCES users (id) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`).catch((e) => console.log(e.message));

    db.client.query(`INSERT INTO users (name, login, password)  VALUES ('ewfawef', 'log', '$argon2i$v=19$m=4096,t=3,p=1$8vobABpk4uI64vBJAphu4g$cpydfswRFF0rzI1VWiQu+a25GTRuOHWeZDD0XiV3yBM');`).catch((e) => console.log(e.message));
  }

  public static getClient(): Client {
    if (!db.client) {
      db.init();
    }
    return db.client;
  }

  public static async selectAll(tableName: string, by: string = 'created_at'): Promise<any[]> {
    const items = await this.getClient().query(`SELECT * FROM todo_items ORDER BY created_at;`);
    
    if (items) {
        return items.rows;
    } else {
      return [];
    }
  }

  public static async selectWhere(tableName: string, whereKey: string, whereValue: any): Promise<QueryResult> {
    const item: QueryResult = await this.getClient().query(`SELECT * FROM ${tableName} WHERE ${whereKey} = '${whereValue}' ORDER BY created_at;`);

    return item;
  }
}
