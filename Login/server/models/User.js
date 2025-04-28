
import mongoose from "mongoose";
import { ModuleSchema } from "./Module.js"; // importa esquema de módulos

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
      (val) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)
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

  refresh_token: String,

  //curso clonado desde plantilla
  curso: {
    nombre: String,
    modulos: [ModuleSchema]
  }

},
{
  virtuals: {
    full_name: {
      get() {
        return this.first_name + " " + this.last_name;
      }
    },
    id: {
      get() {
        return this._id;
      }
    }
  }
});

export const User = mongoose.model("User", userSchema);
