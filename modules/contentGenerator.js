let lorem = require('fast-lorem-ipsum');

function ContentGenerator() {

    function dispatch(type, counters) {
        switch (type) {
            case 'string':
                return lorem(10, 101);
            case 'id':
                return counters.acc++;
            case 'image':
                return 'https://picsum.photos/200/300?random';
        }
    }

    this.generate = function (profile) {

        let mockObject = {};
        let counters = {
            acc: 0,
            seed: 1234
        };

        profile.content.forEach(function (field) {
            mockObject[field.name] = dispatch(field.type, counters);
        });

        return mockObject;

    }
}

module.exports = new ContentGenerator();