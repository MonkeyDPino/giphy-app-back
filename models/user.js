const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type:String,
        required:true,
    },
    rol:{
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    },
    favs: [
        {
            id:{
                type:String,
                required:true
            }
        }
    ]
});

module.exports = mongoose.model('user', userSchema);