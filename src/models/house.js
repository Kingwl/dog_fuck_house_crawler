let mongoose = require('mongoose');

let HouseSchema = new mongoose.Schema({
    sale: { type: String },
    url: { type: String },
    place: { type: String },
    type: { type: String },
    size: { type: String },
    floor: { type: String },
    short_rent: { type: Boolean },
    dist: { type: String },
    specs: [{ type: String }],
    money: { type: String },
    month: { type: String }
});

const House = mongoose.model('House', HouseSchema);
module.exports = House;