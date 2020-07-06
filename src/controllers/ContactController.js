const Contact = require('../models/Contact');
const axios = require('axios');

module.exports = {

    get (req, res) {
        Contact.find({
            status: {
                $eq: true
            }
        })
        .then(contacts => {
            if (contacts == null || contacts.length == 0)
                return res.status(204).send({ msg: 'Your list is empty.'} ); 

            return res.json({ contacts: contacts });
        })
        .catch(() => {
            return res.json({ msg: 'A problem occurred and we were unable to complete your request.' });
        });
    },

    getById (req, res) {
        Contact.findById(req.params.id)
        .then(async contact => {
            if (!contact)
                return res.status(404).send({ msg: 'No contact found.' });

            let uri = contact.city;
            let city = encodeURI(uri);

            const weather = await axios.get(`https://api.hgbrasil.com/weather?key=fcef61af&city_name=${city}&fields=only_results,temp,description,condition_code,city_name`);

            if (weather.data.temp <= 18)
                return res.json({contact: contact, msg: 'Que tal um chocolate quente?'});

            else if (weather.data.temp >= 30 && weather.data.condition_code === "32")
                return res.json({contact: contact, msg: 'Que tal irmos à praia?'});
            
            else if (weather.data.temp >= 30 && (weather.data.condition_code === "9" || weather.data.condition_code === "45"))
                return res.json({contact: contact, msg: 'Que tal irmos tomarmos um sorvete?'});

            else if (weather.data.temp > 18 && weather.data.temp < 30 && weather.data.condition_code === "32")
                return res.json({contact: contact, msg: 'Que tal fazermos alguma atividade ao ar livre?'});
            
            else if (weather.data.temp > 18 && weather.data.temp < 30 && (weather.data.condition_code === "9" || weather.data.condition_code === "45"))
                return res.json({contact: contact, msg: 'Que tal vermos um filme?'});

            else 
                return res.json({contact: contact});
        
        })
        .catch(() => {
            return res.json({ msg: 'A problem occurred and we were unable to complete your request.' });
        });
    },

    create (req, res) {
        const { name, address, city, phone, email } = req.body;

        if (!name)
            return res.status(400).send({ msg: `You can't save a contact without name.` }); 
    
        Contact.create({
            name,
            address,
            city,
            phone,
            email,
            status: true
        })
        .then(contact => {
            if (contact)
                return res.status(200).send({ msg: 'Your contact has been successfully saved.' });
            else
                return res.status(400).send({ msg: 'An error ocurrend trying to save new contact.' });
        })
        .catch(() => {
            return res.json({ msg: 'A problem occurred and we were unable to complete your request.' });
        });
    },

    updateById (req, res) {
        Contact.updateOne(
            { _id: req.params.id },
            {
                $set: req.body
            }
        )
        .then(contact => {
            if (contact)
                return res.status(200).send({ msg: 'Your contact has been successfully updated.' });
            else
                return res.status(400).send(`An error ocurrend trying to update a contact.`);
        })
        .catch(() => {
            return res.json({ msg: 'A problem occurred and we were unable to complete your request.' });
        });
    },

    delete (req, res) {
        Contact.updateOne(
            { _id: req.params.id },
            {
              $set: {
                status: false
              }
            }
        )
        .then(() => {
            return res.status(200).send({ msg: 'Your contact has been successfully deleted.' })
        })
        .catch(() => {
            return res.json({ msg: 'A problem occurred and we were unable to complete your request' });
        });
    }

}

 