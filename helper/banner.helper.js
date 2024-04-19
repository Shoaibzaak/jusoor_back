var Model = require("../models/index");

module.exports = {
    // Job seeker Pin
    createBanner: async (data) => {
        console.log("createBannerHelperFunction is called");
        const Banner = new Model.Banner(data);
        await Banner.save();
        return Banner;
    },

    findBannerById: async (bannerId) => {
        console.log("findPinById HelperFunction is called");

        const Banner = await Model.Banner.findOne({_id:bannerId});
        return Banner;
    }
};
