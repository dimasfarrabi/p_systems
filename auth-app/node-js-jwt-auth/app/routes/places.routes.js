const { verifyPlaces } = require("../middleware");
const controller = require("../controllers/places.controller");

module.exports = function(app) {
  
    app.post("/api/places/add",[ verifyPlaces.checkPlaceName ], controller.add);
    app.post("/api/places/update", controller.update);
    app.get("/api/places/line", controller.line);
    app.get("/api/places/remove/:id", controller.remove);
};
