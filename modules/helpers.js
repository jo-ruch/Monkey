module.exports = new function () {
    this.getMeta = function (meta, name) {
        let size = meta.length;
        for (let i = 0; i < size; i++) {
            if (name === meta[i].name) {
                return meta[i].value;
            }
        }
        return undefined;
    };

    this.getUUID = function (req) {
        return req.params.uuid;
    };

    this.handleError = function (res, err) {
        res.status(500);
        res.send(err);
    };
};
