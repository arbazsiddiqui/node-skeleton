var Todo = require('../models/todo');
var isLoggedIn = require('../middlewares/isLoggedIn');
var authenticated_using = require('../helpers/authenticated_using')

module.exports = function (app) {

    app.get('/todos', isLoggedIn, function (req, res) {
        auth_user = authenticated_using(req)
        Todo.find({status: false, email: auth_user.email}, function (err, tododoc) {
            if (err) {
                return res.send(err)
            }
            //res.json(tododoc) //uncomment if developing only APIs
            res.render('todos', {'docs': tododoc, 'user': auth_user})
        })
    });

    app.post('/addtodo', isLoggedIn, function (req, res) {
        auth_user = authenticated_using(req)
        Todo.create({
            text: req.body.text,
            status: false,
            email: auth_user.email
        }, function (err, tododoc) {
            if (err) {
                return res.send(err)
            }
            //res.json(tododoc) //uncomment if developing only APIs
            res.redirect('/todos')
        })
    });

    app.post('/completetodo/:id', isLoggedIn, function (req, res) {
        Todo.findByIdAndUpdate(
            req.params.id,
            {status: true}, function (err, tododoc) {
                if (err) {
                    return res.send(err)
                }
                //res.json(tododoc) //uncomment if developing only APIs
                res.redirect('/todos')
            }
        )
    });

};