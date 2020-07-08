const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const index = require('../src/index');
const Contact = require('../src/models/Contact');

const mock = {
    "name": "Nathan Barsoti",
    "address": "Avenida das Orquideas",
    "city": "Itápolis,SP",
    "phone": ["16 333333", "16 32623678"],
    "email": "nathanbarsoti@hotmail.com"
}

const contacts = [{
        "phone": [
          "16 333333",
          "16 32623678"
        ],
        "_id": "5f0647f08261c61948eb3561",
        "name": "Ana Julia",
        "address": "Avenida das Orquideas",
        "city": "Campinas,SP",
        "email": "anajulia@hotmail.com",
        "active": true,
        "__v": 0
}];


let contactId;

describe('ContactController', function () {
    this.beforeAll(async () => {
        const result = await Contact.create(mock)
        contactId = result._id
    })

    describe('GET: ', () => {
        it('should list all contacts', (done) => {
            chai.request(index)
                .get('/contacts')
                .end((error, res) => {
                    expect(res.status).to.eql(200)
                    done()
                });
        });

        it('should list contacts with filter in name', (done) => {
            chai.request(index)
                .get('/contacts?name=ana')
                .end((error, res) => {
                    expect(res.body.contacts).to.eql(contacts)
                    done()
                });
        });

        it('should not list contacts with inexisting value in filter (name)', (done) => {
            chai.request(index)
                .get('/contacts?name=joao')
                .end((error, res) => {
                    expect(res.status).to.eql(204)
                    done()
                });
        });

        it('should list contacts with filter in email', (done) => {
            chai.request(index)
                .get('/contacts?email=anajulia@hotmail.com')
                .end((error, res) => {
                    expect(res.body.contacts).to.eql(contacts)
                    done()
                });
        });

        it('should not list contacts with inexisting value in filter (email)', (done) => {
            chai.request(index)
                .get('/contacts?name=joao@hotmail.com')
                .end((error, res) => {
                    expect(res.status).to.eql(204)
                    done()
                });
        });
    });

    describe('GET/ID: ', () => {
        it('should get a contact by id', (done) => {
            chai.request(index)
                .get(`/contacts/${contactId}`)
                .end((error, res) => {
                    delete res.body.contact._id
                    delete res.body.contact.__v
                    expect(res.status).to.eql(200);
                    expect(res.body).to.eql({
                        contact: mock
                    })
                    done();
                });
        });

        it('should fail get contact by id when id is undefined', (done) => {
            chai.request(index)
                .get(`/contacts/${undefined}`)
                .end((error, res) => {
                    expect(res.body).to.eql({
                        msg: 'A problem occurred and we were unable to complete your request.'
                    })
                    done();
                });
        });
    });

    describe('POST: ', () => {
        it('should add a contact', (done) => {
            chai.request(index)
                .post('/contacts')
                .send(mock)
                .end((error, res) => {
                    expect(res.status).to.eql(200)
                    expect(res.body).to.eql({
                        msg: 'Your contact has been successfully saved.'
                    })
                    done()
                });
        });

        it('should fail save a contact without name', (done) => {
            mock.name = null

            chai.request(index)
                .post('/contacts')
                .send(mock)
                .end((error, res) => {
                    expect(res.status).to.eql(400)
                    expect(res.body).to.eql({
                        msg: `You can't save a contact without name.`
                    })
                    done()
                });
        });
    });

    describe('/PUT/ID: ', () => {
        it('should update a contact by id', (done) => {

            const mockUpdate = {
                address: "Rua das Flores"
            }

            chai.request(index)
                .put(`/contacts/${contactId}`)
                .send(mockUpdate)
                .end((error, res) => {
                    expect(res.status).to.eql(200)
                    expect(res.body).to.eql({
                        msg: 'Your contact has been successfully updated.'
                    })
                    done()
                });
        });

        it('should fail update a contact when id is undefined', (done) => {

            const mockUpdate = {
                address: "Rua das Flores"
            }

            chai.request(index)
                .put(`/contacts/${undefined}`)
                .send(mockUpdate)
                .end((error, res) => {
                    expect(res.status).to.eql(400)
                    expect(res.body).to.eql({
                        msg: 'A problem occurred and we were unable to complete your request.'
                    })
                    done()
                });
        });
    });

    describe('/DELETE/ID: ', () => {
        it('should delete a contact by id', (done) => {
            chai.request(index)
                .put(`/contacts/${contactId}/delete`)
                .end((error, res) => {
                    expect(res.status).to.eql(200)
                    expect(res.body).to.eql({
                        msg: 'Your contact has been successfully deleted.'
                    })
                    done()
                });
        });

        it('should fail delete a contact when id is undefined', (done) => {
            chai.request(index)
                .put(`/contacts/${undefined}/delete`)
                .end((error, res) => {
                    expect(res.status).to.eql(400)
                    expect(res.body).to.eql({
                        msg: 'A problem occurred and we were unable to complete your request.'
                    })
                    done()
                });
        });
    });


})