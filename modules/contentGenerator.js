let lorem = require('fast-lorem-ipsum');

function ContentGenerator() {

    function dispatch(type, counters) {
        switch (type) {
            case 'string':
                return lorem(10, 101);
            case 'id':
                return counters.acc++;
            case 'image':
                return 'https://picsum.photos/900/400?random&seed='+counters.acc;
        }
    }

    this.generate = function (profile, counters) {

        let mockObject = {};

        profile.content.forEach(function (field) {
            mockObject[field.name] = dispatch(field.type, counters);
        });

        return mockObject;

    }
}

module.exports = new ContentGenerator();
