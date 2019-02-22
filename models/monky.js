let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Meta = new Schema({
    name: String,
    value: String
});

let Field = new Schema({
    name: String,
    type: String,
    meta: [Meta]
});

let Profile = new Schema({
    name: String,
    content: [Field]
});

let Monky = new Schema({
    profiles: [Profile]
});

module.exports = {
    profile: mongoose.model("Profile", Profile),
    key: mongoose.model('Monky', Monky),
    field: mongoose.model("Field", Field),
    meta: mongoose.model("Meta", Meta)
};
