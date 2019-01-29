let lorem = require('fast-lorem-ipsum');

function ContentGenerator() {

    function dispatch(type) {
        switch(type) {
            case 'string':
                return lorem(10, 101);
            case 'id':
                return 1;
            case 'image':
                return 'https://picsum.photos/200/300?random';
        }
    }

    this.generate = function (profile) {

        let mockObject = {};

        profile.content.forEach(function (field) {
            mockObject[field.name] = dispatch(field.type);
        });

        return mockObject;

    }
}

module.exports = new ContentGenerator();