let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommitSchema = new Schema({
    time: { type: Date, default: Date.now },
    data: [{ type: Schema.Types.ObjectId, default: [], ref: 'House' }]
});

const Commit = mongoose.model('Commit', CommitSchema);
module.exports = Commit;