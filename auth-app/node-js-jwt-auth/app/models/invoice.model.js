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
        user_id: {
            type: Sequelize.STRING
        },
        officer_id: {
            type: Sequelize.STRING
        },
        date_in: {
            type: Sequelize.DATE
        },
        date_out: {
            type: Sequelize.DATE
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