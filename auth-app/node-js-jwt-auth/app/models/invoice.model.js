module.exports = (sequelize, Sequelize) => {
    const Invoice = sequelize.define("invoice", {
        id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true
        },
        unique_id: {
            type: Sequelize.STRING
        },
        date_in: {
            type: Sequelize.DATETIME
        },
        date_out: {
            type: Sequelize.DATETIME
        },
        final_price: {
            type: Sequelize.FLOAT
        },
        payment_status:{
            type:Sequelize.TINYINT,
            allowNull:false,
            defaultValue: "0"
        }
    });
    return Invoice;
};