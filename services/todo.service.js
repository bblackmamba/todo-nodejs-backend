const {Client} = require('pg'),
  config = require('../config/app');

class TodoService {
  
  constructor () {
    this.bd = new Client({
      user: config.pgUser,
      host: config.pgHost,
      database: config.pgDatabase,
      password: config.pgPassword,
      port: config.pgPort,
    });

    this.bd.connect().catch((e) => {
      console.log(e.message);
      process.exit(22);
    });

    this.init();
  }

  async init () {this.bd.query(`CREATE TABLE IF NOT EXISTS todo_items(
      id serial PRIMARY KEY,
      text VARCHAR(50) NOT NULL,
      is_completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`).catch((e) => console.log(e.message));
  }

  async getItems() {
    try {
      const items = (await this.bd.query(`SELECT * FROM todo_items ORDER BY created_at;`).catch((e) => console.log(e.message))).rows;
      if (items) {
          return items.map((element) => {
            return {
              id: element.id,
              text: element.text,
              isCompleted: element.is_completed,
            }
          });
      } else {
        return [];
      }
    } catch (e) {
      console.log(e.messa);
    }
  }


  async saveItem(text) {
    try {
      const item = await this.bd.query(`INSERT INTO todo_items (text)  VALUES ('${text}') RETURNING id;`);

      return await item.rows[0].id;
    } catch (e) {
      console.log(e.message);
    }
  }

  async updateItemStatus(id) {
    try {
      await this.bd.query(`UPDATE todo_items SET is_completed = NOT is_completed  WHERE id = ${id};`);
      
      return await this.getItems();
    } catch (e) {
      console.log(e.message);
    }
  }

  async deleteItems() {
    try {
      await this.bd.query(`DELETE FROM todo_items WHERE is_completed = true;`);

      return await this.getItems();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new TodoService()
