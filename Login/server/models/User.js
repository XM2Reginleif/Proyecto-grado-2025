import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = Schema({
    username: {
        type: String, 
        required: true
    },

    email: {
        type: String,
        required: true, 
        lowercase: true, 
        trim: true, 
        unique: true,
        validate: [
            (val) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val),
        ]
    },

    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
        min: 6
    },

    refresh_token: String

    },
    {
        virtuals: {
            full_name: {
                get(){
                    return this.first_name + " " + this.last_name;
                }
            },
            id: {
                get(){
                    return this._id;
                }
            }
        }
    }
)

export const User = mongoose.model("User", userSchema);