const controller = require("../controllers/checkin.controller");
const { verifyUniqueId } = require("../middleware");
module.exports = function(app) {
    app.post("/api/lot/checkin", controller.checkin);
    app.post("/api/lot/check_in", controller.check_in);
    app.get("/api/lot/confirmation/:id", controller.confirmation);
    app.get("/api/lot/client/confirmation/:id", controller.client_confirmation);
    app.get("/api/lot/checkout/:id",[ verifyUniqueId.checkConfirmation ],controller.checkout);
    app.get("/api/lot/checkout/confirmation/:id", controller.checkout_confirmation);
};