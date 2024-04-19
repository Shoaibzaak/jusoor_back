const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const QueryModel = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    subject:{
     type:String
    },
    phoneNumber: {
      type: Number,
    },
    query: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

QueryModel.set("toJSON", {
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    delete ret.password;
  },
});

const Query = mongoose.model("Query", QueryModel);
module.exports = Query;
