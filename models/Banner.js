const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BannerModel = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    videos: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  }
);

BannerModel.set("toJSON", {
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    delete ret.password;
  },
});

const Banner = mongoose.model("Banner", BannerModel);
module.exports = Banner;
