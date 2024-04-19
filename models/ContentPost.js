const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContentPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    descriptionImages: [
      {
        type: String,
      },
    ],
    descriptionVideos: [
      {
        type: String,
      },
    ],
    primaryImage: {
      type: String,
    },
    audio: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

ContentPostSchema.set("toJSON", {
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
  },
});

const ContentPost = mongoose.model("ContentPost", ContentPostSchema);
module.exports = ContentPost;
