import { Request, Response, } from 'express';
import { validationResult } from 'express-validator';
import { BaseError } from '../exceptions/BaseError';
import { TodoService } from '../services/todo.service';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { HttpBaseError } from '../exceptions/HttpBaseError';

export class TodoController {
  
  static async getItems (req: Request, res: Response): Promise<void> {
    try {
      res.json(await TodoService.getItems(req.body.currentUser.id));
    } catch (e) {
      HttpBaseError({response: res, err: e,})
    }
  }

  static async createNewItem (req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new BaseError({httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY, name: 'Data validation', description: String(errors.array())});
      } else {
        res.json(await TodoService.createItem(req.body.text, req.body.currentUser.id));
      }
    } catch (e) {
      HttpBaseError({response: res, err: e,});
    }
  }

  static async changeItemStatus (req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new BaseError({httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY, name: 'Data validation', description: String(errors.array())});
      } else {
        const itemsRecords = await TodoService.updateItemStatus(req.body.id, req.body.currentUser.id);
        
        res.json(itemsRecords);
      }
    } catch (e) {
      HttpBaseError({response: res, err: e,})
    }
  }

  static async deleteCompletedItems (req: Request, res: Response): Promise<void> {
    try {
      res.json(await TodoService.deleteItems(req.body.currentUser.id));
    } catch (e) {
      HttpBaseError({response: res, err: e,})
    }
  }
}
