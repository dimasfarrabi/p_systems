module.exports = (sequelize, Sequelize) => {
    const Vehicle = sequelize.define("vehicle_type", {
        id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true
        },
        vehicle: {
            type: Sequelize.STRING
        }
    });
    return Vehicle;
};