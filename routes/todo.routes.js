const express = require('express'),
  router = express.Router(),
  TodoController = require('../controllers/todo.controller');

  /**
   * @route GET /todo/
   * @group todo
   * @returns {Array} 200 - Array of objects
   */
  router.get('/', TodoController.getItems);

  /**
   * @route POST /todo/
   * @group todo
   * @param {string} text.required - task text 
   * @returns {integer} 200 - id created item
   * @returns 422 - wrong value
   */
  router.post('/', TodoController.createNewItem);

  /**
   * @route PATCH /todo/
   * @group todo
   * @param {integer} id.required - id item
   * @returns {Array} 200 - Array of objects
   * @returns 422 - wrong value
   */
  router.patch('/', TodoController.changeItemStatus);

  /**
   * deleted all completed tasks
   * @route DELETE /todo/
   * @group todo
   * @returns 200 
   * @returns {Array} 200 - Array of objects
   */
  router.delete('/', TodoController.deleteCompletedItems);

module.exports = router;