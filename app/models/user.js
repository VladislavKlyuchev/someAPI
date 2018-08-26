
module.exports = function (sequelize, Sequelize) {

	var User = sequelize.define('user', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
		name: { type: Sequelize.STRING, notEmpty: true },
		uuid: { type: Sequelize.UUID, notEmpty: true },
		status: { type: Sequelize.ENUM('active', 'inactive'), defaultValue: 'active' }

	});

	return User;

}