var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false });
// mongoose.model('User', todoSchema);

module.exports = mongoose.model('todo', todoSchema);