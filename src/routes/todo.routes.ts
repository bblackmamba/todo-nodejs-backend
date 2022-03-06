import express from 'express';
export const todoRouter = express.Router();
import { check } from 'express-validator';
import { UserController } from '../controllers/user.controller';
import  { TodoController } from '../controllers/todo.controller';

const validationForCreate = [check('text').trim().escape().isLength({min: 2, max: 64})];
const validationForUpdate = [check('id').not().isEmpty()];

  /**
   * @route GET /todo/
   * @group todo
   * @returns {Array} 200 - Array of objects
   */
  todoRouter.get('/', UserController.attachCurrentUser, TodoController.getItems);

  /**
   * @route POST /todo/
   * @group todo
   * @param {string} text.required - task text 
   * @returns {integer} 200 - id created item
   * @returns 422 - wrong value
   */
  todoRouter.post('/', UserController.attachCurrentUser, validationForCreate, TodoController.createNewItem);

  /**
   * @route PATCH /todo/
   * @group todo
   * @param {integer} id.required - id item
   * @returns {Array} 200 - Array of objects
   * @returns 422 - wrong value
   */
  todoRouter.patch('/', UserController.attachCurrentUser, validationForUpdate, TodoController.changeItemStatus);

  /**
   * deleted all completed tasks
   * @route DELETE /todo/
   * @group todo
   * @returns 200 
   * @returns {Array} 200 - Array of objects
   */
  todoRouter.delete('/', UserController.attachCurrentUser, TodoController.deleteCompletedItems);
