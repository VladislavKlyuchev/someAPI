
module.exports = function (sequelize, Sequelize) {

	var Users = sequelize.define('users', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
		name: { type: Sequelize.STRING, notEmpty: true },
		uuid: { type: Sequelize.UUID, notEmpty: true },
		pin: { type: Sequelize.STRING, notEmpty: true },
		status: { type: Sequelize.BOOLEAN, defaultValue: false }
		
	});
	return Users;

}