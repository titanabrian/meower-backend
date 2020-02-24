const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const MessageSchema= new Schema({
    text:{
        type:String,
        required:true
    },

    user:{
        type:Schema.Types.Object,
        required:true
    },

    created_at:{
        type:Date,
        default:Date.now
    },
    
    replies:{
        type:[Schema.Types.ObjectId],
        default:[]
    },
    
    likes:{
        type:[Schema.Types.ObjectId],
        default:[]
    },
    
    dislikes:{
        type:[Schema.Types.ObjectId],
        default:[]
    },
    parent:{
        type:Schema.Types.ObjectId,
        default:null
    }
});

const Message = mongoose.model('Message',MessageSchema);
module.exports=Message;