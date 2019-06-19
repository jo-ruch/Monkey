let helpers = require('./../helpers');
let name = require('random-name');

module.exports = new function () {
    this.generate = function (meta) {
        return name.first() + "." + name.last() + "@gmail.com";
    }
};
