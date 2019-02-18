var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let Profile = new Schema({
    name: String,
    content: []
});

let Monky = new Schema({
    profiles: [Profile]
});

module.exports = {
    profile: mongoose.model("Profile", Profile),
    key: mongoose.model('Monky', Monky)
};