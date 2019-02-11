let lorem = require('fast-lorem-ipsum');

function ContentGenerator() {

    function dispatch(type, seed, acc) {
        switch(type) {
            case 'string':
                return lorem(10, 101);
            case 'id':
                return acc++;
            case 'image':
                return 'https://picsum.photos/200/300?random';
        }
    }

    this.generate = function (profile) {

        let mockObject = {};
        let acc = 0;
        let seed = 1234;

        profile.content.forEach(function (field) {
            mockObject[field.name] = dispatch(field.type, seed, acc);
        });

        return mockObject;

    }
}

module.exports = new ContentGenerator();