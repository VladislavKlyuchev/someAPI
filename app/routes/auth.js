var authController = require("../controllers/authcontroller.js");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const xmlParser = require("xml2js").parseString;
const moment = require("moment");

async function updateUserHistory(db, user) {
  try {
    const formatted = {
      status: user.status,
      userId: user.id,
      packageId: user.packageId
    };
    const result = await db.create(formatted);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
module.exports = function(app, passport, env) {
  app.get("/signup", authController.signup);

  app.get("/signin", authController.signin);
  // URL FOR OPERATORS API
  app.get(
    `/billing-api/v${process.env.B}/:operatorId/package`,
    isOperator,
    async (req, res) => {
      try {
        const packages = await req.db.packages.findAll({
          where: { operatorId: req.user.id, status: 1 }
        });
        const categories = await req.db.category.findAll();
        const chPackages = await req.db.chPackages.findAll({
          where: { packageId: packages.map(el => el.id) },
          include: [
            {
              model: req.db.channels,
              attributes: [
                "id",
                "channelId",
                "channelName",
                "channelNameEn",
                "xmlTvId",
                "logoPath",
                "streamPath",
                "hidden",
                "categoryId"
              ]
            }
          ]
        });

        const channels = chPackages.map(el => {
          return {
            packageId: el.packageId,
            key: el.channel.channelNameEn,
            lid: el.channel.channelId,
            name: el.channel.channelName,
            mediaUrl: el.channel.streamPath,
            recordingMediaUrl: el.channel.recordingMediaUrl,
            recorderHours: el.channel.timeshift,
            logoUrl: el.channel.logoPath,
            category:
              [
                categories.find(cat => cat.id == el.channel.categoryId).name,
                categories.find(cat => cat.id == el.channel.categoryId).key
              ] || []
          };
        });
        const formattedResponse = packages.map(el => {
          return {
            id: el.id,
            name: el.name,
            price: el.price,
            channels: channels
              .filter(sub => el.id == sub.packageId)
              .map(sub => {
                return {
                  key: sub.key,
                  lid: sub.lid,
                  name: sub.name,
                  mediaUrl: sub.mediaUrl,
                  recordingMediaUrl: sub.recordingMediaUrl,
                  recorderHours: sub.recorderHours,
                  logoUrl: sub.logoUrl,
                  category: sub.category
                };
              })
          };
        });
        res.json(formattedResponse);
        res.end();
        /*
			if(packages == null ) {
				res.json([])
				res.end();
			} else {
				const formattedPackages = packages.map(el => {
					return {
						id: el.id,
						name: el.name,
						price: el.price
					}
				})
				res.json(formattedPackages)
				res.end()
				
			}*/
      } catch (err) {
        console.error(err);
        res.statusCode = 409;
        res.end();
      }
    }
  );
  app.post(
    `/billing-api/v${process.env.B}/:operatorId/account`,
    isOperator,
    async (req, res) => {
      if (!req.body.packageId || !req.body.pin || !req.body.name) {
        res.statusCode = 400;
        res.end();
      } else {
        try {
          const packageId = req.body.packageId;
          const package = await req.db.packages.findOne({
            where: { operatorId: req.user.id, id: packageId }
          });
          if (package == null) {
            res.statusCode = 403;
            res.end();
          } else {
            const user = {
              packageId: req.body.packageId,
              pin: req.body.pin,
              name: req.body.name,
              operatorId: req.user.id
            };
            const newUser = await req.db.users.create(user);
            await updateUserHistory(req.db.historyPackages, newUser);
            const result = newUser.get("id");
            res.statusCode = 201;
            res.json({ accountId: result });
            res.end();
          }
        } catch (err) {
          console.log(err);
          res.statusCode = 409;
          res.end();
        }
      }
    }
  );
  app.put(
    `/billing-api/v${process.env.B}/:operatorId/account/:accountId`,
    isOperator,
    async (req, res) => {
      const { status, stbId, packageId, pin, name } = req.body;
      const accountId = req.params.accountId;

      if (!status || !stbId || !packageId || !pin || !name) {
        res.statusCode = 400;
        res.end();
      } else {
        try {
          const package = await req.db.packages.findOne({
            where: { operatorId: req.user.id, id: packageId }
          });
          if (package == null) {
            res.statusCode = 403;
            res.end();
          } else {
            const update = await req.db.users.update(
              {
                uuid: stbId,
                name: name,
                pin: pin,
                packageId: packageId,
                status: status == "active" ? 1 : 0
              },
              { where: { operatorId: req.user.id, id: accountId } }
            );
            const user = {
              id: accountId,
              packageId: packageId,
              status: status == "active" ? 1 : 0
            };
            await updateUserHistory(req.db.historyPackages, user);
            res.end();
          }
        } catch (err) {
          console.log(err);
          res.statusCode = 409;
          res.end();
        }
      }
    }
  );
  app.get(
    `/billing-api/v${process.env.B}/:operatorId/account`,
    isOperator,
    async (req, res) => {
      let { from, size } = req.query;

      if ((!from && from !== 0) || !size) {
        res.statusCode = 400;
        res.end();
      } else {
        try {
          const users = await req.db.users.findAll({
            where: { operatorId: req.user.id }
          });
          if (users == null) {
            res.json([]);
            res.end();
          } else {
            const usersSlice = users
              .slice(from)
              .filter((u, i) => (i <= size ? true : false));
            const usersFormatted = usersSlice.map(u => {
              return {
                id: u.id,
                stbId: u.uuid,
                pin: u.pin,
                name: u.name,
                packageId: u.packageId,
                status: u.status == 1 ? "active" : "inactive"
              };
            });

            res.json(usersFormatted);
            res.end();
          }
        } catch (err) {
          console.log(err);
          res.statusCode = 409;
          res.end();
        }
      }
    }
  );
  app.get(
    `/billing-api/v${process.env.B}/:operatorId/amount-to-pay`,
    isOperator,
    async (req, res) => {
      const { dateFrom, dateTo } = req.query;
      if ((!dateFrom, !dateTo)) {
        res.statusCode = 400;
        res.end();
      } else {
        try {
          const payments = await req.db.payments.findAll({
            where: {
              operatorId: req.user.id,
              createdAt: { $between: [dateFrom, dateTo] }
            }
          });
          if (payments !== null) {
            let amount;
            if (payments.length > 1) {
              amount = payments.reduce((acc, value, i) => {
                return i == 1 ? acc.price + value.price : acc + value.price;
              });
            } else if (payments.length == 1) {
              amount = payments[0].price;
            }
            res.json({ amount });
            res.end();
          } else {
            res.json({ amount: 0 });
            res.end();
          }
        } catch (error) {
          console.log(error);
          res.statusCode = 409;
          res.end();
        }
      }
    }
  );
  app.get(
    `/billing-api/v${process.env.B}/:operatorId/account/history`,
    isOperator,
    async (req, res) => {
      const { dateFrom, dateTo } = req.query;
      if ((!dateFrom, !dateTo)) {
        res.statusCode = 400;
        res.end();
      } else {
        try {
          const usersHistory = await req.db.historyPackages
            .findAll({
              where: { createdAt: { $between: [dateFrom, dateTo] } }
            })
            .filter(u => u.userId !== null);
          const users = await req.db.users.findAll();

          let usersFormatted = usersHistory.map(h => {
            return {
              id: h.userId,
              date: h.createdAt,
              status: h.status == 1 ? "active" : "inactive",
              packageId: h.packageId,
              stbId: users.find(u => h.userId !== null && u.id == h.userId).uuid
            };
          });

          // Добавить статус им, и сделать юзеров сюда еще и выборку
          res.json(usersFormatted);
          res.end();
        } catch (err) {
          console.log(err);
          res.statusCode = 409;
          res.end();
        }
      }
    }
  );
  app.get(
    `/billing-api/v${process.env.B}/:operatorId/account/:accountId`,
    isOperator,
    async (req, res) => {
      const { accountId } = req.params;
      if (!accountId && accountId !== 0) {
        res.statusCode = 400;
        res.end();
      } else {
        try {
          const user = await req.db.users.findOne({
            where: { id: accountId, operatorId: req.user.id }
          });
          if (user == null) {
            res.statusCode = 404;
            res.end();
          } else {
            const formattedUser = {
              id: user.id,
              stbId: user.uuid,
              pin: user.pin,
              name: user.name,
              packageId: user.packageId,
              status: user.status == 1 ? "active" : "inactive"
            };
            res.json(formattedUser);
            res.end();
          }
        } catch (err) {}
      }
    }
  );
  // переделать позже
  app.post("/userHistory", isOperator, (req, res) => {
    req.db.users.findAll({ where: { operatorId: req.user.id } }).then(users => {
      const usersId = users.map(el => el.id);
      req.db.historyPackages
        .findAll({
          where: { userId: usersId }
        })
        .then(history => {
          const formatterHistory = history.map((h, i, arr) => {
            const endTime = arr[i + 1] ? arr[i + 1].updatedAt : new Date();
            return {
              userId: h.userId,
              createdAt: moment(h.createdAt).format("YYYY-MM-DD HH:mm"),
              updatedAt: moment(endTime).format("YYYY-MM-DD HH:mm"),
              status: h.status,
              name: h.name,
              packageId: h.packageId
            };
          });
          res.json(formatterHistory);
          res.end();
        });
    });
  });

  // URL FOR OPERATOR API
  app.post("/authOperator", isOperator, (req, res) => {
    res.json(req.user);
    res.end();
  });

  app.post("/getOperatorsUsers", isOperator, (req, res) => {
    req.db.users
      .findAll({
        where: { operatorId: req.user.id }
      })
      .then(result => {
        res.statusCode = 200;
        res.json(result);
        res.end();
      });
  });

  // URL FOR CLIENTS
  app.get(`/v${process.env.V}/android-app`, async (req, res) => {
    const stbId = req.query.stbId;
    if (!stbId) {
      res.statusCode = 400;
      res.end();
    } else {
      let result;
      try {
        result = await req.db.users.findOne({ where: { uuid: stbId } });
        if (result == null) {
          res.statusCode = 404;
          res.end();
        }
        const resultObject = {
          version: result.version,
          apkUrl: result.apkUrl
        };
        res.json(resultObject);
        res.end();
      } catch (err) {
        res.statusCode = 500;
        res.end();
      }
    }
  });
  console.log(process.env.V);
  console.log(process.env.V);
  console.log(`/v${process.env.V}/android-app`);
  console.log(`/v${process.env.V}/session/:sessionId/update`);
  app.post(
    `/v${process.env.V}/session/:sessionId/update`,
    validSessionId,
    async (req, res) => {
      const session = req.userSession;
      try {
        const result = await req.db.sessions.update(
          { lastVisit: moment(new Date()).format("YYYY-MM-DD HH:mm") },
          { where: { key: session.key } }
        );
        res.end();
      } catch (err) {
        res.statusCode = 409;
        res.end();
      }
    }
  );

  app.get(`/v${process.env.V}/channel`, validSessionId, async (req, res) => {
    const { user } = req;
    if (user.status == 0) {
      res.statusCode = 403;
      res.end();
    } else {
      try {
        const channels = await req.db.chPackages.findAll({
          where: { packageId: user.packageId },
          include: [
            {
              model: req.db.channels
            }
          ],
          order: ["order"],
          attributes: []
        });
        let categories = await req.db.category.findAll();
        if (categories == null) {
          categories = [];
        }
        const formattedCategories = categories.map(cat => {
          return { key: cat.key, name: cat.name };
        });
        const formattedChannels = channels.map(ch => {
          let channel = ch.channel;

          let result = {
            lid: channel.channelId,
            name: channel.channelName,
            mediaUrl: channel.streamPath,
            recordingMediaUrl: channel.recordingMediaUrl,
            recorderHours: channel.timeshift,
            logoUrl: channel.logoPath,
            category:
              [categories.find(cat => cat.id == channel.categoryId).key] || []
          };
          return result;
        });
        let result = {
          categories: formattedCategories,
          channels: formattedChannels
        };
        res.json(result);
        res.end();
      } catch (err) {
        console.log(err);
      }
    }
  });
  app.get(`/v${process.env.V}/channel/:channelKey/epg`, async (req, res) => {
    const { startDate, endDate } = req.query;
    const { channelKey } = req.params;
    if ((!startDate, !endDate)) {
      res.statusCode = 400;
      res.end();
    } else {
      const result = await axios.get(
        `http://192.168.5.194:5000/epg/?key=${channelKey}&startDate=${startDate}&endDate=${endDate}`
      );
      res.json(result.data);
      res.end();
    }
  });
  app.post("/allChannels", isDashboard, (req, res) => {
    req.db.channels.findAll().then(channels => {
      req.db.chPackages
        .findAll({
          include: [
            {
              model: req.db.channels,
              attributes: [
                "id",
                "channelId",
                "channelName",
                "channelNameEn",
                "xmlTvId",
                "logoPath",
                "streamPath",
                "hidden",
                "categoryId"
              ]
            }
          ]
        })
        .then(result => {
          res.statusCode = 200;
          const channelsWithPackage = result.map(el => {
            return {
              packageId: el.packageId || null,
              order: el.order,
              id: el.channel.id || null,
              channelId: el.channel.channelId,
              channelName: el.channel.channelName,
              channelNameEn: el.channel.channelNameEn,
              xmlTvId: el.channel.xmlTvId,
              logoPath: el.channel.logoPath,
              streamPath: el.channel.streamPath,
              timeshift: el.channel.timeshift,
              hidden: el.channel.hidden,
              categoryId: el.channel.categoryId
            };
          });
          res.json({
            channels: channels,
            channelsWithPackage: channelsWithPackage
          });
          res.end();
        });
    });
  });
  app.post("/deleteChannel", isDashboard, (req, res) => {
    req.db.chPackages
      .destroy({ where: { channelId: req.body.id } })

      .then(() => {
        req.db.channels.destroy({ where: { id: req.body.id } }).then(() => {
          res.statusCode = 200;
          res.end();
        });
      })
      .catch(err => {
        console.error(err);
      });
  });
  app.post("/updateChannel", isDashboard, (req, res) => {
    const channel = {
      channelId: req.body.channelId,
      channelName: req.body.channelName,
      channelNameEn: req.body.channelNameENG,
      xmlTvId: req.body.xmlTvId,
      adult: req.body.adult,
      recordingMediaUrl: req.body.recordingMediaUrl,
      logoPath: req.body.logoPath,
      streamPath: req.body.streamPath,
      timeshift: req.body.timeshift,
      hidden: req.body.hidden,
      categoryId: req.body.categoryId || null
    };
    req.db.channels
      .update(channel, { where: { channelId: channel.channelId } })
      .then(ok => {
        res.end();
      });
  });
  app.post("/createChannel", isDashboard, (req, res) => {
    const newChannel = {
      channelId: req.body.channelId,
      channelName: req.body.channelName,
      channelNameEn: req.body.channelNameENG,
      xmlTvId: req.body.xmlTvId,
      adult: req.body.adult,
      logoPath: req.body.logoPath,
      recordingMediaUrl: req.body.recordingMediaUrl,
      streamPath: req.body.streamPath,
      timeshift: req.body.timeshift,
      hidden: req.body.hidden,
      categoryId: req.body.categoryId || null
    };
    req.db.channels
      .create(newChannel)
      .then(() => {
        res.statusCode = 201;
        res.end();
      })
      .catch(err => console.error(err));
  });
  app.post("/getPackages", isDashboard, (req, res) => {
    req.db.packages.findAll().then(ok => {
      res.json(ok);
      res.end();
    });
  });
  app.post("/addPackage", isDashboard, (req, res) => {
    if (!req.body.name) {
      res.statusCode = 400;
      res.end();
    } else {
      const newPackage = {
        name: req.body.name,
        operatorId: req.body.operatorId,
        price: req.body.price
      };
      req.db.packages.create(newPackage).then(ok => {
        res.json(ok);
        res.end();
      });
    }
  });
  app.post("/addChannelToPackage", isDashboard, (req, res) => {
    console.log(req.body.channels);
    if (!req.body.channels) {
      res.statusCode = 400;
      res.end();
    } else {
      req.db.chPackages.bulkCreate(req.body.channels).then(() => {
        res.statusCode = 200;
        res.end();
      });
    }
  });
  app.post("/deleteFromPackage", isDashboard, (req, res) => {
    if (!req.body.channel) {
      res.statusCode = 400;
      res.end();
    } else {
      console.log(req.body.channel);
      req.db.chPackages
        .destroy({
          where: {
            channelId: req.body.channel.channelId,
            packageId: req.body.channel.packageId
          }
        })
        .then(() => {
          res.statusCode = 200;
          res.end();
        });
    }
  });
  app.post("/sortChannels", isDashboard, (req, res) => {
    console.log(req.body.channels);
    if (!req.body.channels) {
      res.statusCode = 400;
      res.end();
    } else {
      req.body.channels.forEach(async el => {
        await req.db.chPackages.update(
          { order: el.order },
          { where: { channelId: el.channelId, packageId: el.packageId } }
        );
      });
      res.statusCode = 200;
      res.end();
    }
  });
  app.post("/getCategories", (req, res) => {
    req.db.category.findAll().then(ok => {
      res.statusCode = 200;
      res.json(ok);
      res.end();
    });
  });
  app.post("/deleteCategories", isDashboard, async (req, res) => {
    console.log(req.body);
    if (!req.body.id && req.body.id != 0) {
      res.end();
    }
    try {
      await req.db.category.destroy({ where: { id: req.body.id } });
      res.end();
    } catch (error) {
      console.error(error);
    }
  });
  app.post("/editCategories", isDashboard, async (req, res) => {
    if (!req.body.id && req.body.id != 0) {
      res.end();
    }
    const updateCategory = {
      key: req.body.key,
      name: req.body.name
    };
    try {
      await req.db.category.update(updateCategory, {
        where: { id: req.body.id }
      });
      res.end();
    } catch (error) {
      console.error(error);
    }
  });
  app.post("/addNewCategory", isDashboard, (req, res) => {
    if (!req.body.name || !req.body.key) {
      res.statusCode = 400;
      res.end();
    } else {
      const newCategory = {
        name: req.body.name,
        key: req.body.key
      };
      req.db.category
        .create(newCategory)
        .then(() => {
          res.statusCode = 201;
          res.end();
        })
        .catch(err => console.log(err));
    }
  });
  app.post("/getOperators", isDashboard, (req, res) => {
    req.db.operators.findAll().then(ok => {
      res.statusCode = 200;
      res.json(ok);
      res.end();
    });
  });
  app.post("/createNewOperator", isDashboard, (req, res) => {
    if (
      !req.body.name ||
      !req.body.type ||
      !req.body.timeshift ||
      !req.body.streamIp ||
      !req.body.streamIp2
    ) {
      res.statusCode = 400;
      res.end();
    } else {
      const newOperator = {
        name: req.body.name,
        type: req.body.type,
        status: req.body.status,
        streamServerIP: req.body.streamIp,
        streamServerIP2: req.body.streamIp2,
        timeshiftIP: req.body.timeshift,
        description: req.body.description
      };
      req.db.operators.create(newOperator).then(() => {
        res.statusCode = 201;
        res.end();
      });
    }
  });
  app.post("/updateOperator", isDashboard, (req, res) => {
    if (
      !req.body.name ||
      !req.body.type ||
      !req.body.timeshift ||
      !req.body.streamIp ||
      !req.body.streamIp2 ||
      !req.body.id
    ) {
      res.statusCode = 400;
      res.end();
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
      };

      req.db.operators
        .update(updateOperator, { where: { id: updateOperator.id } })
        .then(() => {
          res.statusCode = 201;
          res.end();
        });
    }
  });
  app.post("/deleteOperator", isDashboard, (req, res) => {
    if (!req.body.id) {
      res.statusCode = 400;
      res.end();
    } else {
      req.db.channels.destroy({ where: { id: req.body.id } }).then(ok => {
        res.statusCode = 200;
        res.end();
      });
    }
  });
  app.post("/getUsers", isDashboard, (req, res) => {
    req.db.users.findAll().then(result => {
      res.statusCode = 200;
      res.json(result);
      res.end();
    });
  });
  app.post("/createNewUser", isDashboard, (req, res) => {
    if (
      !req.body.name ||
      !req.body.pin ||
      !req.body.packageId ||
      !req.body.version ||
      !req.body.apkUrl ||
      !req.body.operatorId ||
      req.body.status == undefined ||
      !req.body.uuid
    ) {
      console.log(req.body);
      res.statusCode = 400;
      res.end();
    } else {
      const newUser = {
        name: req.body.name,
        status: req.body.status,
        uuid: req.body.uuid,
        version: req.body.version,
        apkUrl: req.body.apkUrl,
        packageId: req.body.packageId,
        operatorId: req.body.operatorId,
        pin: req.body.pin
      };
      req.db.users.create(newUser).then(result => {
        req.db.historyPackages
          .create({
            status: result.status,
            packageId: result.packageId,
            userId: result.id
          })
          .then(r => {
            res.statusCode = 201;
            res.end();
          });
      });
    }
  });
  app.post("/updateUser", isDashboard, (req, res) => {
    if (
      !req.body.name ||
      !req.body.pin ||
      !req.body.packageId ||
      !req.body.version ||
      !req.body.apkUrl ||
      !req.body.operatorId ||
      !req.body.uuid ||
      !req.body.id
    ) {
      res.statusCode = 400;
      res.end();
    } else {
      const updateUser = {
        name: req.body.name,
        status: req.body.status,
        uuid: req.body.uuid,
        version: req.body.version,
        apkUrl: req.body.apkUrl,
        status: req.body.status,
        packageId: req.body.packageId,
        operatorId: req.body.operatorId,
        pin: req.body.pin
      };

      req.db.users
        .update(updateUser, { where: { id: req.body.id } })
        .then(() => {
          req.db.users
            .findOne({
              where: { id: req.body.id }
            })
            .then(result => {
              req.db.historyPackages
                .create({
                  status: result.status,
                  userId: result.id,
                  packageId: result.packageId
                })
                .then(r => {
                  res.statusCode = 201;
                  res.end();
                });
            });
        });
    }
  });
  app.post("/userHistoryAll", isDashboard, (req, res) => {
    req.db.historyPackages.findAll().then(history => {
      const formatterHistory = history.map(h => {
        return {
          userId: h.userId,
          createdAt: moment(h.createdAt).format("YYYY-MM-DD HH:mm"),
          updatedAt: moment(h.updatedAt).format("YYYY-MM-DD HH:mm"),
          status: h.status,
          packageId: h.packageId
        };
      });
      res.json(formatterHistory);
      res.end();
    });
  });
  app.post("/updatePackage", isDashboard, async (req, res) => {
    if (!req.body.packageId || !req.body.price || !req.body.name) {
      res.statusCode = 400;
      res.end();
    } else {
      const package = {
        price: req.body.price,
        name: req.body.name
      };

      await req.db.packages.update(package, {
        where: { id: req.body.packageId }
      });
      res.end();
    }
  });
  app.get("/dashboard", isLoggedIn, authController.dashboard);

  app.get("/logout", authController.logout);
  app.post("/authAdmin", (req, res) => {
    if (req.body.password === "ee5a3fa0-c234-11e8-8f36-ad9f7cf6a93d") {
      res.end();
    } else {
      res.statusCode = 403;
      res.end();
    }
  });
  app.post(`/v${process.env.V}/session`, async (req, res) => {
    const stbId = req.body.stbId;
    if (!stbId) {
      console.log(stbId);
      res.statusCode = 400;
      res.end();
    } else {
      let user;
      try {
        user = await req.db.users.findOne({ where: { uuid: stbId } });
        if (user == null) {
          res.statusCode = 404;
          res.end();
        } else {
          const session = {
            userId: user.id,
            lastVisit: moment(new Date()).format("YYYY-MM-DD HH:mm")
          };
          const setSession = await req.db.sessions.create(session);
          if (setSession == null) {
            res.statusCode = 500;
            res.end();
          } else {
            res.statusCode = 201;
            res.json({ sessionId: setSession.key });
            res.end();
          }
        }
      } catch (err) {
        console.error(err);
        res.statusCode = 409;
        res.end();
      }
    }
  });
  app.post("/createAccount", isOperator, async (req, res) => {
    if (!req.body.packageId) {
      res.statusCode = 400;
      res.end();
    } else {
      const user = {
        uuid: req.body.uuid || null,
        pin: req.body.pin || null,
        name: req.body.name || null,
        status: req.body.status || false,
        version: req.body.version || null,
        apkUrl: req.body.apkUrl || null,
        packageId: req.body.packageId,
        operatorId: req.user.id
      };
      try {
        const packageId = req.body.packageId;
        const package = await req.db.packages.findOne({
          where: { operatorId: req.user.id, id: packageId }
        });
        if (package == null) {
          res.statusCode = 403;
          res.end();
        } else {
          const newUser = await req.db.users.create(user);
          await updateUserHistory(req.db.historyPackages, newUser);
          const result = newUser.get("id");
          res.json({ accountId: result });
          res.end();
        }
      } catch (err) {
        console.log(err);
        res.statusCode = 409;
        res.end();
      }
    }
  });

  app.post("/operatorUpdateUser", isOperator, async (req, res) => {
    if (
      (!req.body.name ||
        !req.body.pin ||
        !req.body.packageId ||
        !req.body.uuid ||
        !req.body.version ||
        !req.body.apkUrl ||
        !req.body.id,
      req.body.status == "undefined")
    ) {
      res.statusCode = 400;
      res.end();
    } else {
      if (req.body.operatorId != req.user.key) {
        res.statusCode = 403;
        res.end();
      } else {
        const updateUser = {
          name: req.body.name,
          status: req.body.status,
          uuid: req.body.uuid,
          status: req.body.status,
          id: req.body.id,
          version: req.body.version,
          apkUrl: req.body.apkUrl,
          packageId: req.body.packageId,
          pin: req.body.pin
        };

        await req.db.users.update(updateUser, {
          where: { id: updateUser.id, operatorId: req.user.id }
        });
        await updateUserHistory(req.db.historyPackages, updateUser);
        res.statusCode = 200;
        res.end();
      }
    }
  });
  async function validSessionId(req, res, next) {
    const sessionId =
      req.params.sessionId || req.query.sessionId || req.body.sessionId;
    console.log("we there!!");
    console.log(sessionId);
    if (!sessionId) {
      res.statusCode = 401;
      res.end();
    } else {
      try {
        let session = await req.db.sessions.findOne({
          where: { key: sessionId }
        });
        if (session == null) {
          res.statusCode = 401;
          res.end();
        } else if (
          moment(new Date()).format("YYYY-MM-DD HH:mm") >
          moment(session.lastVisit)
            .add(50, "minutes")
            .format("YYYY-MM-DD HH:mm")
        ) {
          const destroy = await req.db.sessions.destroy({
            where: { id: session.id }
          });
          res.statusCode = 524;
          res.end();
        } else {
          const update = await req.db.sessions.update(
            { lastVisit: moment(new Date()).format("YYYY-MM-DD HH:mm") },
            { where: { key: session.key } }
          );
          const user = await req.db.users.findOne({
            where: { id: session.userId }
          });
          if (user == null) {
            await req.db.sessions.destroy({ where: { id: session.id } });
            res.statusCode = 409;
            res.end();
          } else {
            req.user = user;
            const operator = await req.db.operators.findOne({
              where: { id: user.operatorId }
            });
            if (operator == null) {
              res.statusCode = 409;
              res.json({ err: "User operator not found" });
              res.end();
            } else {
              if (user.status && operator.status) {
                req.userSession = session;
                next();
              } else {
                res.statusCode = 403;
                res.end();
              }
            }
          }
        }
      } catch (err) {}
    }
    //				.catch(err => res.redirect('/logout'));
  }
  function isDashboard(req, res, next) {
    if (
      !req.body.dashboard ||
      req.body.dashboard != "ee5a3fa0-c234-11e8-8f36-ad9f7cf6a93d"
    ) {
      res.statusCode = 403;
      res.end();
    } else {
      next();
    }
  }
  async function isOperator(req, res, next) {
    const operatorKey =
      req.params.operatorId || req.query.operatorId || req.body.operatorId;
    if (!operatorKey) {
      res.statusCode = 403;
      res.end();
    } else {
      try {
        const operator = await req.db.operators.findOne({
          where: { key: operatorKey }
        });
        if (operator == null) {
          res.statusCode = 403;
          res.end();
        } else {
          req.user = operator;
          next();
        }
      } catch (err) {
        console.error(err);
        res.statusCode = 409;
        res.end();
      }
    }
  }
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect("/signin");
  }
};
