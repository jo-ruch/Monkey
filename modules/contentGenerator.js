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
        // console.log(meta);
        switch (type) {
            case 'string':
                let minWords = parseInt(getMeta(meta, "min"));
                let maxWords = parseInt(getMeta(meta, "max"));
                return addCaptical(lorem({
                    count: Math.random() * (maxWords - minWords) + minWords,
                    units: 'words'
                }));
            case 'id':
                return counters.acc++;
            case 'image':
                let height = getMeta(meta, "height");
                let width = getMeta(meta, "width");
                return 'https://picsum.photos/' + height + '/' + width + '?random&seed=' + counters.acc;
            case 'number':
                let start = parseFloat(getMeta(meta, 'start'));
                let end = parseFloat(getMeta(meta, 'end'));
                let decimals = getMeta(meta, 'decimals');
                if (isNaN(start) || isNaN(end)) return "Invalid input";
                return parseFloat((Math.random() * (end - start)) + start).toFixed(decimals);
            case 'name':
                return randName.first() + " " + randName.last();
            case 'city':
                return randName.place();
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
