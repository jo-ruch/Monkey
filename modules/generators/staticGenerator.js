let helpers = require('./../helpers');

module.exports = new function () {
    this.generate = function (meta) {
        let content = helpers.getMeta(meta, 'content');
        if (Number.isFinite(content)) {
            return parseFloat(content);
        }
        if (Number.isInteger(content)) {
            return parseInt(content);
        }
        if (content === "null") {
            return null;
        }
        return content;
    }
};
