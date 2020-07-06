const { Router } = require('express');
const ContactController = require('./controllers/ContactController');

const routes = Router();

routes.get('/contacts', ContactController.get);
routes.get('/contacts/:id', ContactController.getById);
routes.post('/contacts', ContactController.create);
routes.put('/contacts/:id', ContactController.updateById);
routes.put('/contacts/:id', ContactController.delete);


module.exports = routes;
