var express = require('express');
var router = express.Router();
let crypto = require('crypto');
let Monky = require('./../models/monky');
let helpers = require('./../modules/helpers');

router.get('/', function (req, res, next) {
    res.send("No key provided");
});

// Create new model
router.post('/:uuid/models', function (req, res, next) {
    if (req.body.name) {
        Monky.key.findById(helpers.getUUID(req), '').exec(function (err, monky) {
            if (err) return helpers.handleError(res, err);

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

router.post('/:uuid/:profile/', function (req, res, next) {
    Monky.key.findById(helpers.getUUID(req), '').exec(function (err, monkey) {
        if (err) return helpers.handleError(res, err);

        let modelName = req.params.profile;
        let content = req.body;

        if (!modelName || !content || !Array.isArray(content)) {
            return helpers.handleError(res, "Invalid post");
        }

        // Find the target model
        let target = monkey.profiles.find(function (elem) {
            return elem.name === modelName;
        });

        if (!target || !target.content) {
            return helpers.handleError(res, "Corrupt key");
        }

        target.content = []; // Delete old content

        // Only copy over valid fields and meta fields
        for (let field of content) {

            // Check if all fields exist
            if (!field.name || !field.type || !field.meta) {
                let msg = "";
                if (!field.name) msg = "Name missing";
                if (!field.type) msg = "Type missing";
                if (!field.meta) msg = "Meta missing";

                return helpers.handleError(res, "Corrupt key" + msg);
            }

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

        }

        monkey.save();

        res.send("Model updated");

    })
    ;
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
