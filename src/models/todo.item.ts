import { db } from "./db";
import { ItemRecordPayload } from "../types/index";
import { BaseError } from "../exceptions/BaseError";
import { HttpStatusCode } from "../enums/HttpStatusCode";


export class Item {
  private id: number;
  private text: string;
  private isCompleted: boolean = false;
  private userId: number;

  public static tableName = 'todo_items';

  public static async findOneById(id: number): Promise<Item> {
    const item: ItemRecordPayload = (await db.selectWhere(Item.tableName, 'id', id)).rows[0];

    if (item) {
      let result = new Item();

      result.id = item.id;
      result.text = item.text;
      result.isCompleted = item.is_completed;
      result.userId = item.user_id;

      return result;
    }
    else {
      throw new BaseError({httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY, name: 'Todo item not found', description: ''});
    }
  }

  public static async getAllByUserId(userId: number): Promise<Item[]> {
    const elements: ItemRecordPayload[] = (await db.selectWhere(Item.tableName, 'user_id', userId)).rows;

    return elements.map((el): Item => {
      let item = new Item();

      item.id = el.id;
      item.text = el.text;
      item.isCompleted = el.is_completed

      return item;
    });
  }

  public static async create(text: string, userId: number): Promise<Item> {
    try {
      const idRecord: number = (await db.getClient().query(`INSERT INTO todo_items (text, user_id)  VALUES ('${text}', '${userId}') RETURNING id;`)).rows[0].id;

      let item = new Item();

      item.id = idRecord;
      item.text = text;
      item.isCompleted = false;
      item.userId = userId;
      
      return item;
    } catch (e) {
      console.log(e.message);
    }
  }

  public async changeStatus(): Promise<void> {
    try {
      await db.getClient().query(`UPDATE todo_items SET is_completed = NOT is_completed  WHERE id = ${this.id};`);

      this.isCompleted = !this.isCompleted;
    } catch (e) {
      console.log(e.message);
    }
  }

  public static async deleteCompleted (userId: number): Promise<void> {
    try {
      await db.getClient().query(`DELETE FROM todo_items WHERE is_completed = true AND user_id = ${userId};`);
    } catch (e) {
      console.log(e);
    }
  }

  public getId(): number {
    return this.id;
  }

  public getText(): string {
    return this.text;
  }

  public getIsCimpleted(): boolean {
    return this.isCompleted;
  }

  public getUserId(): number {
    return this.userId;
  }
}
