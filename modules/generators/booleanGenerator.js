module.exports = new function () {
    this.generate = function (meta) {
        let rate = parseFloat(helpers.getMeta(meta, 'rate'));
        return Math.random() < rate;
    }
};
