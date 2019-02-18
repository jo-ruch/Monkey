var express = require('express');
var router = express.Router();
let Monky = require('../models/monky');
let generator = require("./../modules/contentGenerator");

function getUUID(req) {
    return req.params.uuid;
}

function handleError(res, err) {
    res.status(500);
    res.send(err);
}

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.use(function (req, res, next) {
    if (req.query.delay) {
        setTimeout(next, req.query.delay);
    } else {
        next();
    }
});

router.use(function (req, res, next) {
    let id = req.originalUrl.split('/')[2];
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        next();
    } else {
        res.status(500);
        res.send("Not a valid key");
    }
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('Welcome to the mock api');
});

router.post('/:uuid/models', function (req, res, next) {
    if (req.body.name) {
        Monky.key.findById(getUUID(req), '').exec(function (err, monky) {
            if (err) return handleError(res, err);

            let model = new Monky.profile(); // Create new profile
            model.name = req.body.name; // Assign name to profile
            monky.profiles.push(model); // Add new profile to monkey
            monky.save(); // Save updated monkey
        });
        res.send("Model created");
    } else {
        res.status(500);
        res.send("No valid model name provided");
    }
});

router.get('/:uuid/:profile/:id', function (req, res, next) {
    Monky.key.findById(getUUID(req), '').exec(function (err, monky) {
        if (err) {
            console.log(err);
            return;
        }

        if (monky !== null) {
            monky.profiles.forEach(function (profile) {
                console.log(profile, req.params, profile.name === req.params.profile);
                if (profile.name === req.params.profile) {
                    let response = [];
                    let counters = {
                        acc: req.params.id,
                        seed: 1234
                    };


                    response.push(generator.generate(profile, counters));


                    res.send(response[0]);
                }
            });
        } else {
            res.send("Key does not exist");
        }
    });
});

router.get('/:uuid/:profile', function (req, res, next) {
    Monky.key.findById(getUUID(req), '').exec(function (err, monky) {
        if (err) {
            console.log(err);
            return;
        }

        if (monky !== null) {
            monky.profiles.forEach(function (profile) {
                console.log(profile, req.params, profile.name === req.params.profile);
                if (profile.name === req.params.profile) {
                    let response = [];
                    let counters = {
                        acc: 0,
                        seed: 1234
                    };

                    for (let i = 0; i < 100; i++) {
                        response.push(generator.generate(profile, counters));
                    }

                    res.send(response);
                }
            });
        } else {
            res.send("Key does not exist");
        }
    });
});

router.post('/:uuid/:profile/', function (req, res, next) {
    Monky.key.findById(getUUID(req), '').exec(function (err, monkey) {
        if (err) return handleError(res, err);

        let modelName = req.params.profile;
        let content = req.body;

        // Find the target model
        let target = monkey.profiles.find(function (elem) {
            return elem.name === modelName;
        });

        // Copy over new model content
        target.content = content;

        monkey.save();

        res.send("Model updated");


    });
});

router.get('/:uuid', function (req, res, next) {

    Monky.key.findById(getUUID(req), 'profiles.name').exec(function (err, monky) {
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

});


module.exports = router;
