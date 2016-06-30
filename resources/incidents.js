const Router = require('express').Router
const v4 = require('node-uuid').v4;
const utils =  require('../utilities');
const Incident = require('../models/incident');
const assign = require('object-assign');

const router = Router();

/**
 * GET-requests
 **/

router
  .route('/')
  .get((req, res) => {
    Incident
      .find()
      .sort({'reportedAt': -1})
      .skip(req.query.skip || 0)
      .limit(req.query.limit || 0)
      .populate('category')
      .populate('cleaner')
      .lean()
      .exec((err, data) => {
        if (err) {
          console.log("error");
          res.send(400).send(err).end();
        }
        else {
          const collection = utils.configureCollection(data, req, Incident);

          res.status(200).type('json').json(collection).end();
        }
      }
    );
  })
  .post((req, res) => {
    console.log("hello");
    if (req.get('Content-Type') == 'application/json'
    || req.get('Content-Type') == 'application/x-www-form-urlencoded') {
        const _id = v4();
        const newIncident = new Incident(assign(
          {},
          req.body,
          {
            _id
          }
        ));

        newIncident.save((err) => {
          if (err) {
            res.status(400).send(err).end()
          }
          else {
            Incident.find({ _id })
            .populate('category')
            .populate('cleaner')
            .lean()
            .exec((err, incident) => {
              if (err) {
                res.status(400).send(err).end()
              }
              else {
                res.status(201).json(incident[0]).end();
              }
            });
          }
        });
    }
    else {
      res.status(415).end();
    }
  });

router
  .route('/:id')
  .get((req, res) => {
    if (!req.params.id) {
      res.send(400).send('No id found.').end();
    }

    Incident.findById(req.params.id, (err, data) => {
      if (err) {
        res.send(400).send(err).end();
      }
      else {
        res.status(200).type('json').json(data).end();
      }
    });
  })
  .put((req, res) => {
    if (req.header('Content-Type') == 'application/json') {
      Incident.findById(req.params.id, (err, incident) => {
        if (err) {
          res.status(404).json(err).end();
        }
        else {
          const newIncident = assign(incident, req.body);

          newIncident.save((err) => {
            if (err) {
              res.status(400).send(err).end()
            }
            else {
              Incident.find({ _id: req.params.id })
              .populate('category')
              .populate('cleaner')
              .lean()
              .exec((err, incident) => {
                if (err) {
                  res.status(400).send(err).end()
                }
                else {
                  res.status(201).json(incident[0]).end();
                }
              })
            }
          });
        }
      });
    }
    else {
      res.status(415).end();
    }
  });

module.exports = router;
