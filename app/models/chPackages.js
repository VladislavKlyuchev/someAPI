module.exports = function (sequelize, Sequelize) {

	var chPackages = sequelize.define('chPackages', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
		order: { type: Sequelize.INTEGER, notEmpty: false },

    });
    chPackages.associate = function (models) {
		models.chPackages.belongsTo( models.channels );
	};
	return chPackages;

}