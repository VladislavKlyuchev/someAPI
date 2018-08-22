var authController = require('../controllers/authcontroller.js');
const fs = require('fs')
const path = require('path')
const xmlParser = require('xml2js').parseString
const moment = require('moment')

module.exports = function (app, passport) {

    app.get('/signup', authController.signup);


    app.get('/signin', authController.signin);

    app.post('/listChannels', (req, res) => {
        if (!req.body.sessionId) {
            res.statusCode = 401;
            res.end();
        }
        req.db.sessions.findOne({ where: { key: req.body.sessionId } }).then((session) => {
            if (!session) {
                res.statusCode = 401;
                res.end();
            }
            req.db.user.findOne({ where: { id: session.userId } }).then((user) => {
                req.db.channels.findAll({ where: { packet: user.packet }, attributes: ['channelId', 'channelName', 'logoPath', 'streamPath', 'timeshift', 'hidden'] }).then((channels) => {
                    console.log(channels)
                    res.statusCode = 200;
                    res.json(channels)
                    res.end();
                })
            })
        })
        req.db.channels.findAll
    })
    app.post('/listEpg', (req, res) => {
        if (!req.body.sessionId) {
            res.statusCode = 401;
            res.end();
        }
        function formatterDate(date) {
            return new Date(+date.split(' ')[0])
        }
        const xml = fs.readFile(path.join(__dirname, '/xmltv.xml'), 'utf8', (err, result) => {
            xmlParser(result, (err, data) => {
                const programm = data.tv.programme
                const programme = programm.map(el => {
                    return {
                        channelId: el.$.channel,
                        start: el.$.start,
                        stop: el.$.stop,
                        title: el.title[0]._,
                        category: el.category ? el.category[0]._ : null
                    }
                })
                const result = programme.filter(el => {
                    if (el.channelId == req.body.channelId &&
                        moment(formatterDate(el.start)) >= moment(formatterDate(req.body.fromDate)) &&
                        moment(formatterDate(el.stop)) <= moment(formatterDate(req.body.toDate))) {
                        return el
                    }
                })
                res.statusCode = 200
                res.json({ programme: result })
                res.end();

            })
        })



    })
    app.get('/dashboard', isLoggedIn, authController.dashboard);


    app.get('/logout', authController.logout);


    app.post('/auth', passport.authenticate('local-signin'), (req, res, test) => {

        req.db.sessions.findOne({ where: { userId: req.user.id } }).then((user) => {
            if (user) {
                res.statusCode = 200;
                res.json({ sessionId: user.key })
                res.end()
            } else {
                var newSession = {
                    userId: req.user.id
                }
                req.db.sessions.create(newSession).then((newUser, created) => {
                    if (!newUser) {
                        res.statusCode = 400
                        res.end()
                    } else {
                        res.statusCode = 201;
                        res.json({ sessionId: newUser.key })
                        res.end()
                    }

                })
            }
        })

    });


    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/signin');
    }


}






