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

function allowCors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}

function delay(req, res, next) {
    if (req.query.delay) {
        setTimeout(next, req.query.delay);
    } else {
        next();
    }
}

function amount(req, res, next) {
    if (req.query && !req.query.amount) {
        req.query.amount = 50;
    }
    next();
}

function isValidKey(key) {
    return (key.match(/^[0-9a-fA-F]{24}$/));
}

function isValidRequest(req, res, next) {
    let key = req.originalUrl.split('/')[2];
    if (isValidKey(key)) {
        next();
    } else {
        res.status(500);
        res.send("Not a valid key");
    }
}

function randomize(req, res, next) {
    next();
}

router.use(allowCors);
router.use(isValidRequest);
router.use(delay);
router.use(amount);
router.use(randomize);

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('Welcome to the mock api');
});

router.get('/:uuid/:profile/:id', function (req, res, next) {
    Monky.key.findById(getUUID(req), '').exec(function (err, monky) {
        if (err) return handleError(res, err);

        if (monky !== null) {
            monky.profiles.forEach(function (profile) {
                if (profile.name === req.params.profile) {

                    let counters = {
                        acc: req.params.id,
                        seed: 1234
                    };

                    generator.generate(profile, counters, getUUID(req)).then(function (object) {
                        res.send(object);
                    });

                }
            });
        } else {
            res.send("Key does not exist");
        }
    });
});

router.get('/:uuid/:profile', function (req, res, next) {
    Monky.key.findById(getUUID(req), '').exec(function (err, monky) {
        if (err) return handleError(res, err);

        if (monky !== null) {
            for (let i = 0; i < monky.profiles.length; i++) {

                if (monky.profiles[i].name === req.params.profile) {
                    console.log('building profile', monky.profiles[i].name);
                    let response = [];
                    let chain = [];

                    let counters = {
                        acc: 0,
                        seed: 1234
                    };

                    for (let j = 0; j < req.query.amount; j++) {
                        chain.push(generator.generate(monky.profiles[i], counters, getUUID(req)).then(function (_res) {
                            response.push(_res);
                        }));
                        counters.acc++;
                    }

                    Promise.all(chain).then(function () {
                        res.send(response);
                    });
                }
            }
        } else {
            res.send("Key does not exist");
        }
    });
});

// post
router.post('/:uuid/:profile', function (req, res, next) {
    res.send(req.body);
});

router.get('/:uuid', function (req, res, next) {

    Monky.key.findById(getUUID(req), 'profiles.name').exec(function (err, monky) {
        if (err) {
            console.error(err);
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
