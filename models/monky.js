var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let Profile = new Schema({
    name : String,
    content: []
});

let Monky = new Schema({
   profiles : [Profile]
});

module.exports = mongoose.model('Monky', Monky);