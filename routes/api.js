var express = require('express');
var router = express.Router();
let Monky = require('../models/monky');
let generator = require("./../modules/contentGenerator");

router.use(function(req, res, next) {
    if(req.query.delay) {
        setTimeout(next, req.query.delay);
    } else {
        next();
    }
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('Welcome to the mock api');
});

router.get('/generate', function (req, res, next) {
    let entry = new Monky();
    entry.profiles.push(
        {
            name: "ltb",
            content: [
                {
                    name: "id",
                    type: "id"
                },
                {
                    name: "projectId",
                    type: "id"
                }
            ]
        });

    entry.profiles.push(
        {
            name: "ttb",
            content: [
                {
                    name: "id",
                    type: "id"
                },
                {
                    name: "ltb",
                    type: "id"
                }
            ]
        });

    entry.save(function (err, monky) {
        if(err) return;
        res.send(monky);
    });

});

router.get('/:uuid/:profile', function (req, res, next) {
    let id = req.params.uuid;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Monky.findById(id, '').exec(function (err, monky) {
            if (err) {
                console.log(err);
                return;
            }

            if (monky !== null) {
                monky.profiles.forEach(function (profile) {
                    console.log(profile, req.params, profile.name === req.params.profile);
                    if (profile.name === req.params.profile) {

                        res.send(generator.generate(profile));
                    }
                });
            } else {
                res.send("Key does not exist");
            }
        });
    } else {
        res.send("Not a valid uuid");
    }

});

router.get('/:uuid', function (req, res, next) {
    let id = req.params.uuid;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Monky.findById(id, 'profiles.name').exec(function (err, monky) {
            if (err) {
                console.log(err);
                return;
            }
            if (monky !== null) {
                res.send(monky.profiles);
            } else {
                res.send("Key does not exist");
            }
        });
    } else {
        res.send("Not a valid uuid");
    }

});


module.exports = router;
