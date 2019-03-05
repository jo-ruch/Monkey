let lorem = require('lorem-ipsum');
let randName = require('random-name');

function ContentGenerator() {

    function addCaptical(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function getMeta(meta, name) {
        let size = meta.length;
        for (let i = 0; i < size; i++) {
            if (name === meta[i].name) {
                return meta[i].value;
            }
        }
        return undefined;
    }

    function dispatch(type, meta, counters) {
        switch (type) {
            case 'boolean':
                let rate = parseFloat(getMeta(meta, 'rate'));
                return Math.random() < rate;
            case 'static':
                return getMeta(meta, 'content');
            case 'string':
                let minWords = parseInt(getMeta(meta, "min"));
                let maxWords = parseInt(getMeta(meta, "max"));
                return addCaptical(lorem({
                    count: Math.random() * (maxWords - minWords) + minWords,
                    units: 'words'
                }));
            case 'id':
                return counters.acc;
            case 'image':
                let height = getMeta(meta, "height");
                let width = getMeta(meta, "width");
                return 'https://picsum.photos/' + height + '/' + width + '?random&seed=' + counters.acc;
            case 'number':
                let start = parseFloat(getMeta(meta, 'start'));
                let end = parseFloat(getMeta(meta, 'end'));
                let decimals = getMeta(meta, 'decimals');
                if (isNaN(start) || isNaN(end)) return "Invalid input";
                try {
                    return parseFloat((Math.random() * (end - start)) + start).toFixed(decimals);
                } catch {
                    return "Incorrect decimal format";
                }
            case 'name':
                return randName.first() + " " + randName.last();
            case 'city':
                return randName.place();
            case 'object':
                let model = getMeta(meta, 'name');
                return {};
            case 'array':
                let type = getMeta(meta, 'type');
                let length = getMeta(meta, 'length');
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
