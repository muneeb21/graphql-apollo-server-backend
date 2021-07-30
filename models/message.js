const mongoose = require('mongoose');



const messageSchema = new mongoose.Schema({
    
    message: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
		ref: "User",
    },
    groupId:{
        type: mongoose.Schema.Types.ObjectId,
		ref: "Group",
    },
    
    
    
}, {
    timestamps: true
});



const Message = mongoose.model('Message', messageSchema);

module.exports = Message;