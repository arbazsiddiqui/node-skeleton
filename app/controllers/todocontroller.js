var Todo = require('../models/todo');

module.exports = function (app) {

    app.get('/todos', function (req, res) {
        Todo.find({status: false},function (err, tododoc) {
            if (err) {
                return res.send(err)
            }
            //res.json(tododoc) //uncomment if developing only APIs
            res.render('index', {'docs': tododoc})
        })
    });

    app.post('/addtodo', function (req, res) {
        Todo.create({
            text: req.body.text,
            status: false
        }, function (err, tododoc) {
            if (err) {
                return res.send(err)
            }
            //res.json(tododoc) //uncomment if developing only APIs
            res.redirect('/todos')
        })
    });

    app.post('/completetodo', function (req, res) {
        Todo.findByIdAndUpdate(
            req.body.id,
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