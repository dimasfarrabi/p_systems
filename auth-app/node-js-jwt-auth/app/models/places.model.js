module.exports = (sequelize, Sequelize) => {
    const Places = sequelize.define("places", {
        park_id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true
        },
        park_name: {
            type: Sequelize.STRING
        },
        park_address: {
            type: Sequelize.STRING
        },
        capacity: {
            type: Sequelize.INTEGER
        },
        price: {
            type: Sequelize.FLOAT
        },
        cumulative_price: {
            type: Sequelize.FLOAT
        },
        is_Active:{
            type:Sequelize.TINYINT,
            allowNull:false,
            defaultValue: "1"
        }
    });
  
    return Places;
  };
  