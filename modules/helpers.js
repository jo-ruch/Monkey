module.exports = new function() {
    this.getMeta = function(meta, name) {
        let size = meta.length;
        for (let i = 0; i < size; i++) {
            if (name === meta[i].name) {
                return meta[i].value;
            }
        }
        return undefined;
    }
};
