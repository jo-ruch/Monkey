let helpers = require('./../helpers');

module.exports = new function () {
    this.generate = function (meta, counters) {
        let height = helpers.getMeta(meta, "height");
        let width = helpers.getMeta(meta, "width");
        return 'https://picsum.photos/' + height + '/' + width + '?random&seed=' + counters.acc;
    }
};
