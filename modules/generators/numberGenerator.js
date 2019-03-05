let helpers = require('../helpers');

module.exports = new function() {
    this.generate = function(meta) {
        let start = parseFloat(helpers.getMeta(meta, 'start'));
        let end = parseFloat(helpers.getMeta(meta, 'end'));
        let decimals = helpers.getMeta(meta, 'decimals');
        if (isNaN(start) || isNaN(end)) return "Invalid input";
        try {
            return parseFloat((Math.random() * (end - start)) + start).toFixed(decimals);
        } catch {
            return "Incorrect decimal format";
        }
    }
};
