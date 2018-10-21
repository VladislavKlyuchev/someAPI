module.exports = function (sequelize, Sequelize) {

	var Channels = sequelize.define('channels', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
		channelId: { type: Sequelize.STRING, notEmpty: true },
		channelName: { type: Sequelize.STRING, notEmpty: true },
		channelNameEn: { type: Sequelize.STRING, notEmpty: true },
		xmlTvId: { type: Sequelize.STRING, notEmpty: true },
		logoPath: { type: Sequelize.STRING, notEmpty: true },
		adult: {type: Sequelize.BOOLEAN, defaultValue: false},
		streamPath: { type: Sequelize.STRING, notEmpty: true },
		timeshift: { type: Sequelize.STRING, notEmpty: true },
		recordingMediaUrl : {type: Sequelize.STRING, notEmpty: true},
		hidden: { type: Sequelize.BOOLEAN }

	});
	Channels.associate = function (models) {
		models.channels.hasMany(models.chPackages, {onDelete: 'cascade'})
	}
	return Channels;

}