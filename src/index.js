const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3333;

mongoose.connect('mongodb+srv://nathanbarsoti:notebook100@cluster0-cfn0q.mongodb.net/nodeEvaluation?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(routes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.listen(port, function() {
    console.log(`API LISTENING ON PORT ${port}`);
});

