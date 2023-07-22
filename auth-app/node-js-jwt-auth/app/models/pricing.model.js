module.exports = (sequelize, Sequelize) => {
    const Pricing = sequelize.define("pricing_lot", {
        id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true
        },
        parking_lot_id: {
            type: Sequelize.STRING
        },
        vehicle_id: {
            type: Sequelize.STRING
        },
        capacity: {
            type: Sequelize.FLOAT
        },
        price: {
            type: Sequelize.FLOAT
        },
        booking_price: {
            type: Sequelize.FLOAT
        },
        addons_price: {
            type: Sequelize.FLOAT
        }
    });
    return Pricing;
};
  