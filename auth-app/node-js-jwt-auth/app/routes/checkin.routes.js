const controller = require("../controllers/checkin.controller");
module.exports = function(app) {
    app.post("/api/lot/checkin", controller.checkin);
    app.post("/api/lot/check_in", controller.check_in);
    app.get("/api/lot/confirmation/:id", controller.confirmation);
    app.get("/api/lot/checkout/:id", controller.checkout);
};