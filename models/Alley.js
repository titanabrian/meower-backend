const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const AlleySchema= new Schema({
    name:{
        type:String,
        required:true
    },
    members:[{type:Schema.Types.ObjectId,ref:"User"}],
    administrators:[{type:Schema.Types.ObjectId,ref:"User"}]
});

const Alley = mongoose.model('Alley',AlleySchema);
module.exports=Alley;