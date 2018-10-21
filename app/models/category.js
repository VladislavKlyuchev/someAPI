module.exports = function (sequelize, Sequelize) {

    var Category = sequelize.define('category', {
        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        name: { type: Sequelize.STRING, notEmpty: true },
        key: {type: Sequelize.STRING, notEmpty: true}

    });
    Category.associate = function (models) {
        models.channels.belongsTo(models.category)
    };
    return Category;

}