const TodoService = require('../services/todo.service')

class TodoController {
  async getItems (request, response) {
    try {
      const items = await TodoService.getItems()

      response.json(items);
    } catch (e) {
      console.log(e.message);
    }
  }
  
  async createNewItem (request, response) {
    try {
      if (request.body.text === undefined) {
        response.status(422).send('invalid arguments');
      }
      const text = request.body.text.trim();
      console.log(text);
      if (text === '') {
        response.status(422).send('empty value')
      };

      response.json(await TodoService.saveItem(text));
    } catch (e) {
      response.status(500);
    }
  }
  
  async changeItemStatus (request, response) {
    try {
      const id = request.body.id;
      
      response.json(await TodoService.updateItemStatus(id));
    } catch (e) {
      console.log(e.message);
    }
  }
  
  async deleteCompletedItems (request, response) {
    try {
  
      response.json(await TodoService.deleteItems());
    } catch (e) {
      console.log(e.message);
    }
  }
}

module.exports = new TodoController()