
module.exports = function (sequelize, Sequelize) {

	var Packages = sequelize.define('packages', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
		name: { type: Sequelize.STRING, notEmpty: true }
	});
	Packages.associate = function (models) {
		models.chPackages.belongsTo(models.packages)
		models.user.belongsTo(models.packages)
	};
	return Packages;

}