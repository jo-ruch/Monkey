var express = require('express');
var router = express.Router();
let crypto = require('crypto');
let Monky = require('./../models/monky');
let helpers = require('./../modules/helpers');

router.get('/', function (req, res, next) {
    res.send("No key provided");
});

router.get('/generate', function (req, res, next) {
    crypto.randomBytes(32, function (err, buffer) {
        key = buffer.toString('hex');
    });

    let entry = new Monky.key();

    entry.save(function (err, monky) {
        if (err) return;
        res.send(monky);
    });
});

router.post('/:uuid/:profile/', function (req, res, next) {
    Monky.key.findById(helpers.getUUID(req), '').exec(function (err, monkey) {
        if (err) return helpers.handleError(res, err);

        let modelName = req.params.profile;
        let content = req.body;

        // Find the target model
        let target = monkey.profiles.find(function (elem) {
            return elem.name === modelName;
        });

        target.content = []; // Delete old content

        // Only copy over valid fields and meta fields
        content.forEach(function (field) {

            let newField = new Monky.field();
            newField.name = field.name;
            newField.type = field.type;

            field.meta.forEach(function (metaField) {
                let newMetaField = new Monky.meta();
                newMetaField.name = metaField.name;
                newMetaField.value = metaField.value;
                newField.meta.push(newMetaField);
            });

            target.content.push(newField);

        });

        monkey.save();

        res.send("Model updated");

    });
});

router.get('/:uuid', function (req, res, next) {
    let id = req.params.uuid;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Monky.key.findById(id, '').exec(function (err, monky) {
            if (err) {
                console.log(err);
                return;
            }
            if (monky !== null) {
                res.send(monky);
            } else {
                res.status(404);
                res.send("Key does not exist");
            }
        });
    } else {
        res.status(500);
        res.send("Not a valid uuid");
    }
});

module.exports = router;
