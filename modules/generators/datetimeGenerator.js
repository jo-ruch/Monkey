let helpers = require('./../helpers');

module.exports = new function () {
    this.date = {};
    this.time = {};

    this.date.generate = function (meta) {
        return new Date().toLocaleDateString();
    };

    this.time.generate = function(meta) {
        return new Date().toLocaleTimeString();
    };
};
