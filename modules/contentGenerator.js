let helpers = require('./helpers');

// GENERATORS
let idGenerator = require('./generators/idGenerator');
let numberGenerator = require('./generators/numberGenerator');
let stringGenerator = require('./generators/stringGenerator');
let imageGenerator = require('./generators/imageGenerator');
let booleanGenerator = require('./generators/booleanGenerator');
let datetimeGenerator = require('./generators/datetimeGenerator');
let nameGenerator = require('./generators/nameGenerator');
let staticGenerator = require('./generators/staticGenerator');
let emailGenerator = require('./generators/emailGenerator');

function ContentGenerator() {

    async function dispatch(type, meta, counters, UUID, depthCounter, models) {
        switch (type) {

            // Basics
            case 'static':
                return staticGenerator.generate(meta);
            case 'boolean':
                return booleanGenerator.generate(meta);
            case 'number':
                return numberGenerator.generate(meta);
            case 'string':
                return stringGenerator.generate(meta);

            // Specials
            case 'id':
                return idGenerator.generate(counters);
            case 'image':
                return imageGenerator.generate(meta, counters);
            case 'name':
                return nameGenerator.name.generate();
            case 'city':
                return nameGenerator.city.generate();
            case 'date':
                return datetimeGenerator.date.generate();
            case 'time':
                return datetimeGenerator.time.generate();
            case 'email':
                return emailGenerator.generate(meta);
            case 'password':
                return null;

            // Objects and arrays
            case 'object':

                let model = helpers.getMeta(meta, 'name');

                if (!model) return "Corrupt field";

                return new Promise(function (resolve, reject) {
                    for (let i = 0; i < models.length; i++) {

                        if (models[i].name === model) {

                            let _counters = {
                                acc: 0,
                                seed: 1234
                            };

                            return module.exports.generate(models[i], _counters, UUID, depthCounter, models).then(function (object) {
                                resolve(object);
                            });
                        }
                    }
                    resolve("Unknown object");
                });
            case 'array':
                let type = helpers.getMeta(meta, 'type');
                let length = helpers.getMeta(meta, 'length');

                if (!length || !type) {
                    return "Corrupt field";
                }

                length = length > 1000 ? 1000 : length;

                let res = [];
                let chain = [];
                let localCounters = {
                    acc: 0,
                    seed: 1234
                };
                for (let i = 0; i < length; i++) {
                    chain.push(dispatch(type, meta, localCounters, UUID, depthCounter, models).then(function (_res) {
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

    this.generate = function (profile, counters, UUID, depthCounter, models) {

        depthCounter += 1; // Keep track of recursive stack depth to prevent circular includes

        // Limit stack depth to 10
        if (depthCounter > 5) {
            return Promise.resolve("Max depth reached");
        }

        let chain = [];
        let mockObject = {};

        profile.content.forEach(function (field) {
            chain.push(dispatch(field.type, field.meta, counters, UUID, depthCounter, models).then(function (res) {
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
