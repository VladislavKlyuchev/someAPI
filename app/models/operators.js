
module.exports = function (sequelize, Sequelize) {

    var Operators = sequelize.define('operators', {
        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        name: { type: Sequelize.STRING, notEmpty: true },
        type: { type: Sequelize.STRING, notEmpty: true },
        streamServerIP: {type: Sequelize.STRING, notEmpty: true },
        streamServerIP2: {type: Sequelize.STRING, notEmpty: true },
        timeshiftIP: {type: Sequelize.STRING, notEmpty: true },
        description: {type: Sequelize.STRING , notEmpty: true },
        status: {type: Sequelize.BOOLEAN, defaultValue: 1},
        key: { type: Sequelize.UUID, notEmpty: true, defaultValue: Sequelize.UUIDV1 },

    });
    Operators.associate = function (models) {
        models.users.belongsTo(models.operators)
        models.historyPackages.belongsTo(models.users)
		
	};
    return Operators;

}
