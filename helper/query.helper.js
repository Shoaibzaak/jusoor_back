
var Model = require("../models/index");

module.exports = {
    // Job seeker Pin
    createQuery: async (data) => {
        console.log("createQueryHelperFunction is called");
        const Query = new Model.Query(data);
        await Query.save();
        return Query;
    },

    findQueryById: async (QueryId) => {
        console.log("findPinById HelperFunction is called", QueryId);

        const Query = await Model.Query.findOne({_id:QueryId});
        return Query;
    }
};
