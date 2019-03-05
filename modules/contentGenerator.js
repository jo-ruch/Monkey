let helpers = require('./helpers');
let randName = require('random-name');

// GENERATORS
let numberGenerator = require('./generators/numberGenerator');
let stringGenerator = require('./generators/stringGenerator');
let imageGenerator = require('./generators/imageGenerator');

function ContentGenerator() {

    function dispatch(type, meta, counters) {
        switch (type) {
            case 'boolean':
                let rate = parseFloat(helpers.getMeta(meta, 'rate'));
                return Math.random() < rate;
            case 'static':
                return helpers.getMeta(meta, 'content');
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
                return {};
            case 'array':
                let type = helpers.getMeta(meta, 'type');
                let length = helpers.getMeta(meta, 'length');
                let res = [];
                let localCounters = {
                    acc: 0,
                    seed: 1234
                };
                for (let i = 0; i < length; i++) {
                    res.push(dispatch(type, meta, localCounters));
                    localCounters.acc++;
                }
                return res;
            default:
                return "Unknown type";
        }
    }

    this.generate = function (profile, counters) {

        let mockObject = {};

        profile.content.forEach(function (field) {
            mockObject[field.name] = dispatch(field.type, field.meta, counters);
        });

        return mockObject;

    }
}

module.exports = new ContentGenerator();
