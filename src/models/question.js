const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    },
    question: { type: String, 
        required: true 
    },
    answer: { type: String },
}, { timestamps: true });

questionSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.que_id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Question', questionSchema);