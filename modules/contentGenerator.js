let lorem = require('lorem-ipsum');

function ContentGenerator() {

    function addCaptical(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function getMeta(meta, name) {
        let size = meta.length;
        for(let i = 0; i < size; i++) {
            if(name === meta[i].name) {
                return meta[i].value;
            }
        }
        return undefined;
    }

    function dispatch(type, meta, counters) {
        console.log(meta);
        switch (type) {
            case 'string':
                let wordCount = getMeta(meta, "words");
                return addCaptical(lorem({
                    count: wordCount ? wordCount : 10, // Very tricky
                    units: 'words'
                }));
            case 'id':
                return counters.acc++;
            case 'image':
                return 'https://picsum.photos/900/400?random&seed=' + counters.acc;
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
