const controller = require("../controllers/checkin.controller");
module.exports = function(app) {
    app.post("/api/lot/checkin", controller.checkin);
    app.get("/api/lot/checkout/:id", controller.checkout);
};