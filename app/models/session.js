
module.exports = function (sequelize, Sequelize) {

	var Sessions = sequelize.define('sessions', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
		key: { type: Sequelize.UUID, notEmpty: true, defaultValue:  Sequelize.UUIDV1 },
		lastVisit: {type: Sequelize.DATE, notEmpty: true}

	});
	Sessions.associate = function (models) {
		models.sessions.belongsTo(models.users)
	};
	return Sessions;

}