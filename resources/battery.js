const Router = require('express').Router
const v4 = require('node-uuid').v4;
const utils =  require('../utilities');
const Battery = require('../models/battery');
const assign = require('object-assign');

const router = Router();

/**
 * GET-requests
 **/

router
  .route('/')
  .get((req, res) => {
    Battery.findById('mainBattery', (err, battery) => {
      if (err) {
        res.send(400).send(err).end();
      }
      else {
        res.status(200).type('json').json(battery).end();
      }
    });
  })
  .post((req, res) => {
    const batteryLife = 30;

    Battery.findById('mainBattery', (err, battery) => {
      if (err) {
        res.send(400).send(err).end();
      }
      else {
        const batteryLife = 30;

        if (battery.batteryPercentage + batteryLife > 100) {
          battery.batteryPercentage = 0;
          battery.amountFullBatteries += 1;
          battery.lastFullBattery = new Date().toISOString();
          battery.wasFull = true;
        } else {
          battery.batteryPercentage += batteryLife;
          battery.wasFull = false;
        }

        battery.save((err) => {
          if (err) {
            res.status(400).send(err).end();
          }
          else {
            res.status(201).json(battery).end();
          }
        });
      }
    });
  });

module.exports = router;
