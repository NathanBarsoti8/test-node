const mongoose = require('mongoose');

const Contact = new mongoose.Schema({
    name: String,
    address: String,
    city: String,
    phone: [String],
    email: String,
    active: Boolean
});

module.exports = mongoose.model('Contact', Contact);