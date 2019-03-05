let helpers = require('./../helpers');
let lorem = require('lorem-ipsum');

module.exports = new function() {

    function addCaptical(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    this.generate = function(meta) {
        let minWords = parseInt(helpers.getMeta(meta, "min"));
        let maxWords = parseInt(helpers.getMeta(meta, "max"));
        return addCaptical(lorem({
            count: Math.random() * (maxWords - minWords) + minWords,
            units: 'words'
        }));
    }
};
