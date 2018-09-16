
module.exports = function (sequelize, Sequelize) {

	var Packages = sequelize.define('packages', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
		name: { type: Sequelize.STRING,  allowNull: false },
		price: {type: Sequelize.INTEGER,  allowNull: false },
		operatorId: {type: Sequelize.INTEGER, allowNull: false }
	});
	Packages.associate = function (models) {
		models.chPackages.belongsTo(models.packages)
		models.packages.belongsTo(models.operators)
		models.users.belongsTo(models.packages)
		models.historyPackages.belongsTo(models.packages)
		models.operators.hasMany(models.packages, {onDelete: 'cascade'})
	};
	return Packages;

}
