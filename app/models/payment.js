module.exports = function(sequelize, Sequelize) {
	var payments = sequelize.define('payments', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
		invoice: { type: Sequelize.INTEGER, defaultValue: 0 }
	});
	Operators.associate = function(models) {
		models.payments.belongsTo(models.operators);
	};
	return payments;
};
