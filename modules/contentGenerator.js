let helpers = require('./helpers');
let randName = require('random-name');

let Monky = require('../models/monky');

// GENERATORS
let numberGenerator = require('./generators/numberGenerator');
let stringGenerator = require('./generators/stringGenerator');
let imageGenerator = require('./generators/imageGenerator');
let booleanGenerator = require('./generators/booleanGenerator');

function ContentGenerator() {

    async function dispatch(type, meta, counters, UUID) {
        switch (type) {
            case 'boolean':
                return booleanGenerator.generate(meta);
            case 'static':
                return helpers.getMeta(meta, 'content'); // A little tricky dicky... TODO: Make safer
            case 'string':
                return stringGenerator.generate(meta);
            case 'id':
                return counters.acc;
            case 'image':
                return imageGenerator.generate(meta, counters);
            case 'number':
                return numberGenerator.generate(meta);
            case 'name':
                return randName.first() + " " + randName.last();
            case 'city':
                return randName.place();
            case 'object':

                let model = helpers.getMeta(meta, 'name');

                return new Promise(function (resolve, reject) {
                    Monky.key.findById(UUID, '').exec(function (err, monky) {

                        if (err) return "Error";

                        if (monky !== null) {
                            for (let i = 0; i < monky.profiles.length; i++) {

                                if (monky.profiles[i].name === model) {

                                    let counters = {
                                        acc: 0,
                                        seed: 1234
                                    };

                                    return module.exports.generate(monky.profiles[i], counters, UUID).then(function (object) {
                                        resolve(object);
                                    });
                                }
                            }
                            resolve("Invalid object");
                        }
                    });
                });
            case 'array':
                let type = helpers.getMeta(meta, 'type');
                let length = helpers.getMeta(meta, 'length');
                let res = [];
                let chain = [];
                let localCounters = {
                    acc: 0,
                    seed: 1234
                };
                for (let i = 0; i < length; i++) {
                    chain.push(dispatch(type, meta, localCounters, UUID).then(function (_res) {
                        res.push(_res);
                    }));
                    localCounters.acc++;
                }

                return Promise.all(chain).then(function () {
                    return res;
                });

            default:
                return "Unknown type";
        }
    }

    this.generate = function (profile, counters, UUID) {

        let chain = [];
        let mockObject = {};

        profile.content.forEach(function (field) {
            chain.push(dispatch(field.type, field.meta, counters, UUID).then(function (res) {
                mockObject[field.name] = res;
            }));
        });

        // Return promise with mock
        return Promise.all(chain).then(function () {
            return mockObject;
        });
    }
}

module.exports = new ContentGenerator();
