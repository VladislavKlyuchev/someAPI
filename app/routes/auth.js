var authController = require('../controllers/authcontroller.js')
const fs = require('fs')
const path = require('path')
const xmlParser = require('xml2js').parseString
const moment = require('moment')

module.exports = function(app, passport) {
  app.get('/signup', authController.signup)

  app.get('/signin', authController.signin)

  app.post('/listChannels', validSessionId, (req, res) => {
    req.db.user
      .findOne({ where: { id: req.userSession.userId } })
      .then(user => {
        req.db.chPackages
          .findAll({
            where: { packageId: user.packageId },
            include: [
              {
                model: req.db.channels,
                attributes: [
                  'channelId',
                  'channelName',
                  'logoPath',
                  'streamPath',
                  'timeshift',
                  'hidden'
                ]
              }
            ],
            order: ['order'],
            attributes: []
          })
          .then(channels => {
            res.statusCode = 200

            res.json(
              channels.map(el => {
                return el.channel
              })
            )
            res.end()
          })
      })
  })
  app.post('/listEpg', validSessionId, (req, res) => {
    if (!req.body.sessionId) {
      res.statusCode = 401
      res.end()
    } else if (
      !req.body.sessionId ||
      !req.body.channelId ||
      !req.body.fromDate ||
      !req.body.toDate
    ) {
      res.statusCode = 400
      res.end()
    } else {
      function formatterDate(date) {
        return new Date(+date.split(' ')[0])
      }
      console.log(path.basename(process.env.filePath + '/xmltv.xml'))
      const xml = fs.readFile(
        process.env.filePath + '/xmltv.xml',
        'utf8',
        (err, result) => {
          xmlParser(result, (err, data) => {
            if (err) {
              res.statusCode = 400
              res.end()
            } else {
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
                if (
                  el.channelId == req.body.channelId &&
                  moment(formatterDate(el.start)) >=
                    moment(formatterDate(req.body.fromDate)) &&
                  moment(formatterDate(el.stop)) <=
                    moment(formatterDate(req.body.toDate))
                ) {
                  return el
                }
              })
              res.statusCode = 200
              res.json({ programme: result })
              res.end()
            }
          })
        }
      )
    }
  })
  app.post('/allChannels', isDashboard, (req, res) => {
    req.db.channels.findAll().then(channels => {
      req.db.chPackages
        .findAll({
          include: [
            {
              model: req.db.channels,
              attributes: [
                'id',
                'channelId',
                'channelName',
                'channelNameEn',
                'xmlTvId',
                'logoPath',
                'streamPath',
                'hidden',
                'categoryId'
              ]
            }
          ]
        })
        .then(result => {
          res.statusCode = 200
          const channelsWithPackage = result.map(el => {
            return {
              packageId: el.packageId,
              order: el.order,
              id: el.channel.id,
              channelId: el.channel.channelId,
              channelName: el.channel.channelName,
              channelNameEn: el.channel.channelNameEn,
              xmlTvId: el.channel.xmlTvId,
              logoPath: el.channel.logoPath,
              streamPath: el.channel.streamPath,
              timeshift: el.channel.timeshift,
              hidden: el.channel.hidden,
              categoryId: el.channel.categoryId
            }
          })
          res.json({
            channels: channels,
            channelsWithPackage: channelsWithPackage
          })
          res.end()
        })
    })
  })
  app.post('/deleteChannel', isDashboard, (req, res) => {
    req.db.channels
      .destroy({ where: { channelId: req.body.channelId } })
      .then(ok => {
        res.statusCode = 200
        res.end()
      })
  })
  app.post('/updateChannel', isDashboard, (req, res) => {
    const channel = {
      channelId: req.body.channelId,
      channelName: req.body.channelName,
      channelNameEn: req.body.channelNameENG,
      xmlTvId: req.body.xmlTvId,
      logoPath: req.body.logoPath,
      streamPath: req.body.streamPath,
      timeshift: req.body.timeshift,
      hidden: req.body.hidden,
      categoryId: req.body.categoryId
    }
    req.db.channels
      .update(channel, { where: { channelId: channel.channelId } })
      .then(ok => {
        res.statusCode = 200
        res.end()
      })
  })
  app.post('/createChannel', isDashboard, (req, res) => {
    console.log(req.body)
    const newChannel = {
      channelId: req.body.channelId,
      channelName: req.body.channelName,
      channelNameEn: req.body.channelNameENG,
      xmlTvId: req.body.xmlTvId,
      logoPath: req.body.logoPath,
      streamPath: req.body.streamPath,
      timeshift: req.body.timeshift,
      hidden: req.body.hidden,
      categoryId: req.body.categoryId
    }
    req.db.channels
      .create(newChannel)
      .then(() => {
        res.statusCode = 201
        res.end()
      })
      .catch(err => console.log(err))
  })
  app.post('/getPackages', isDashboard, (req, res) => {
    req.db.packages.findAll().then(ok => {
      res.statusCode = 200
      res.json(ok)
      res.end()
    })
  })
  app.post('/addPackage', isDashboard, (req, res) => {
    console.log(req.body)
    if (!req.body.name) {
      res.statusCode = 400
      res.end()
    }
    req.db.packages.create({ name: req.body.name }).then(ok => {
      res.statusCode = 200
      res.json(ok)
      res.end()
    })
  })
  app.post('/addChannelToPackage', isDashboard, (req, res) => {
    console.log(req.body.channels)
    if (!req.body.channels) {
      res.statusCode = 400
      res.end()
    } else {
      req.db.chPackages.bulkCreate(req.body.channels).then(() => {
        res.statusCode = 200
        res.end()
      })
    }
  })
  app.post('/deleteFromPackage', isDashboard, (req, res) => {
    if (!req.body.channel) {
      res.statusCode = 400
      res.end()
    } else {
      console.log(req.body.channel)
      req.db.chPackages
        .destroy({
          where: {
            channelId: req.body.channel.channelId,
            packageId: req.body.channel.packageId
          }
        })
        .then(() => {
          res.statusCode = 200
          res.end()
        })
    }
  })
  app.post('/sortChannels', isDashboard, (req, res) => {
    console.log(req.body.channels)
    if (!req.body.channels) {
      res.statusCode = 400
      res.end()
    } else {
      console.log(req.body.channels)
      req.body.channels.forEach(async el => {
        await req.db.chPackages.update(
          { order: el.order },
          { where: { channelId: el.channelId, packageId: el.packageId } }
        )
      })
      res.statusCode = 200
      res.end()
    }
  })
  app.post('/getCategories', (req, res) => {
    req.db.category.findAll().then(ok => {
      res.statusCode = 200
      res.json(ok)
      res.end()
    })
  })
  app.get('/dashboard', isLoggedIn, authController.dashboard)

  app.get('/logout', authController.logout)

  app.post('/auth', passport.authenticate('local-signin'), (req, res, test) => {
    req.db.sessions.findOne({ where: { userId: req.user.id } }).then(user => {
      if (user) {
        res.statusCode = 200
        res.json({ sessionId: user.key })
        res.end()
      } else {
        var newSession = {
          userId: req.user.id,
          lastVisit: moment(new Date()).format('YYYY-MM-DD HH:mm')
        }
        req.db.sessions.create(newSession).then((newUser, created) => {
          if (!newUser) {
            res.statusCode = 400
            res.end()
          } else {
            res.statusCode = 201
            res.json({ sessionId: newUser.key })
            res.end()
          }
        })
      }
    })
  })
  function validSessionId(req, res, next) {
    if (!req.body.sessionId) {
      res.statusCode = 401
      res.end()
    } else {
      req.db.sessions
        .findOne({ where: { key: req.body.sessionId } })
        .then(ok => {
          if (!ok) {
            res.statusCode = 401
            res.end()
          } else {
            next()
          }
        })
        .catch(err => res.redirect('/logout'))
    }
  }
  function isDashboard(req, res, next) {
    if (!req.body.dashboard || req.body.dashboard != 123321) {
      res.statusCode = 401
      res.end()
    } else {
      next()
    }
  }
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next()

    res.redirect('/signin')
  }
}
