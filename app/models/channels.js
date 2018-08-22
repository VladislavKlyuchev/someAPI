module.exports = function(sequelize, Sequelize) {

	var Channels = sequelize.define('channels', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
		channelId: { type: Sequelize.STRING,notEmpty: true},
		channelname: { type: Sequelize.STRING,notEmpty: true}, 
		channelNameEn: { type: Sequelize.STRING,notEmpty: true},  
		xmlTvId: { type: Sequelize.STRING,notEmpty: true},  
		key: { type: Sequelize.STRING,notEmpty: true},
		packet: { type: Sequelize.STRING,notEmpty: true},
		logoPath: { type: Sequelize.STRING,notEmpty: true},
		streamPath: { type: Sequelize.STRING,notEmpty: true},
		timeshift: { type: Sequelize.STRING,notEmpty: true},
		hidden: { type: Sequelize.BOOLEAN}

});

	return Channels;

}