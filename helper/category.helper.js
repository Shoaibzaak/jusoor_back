
var Model = require("../models/index");

module.exports = {
    // Job seeker Pin
    createCategory: async (data) => {
        console.log("createCategoryHelperFunction is called");
        const Category = new Model.Category(data);
        await Category.save();
        return Category;
    },

    findCategoryById: async (CategoryId) => {
        console.log("findCategoryById HelperFunction is called", CategoryId);

        const result = await Model.Category.findOne({_id:CategoryId});
        return result;
    }
};
