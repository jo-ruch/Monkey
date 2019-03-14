let randName = require('random-name');

module.exports = new function () {
    this.name = {};
    this.city = {};

    this.name.generate = function () {
        let res = randName.first();

        if (Math.random() < 0.4) {
            res += " " + randName.middle();
        }

        if (Math.random() < 0.2) {
            res += " " + randName.middle();
        }

        if (Math.random() < 0.1) {
            res += " " + randName.middle();
        }

        if (Math.random() < 0.2) {
            res += " " + randName.last();
        }

        res += " " + randName.last();

        return res;
    };

    this.city.generate = function () {
        return randName.place();
    };
};
