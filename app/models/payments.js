module.exports = function(sequelize, Sequelize) {
	var payments = sequelize.define('payments', {
        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        price: {type: Sequelize.INTEGER }
	});

    payments.associate = function (models) {
		models.payments.belongsTo(models.operators)
	};
	return payments;
};
