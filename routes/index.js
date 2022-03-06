const express = require('express'),
  router = express.Router(),
  todoRoutes = require('./todo.routes')

router.use('/todo', todoRoutes)

module.exports = router