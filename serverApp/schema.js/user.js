var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    status: { type: Number, default: 1 },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('user', userSchema);