var authController = require('../controllers/authcontroller.js')
const fs = require('fs')
const path = require('path')
const xmlParser = require('xml2js').parseString
const moment = require('moment')

module.exports = function (app, passport) {
  app.get('/signup', authController.signup)

  app.get('/signin', authController.signin)
  // URL FOR OPERATORS API 
  app.post('/listPackagesWithPrices', isOperator, (req, res) => {
    req.db.packages.findAll({
      where: { operatorId: req.user.id }
    })
      .then((result) => {
        const body = result.map(el => {
          return { id: el.id, name: el.name, price: el.price }
        })
        res.statusCode = 200
        res.json(body)
        res.end()
      })
  })
  app.post('/createAccount', isOperator, (req, res) => {
    if (!req.body.packageId || !req.body.uuid || !req.body.pin || !req.body.status || !req.body.name) {
      res.statusCode = 400
      res.end()
    } else {
      const newUser = {
        uuid: req.body.uuid,
        pin: req.body.pin,
        name: req.body.name,
        status: req.body.status,
        packageId: req.body.packageId,
        operatorId: req.user.id
      }
      req.db.users.create(newUser)
        .then((result) => {
          res.statusCode = 200
          res.json(result)
          res.end()
        })
        .catch((err) => {
          res.statusCode = 400
          res.end();
        })
    }
  })
  app.post('/AttachSTBOnAccount', isOperator, (req, res) => {
    if (!req.body.userId || !req.body.uuid) {
      res.statusCode = 400
      res.end()
    } else {
      req.db.users.update({
        uuid: req.body.uuid,
      }, {
          where: { id: req.body.userId }
        })
        .then(result => {
          console.log(result)
          res.statusCode = 200
          res.end()

        })
        .catch(err => {
          res.statusCode = 400
          res.end();
        })
    }
  })
  
  app.post('/changePackageOnAccount', isOperator, (req, res) => {

    if (!req.body.userId || !req.body.packageId) {
      res.statusCode = 400
      res.end()
    } else {
      req.db.users.update({
        packageId: req.body.packageId
      },
        {
          where: {id: req.body.userId}
        })
        .then(result => {
          req.db.historyPackages.create({
            packageId: req.body.packageId,
            userId: req.body.userId
          })
          .then((resultTwo) => {
            res.statusCode = 200
            res.end()
          })
          .catch(err => {
            res.statusCode = 405
            res.end()
          })
        })
        .catch(err => {
          res.statusCode = 405
          res.end()
        })
    }
  })
  app.post('/changeUserStatus', isOperator, (req,res) => {
    if(!req.body.userId) {
      res.statusCode = 400
      res.end()
    } else {
      req.db.users.update({
        status: req.body.status
      },
    {
      where: {id: req.body.userId}
    })
    .then(result => {
      res.end()
    })
    .catch(err => {
      res.statusCode = 400
      res.end()
    })
    }
  })
  // URL FOR OPERATOR API
  app.post('/authOperator', isOperator, (req, res) => {
    res.json({key: req.user.key})
    res.end()
  })
  app.post('/operatorChannels', isOperator, (req, res) => {
    req.db.packages.findAll({
      where: {operatorId: req.user.id}
    })
    then(reslut => {

    })
  })
  // URL FOR CLIENTS
  app.post('/getReleasedAppVersion', validSessionId, (req, res) => {
    res.json({ version: "v0.0.1" })
    res.end()
  })
  app.post('/updateSession', validSessionId, (req, res) => {
    res.json({ result: "Session update!" })
    res.end()
  })
  app.post('/getAppPackage', validSessionId, (req, res) => {
    res.json({ url: "/path/to/apk/file" })
    res.end()
  })
  app.post('/listChannels', validSessionId, (req, res) => {
    req.db.users
      .findOne({ where: { id: req.userSession.userId } })
      .then(user => {
        console.log(user)
        if(user.status != 0) {
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
        } else {
          res.statusCode = 403,
          res.end()
        }
        
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
      adult: req.body.adult,
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

    const newChannel = {
      channelId: req.body.channelId,
      channelName: req.body.channelName,
      channelNameEn: req.body.channelNameENG,
      xmlTvId: req.body.xmlTvId,
      adult: req.body.adult,
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
    } else {
      const newPackage = {
        name: req.body.name,
        operatorId: req.body.operatorId,
        price: req.body.price
      }
      req.db.packages.create(newPackage).then(ok => {
        res.statusCode = 200
        res.json(ok)
        res.end()
      })
    }


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
  app.post('/addNewCategory', isDashboard, (req, res) => {
    if (!req.body.name) {
      res.statusCode = 400
      res.end()
    } else {
      const newCategory = {
        name: req.body.name
      }
      req.db.category
        .create(newCategory)
        .then(() => {
          res.statusCode = 201
          res.end()
        })
        .catch(err => console.log(err))
    }
  })
  app.post('/getOperators', isDashboard, (req, res) => {
    req.db.operators.findAll().then(ok => {
      res.statusCode = 200
      res.json(ok)
      res.end()
    })
  })
  app.post('/createNewOperator', isDashboard, (req, res) => {
    if (!req.body.name || !req.body.type || !req.body.timeshift || !req.body.streamIp || !req.body.streamIp2) {
      res.statusCode = 400
      res.end()
    } else {
      const newOperator = {
        name: req.body.name,
        type: req.body.type,
        status: req.body.status,
        streamServerIP: req.body.streamIp,
        streamServerIP2: req.body.streamIp2,
        timeshiftIP: req.body.timeshift,
        description: req.body.description
      }
      req.db.operators.create(newOperator)
        .then(() => {
          res.statusCode = 201
          res.end()
        })
    }
  })
  app.post('/updateOperator', isDashboard, (req, res) => {

    if (!req.body.name || !req.body.type || !req.body.timeshift || !req.body.streamIp || !req.body.streamIp2 || !req.body.id) {
      res.statusCode = 400
      res.end()
    } else {
      const updateOperator = {
        id: req.body.id,
        name: req.body.name,
        type: req.body.type,
        active: req.body.active,
        streamServerIP: req.body.streamIp,
        streamServerIP2: req.body.streamIp2,
        timeshiftIP: req.body.timeshift,
        description: req.body.description
      }

      req.db.operators.update(updateOperator, { where: { id: updateOperator.id } })
        .then(() => {
          res.statusCode = 201
          res.end()
        })

    }
  })
  app.post('/deleteOperator', isDashboard, (req, res) => {
    if (!req.body.id) {
      res.statusCode = 400
      res.end()
    } else {
      req.db.channels
        .destroy({ where: { id: req.body.id } })
        .then(ok => {
          res.statusCode = 200
          res.end()
        })
    }
  })
  app.post('/getUsers', isDashboard, (req, res) => {
    req.db.users.findAll().then(result => {
      res.statusCode = 200
      res.json(result)
      res.end()
    })
  })
  app.post('/createNewUser', isDashboard, (req, res) => {

    if (!req.body.name || !req.body.pin || !req.body.packageId || !req.body.operatorId || !req.body.status || !req.body.uuid) {

      res.statusCode = 400
      res.end()
    } else {
      const newUser = {
        name: req.body.name,
        status: req.body.status,
        uuid: req.body.uuid,
        packageId: req.body.packageId,
        operatorId: req.body.operatorId,
        pin: req.body.pin,
      }
      console.log(newUser, 'мы тут!!!!')
      req.db.users.create(newUser)
        .then(() => {
          res.statusCode = 201
          res.end()
        })

    }

  })
  app.post('/updateUser', isDashboard, (req, res) => {

    if (!req.body.name || !req.body.pin || !req.body.packageId || !req.body.operatorId || !req.body.status || !req.body.uuid || !req.body.id) {
      res.statusCode = 400
      res.end()
    } else {
      const updateUser = {
        name: req.body.name,
        status: req.body.status,
        uuid: req.body.uuid,
        status: req.body.status,
        id: req.body.id,
        packageId: req.body.packageId,
        operatorId: req.body.operatorId,
        pin: req.body.pin,
      }

      req.db.users.update(updateUser, { where: { id: updateUser.id } })
        .then(() => {
          res.statusCode = 201
          res.end()
        })

    }
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
    console.log(req.body)
    if (!req.body.dashboard || req.body.dashboard != 123321) {
      res.statusCode = 401
      res.end()
    } else {
      next()
    }
  }
  function isOperator(req, res, next) {
    if (!req.body.key) {
      res.statusCode = 401
      res.end()
    } else {
      req.db.operators.findOne({
        where: { key: req.body.key }
      })
        .then(result => {
          if(result !== null) {
            req.user = result
            next()
          } else {
            res.statusCode = 403
            res.end()
          }
         
        })
        .catch(err => {
          res.statusCode = 401
          res.end()
        })
    }
  }
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next()

    res.redirect('/signin')
  }
}
