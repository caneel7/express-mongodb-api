import { Types, Schema, model } from "mongoose";

const UserSchema = new Schema({
    first_name:{
        type:String,
        required: true
    },
    last_name:{
        type:String,
        required: false
    },
    email:{
        type:String,
        unique: true,
        required: true
    },
    password:{
        type:String,
        nullable: true,
        default: null
    },
    is_active:{
        type: Boolean,
        required: true,
        default: true
    },
    google_user:{
        type: Boolean,
        default: false,
    },
    created_at:{
        type: Date,
        requrired: true,
        default: new Date()
    },
    updated_at:{
        type: Date,
        required: true,
        default: new Date(),
    }
});

export const User = model('User',UserSchema);
