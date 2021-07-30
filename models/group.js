const mongoose = require('mongoose');



const groupSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    users: [
        {type: String,
        }
    ],
    
    
}, {
    timestamps: true
});



const Group = mongoose.model('Group', groupSchema);

module.exports = Group;