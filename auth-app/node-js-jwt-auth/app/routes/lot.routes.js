const { verifyLot } = require("../middleware");
const { verifyPricing } = require("../middleware");
const controller = require("../controllers/lot.controller");
module.exports = function(app) {
    app.post("/api/lot/add", [ verifyLot.checkPlaceName ], controller.add);
    app.post("/api/lot/editaddress", controller.editaddress);
    app.get("/api/lot/list", controller.list);
    app.post("/api/lot/newdetail", [ verifyPricing.checkPricing ], controller.newdetail);
    app.get("/api/lot/details", controller.details);
    app.post("/api/lot/edit", controller.edit);
    app.get("/api/lot/remove/:id", controller.remove);
    app.get("/api/lot/reports/:id", controller.reports);
};