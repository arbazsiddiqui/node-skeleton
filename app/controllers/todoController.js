var Todo = require('../models/todo');
var isLoggedIn = require('../middlewares/isLoggedIn');

module.exports = function (app) {

    app.get('/todos', isLoggedIn, function (req, res) {
        Todo.find({status: false, email: req.user.local.email}, function (err, tododoc) {
            if (err) {
                return res.send(err)
            }

            //res.json(tododoc) //uncomment if developing only APIs
            res.render('todos', {'docs': tododoc, 'user': req.user})
        })
    });

    app.post('/addtodo', isLoggedIn, function (req, res) {
        Todo.create({
            text: req.body.text,
            status: false,
            email: req.user.local.email
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