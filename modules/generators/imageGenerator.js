let helpers = require('./../helpers');

module.exports = new function () {
    this.generate = function (meta, counters) {
        let height = getMeta(meta, "height");
        let width = getMeta(meta, "width");
        return 'https://picsum.photos/' + height + '/' + width + '?random&seed=' + counters.acc;
    }
};
