module.exports = function(sequelize, Sequelize) {
	var historyPackages = sequelize.define('historyPackages', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
		status: { type: Sequelize.BOOLEAN, defaultValue: true }
	});

	return historyPackages;
};
