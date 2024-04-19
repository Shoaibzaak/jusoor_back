const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CategoryModel = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

CategoryModel.set("toJSON", {
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    delete ret.password;
  },
});

const Category = mongoose.model("Category", CategoryModel);
module.exports = Category;
