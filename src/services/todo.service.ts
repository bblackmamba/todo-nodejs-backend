import { HttpStatusCode } from "../enums/HttpStatusCode";
import { BaseError } from "../exceptions/BaseError";
import { Item } from "../models/todo.item";

export class TodoService {

  static async getItems(userId: number): Promise<Item[]> {
    return await Item.getAllByUserId(userId);
  }

  static async createItem(text: string, userId: number): Promise<number> { 
    const item: Item = await Item.create(text, userId);

    return item.getId();

  }

  static async updateItemStatus(id: number, userId: number): Promise<Item[]> {
    const item: Item = await Item.findOneById(id);

    if (item.getUserId() === userId) {
      await item.changeStatus();

      return await this.getItems(item.getUserId());
    }
    else {
      throw new BaseError({httpCode: HttpStatusCode.FORBIDDEN, name: 'No access', description: ''});
    }
  }

  static async deleteItems(userId: number): Promise<Item[]> {
    await Item.deleteCompleted(userId);
    
    return await this.getItems(userId);
  }
}
