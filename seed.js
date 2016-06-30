'use strict';

const mongoose = require('mongoose')
const uri = require('./utilities').MONGO;

mongoose.connect(uri);

mongoose.connection.on('error', (error) => {
    console.error('Unable to connect with database: ',error);
    throw new Error(error);
});

mongoose.connection.once('open', () => {
  console.log('Dropping database..');

  const collections = [
    {
      data: require('./seeds/cleaners'),
      object: require('./models/cleaner')
    },
    {
      data: require('./seeds/categories'),
      object: require('./models/incidentCategory')
    },
    {
      data: require('./seeds/incidents'),
      object: require('./models/incident')
    },
    {
      data: require('./seeds/battery'),
      object: require('./models/battery')
    }
  ];

  for(let collection of collections) {
    collection.object.remove({}, function (err) {
      console.log('collection removed');
    });
  }

    setTimeout(() => {
      console.log('Database dropped.');

      var objects = 0;
      var objectsDone = 0;

      for(let collection of collections){
        collection.data.forEach(object => {
          objects++;
          (new collection.object(object)).save().then(() => {
              objectsDone++;
          }).catch(error => {console.log(error); objectsDone++;}).then(() => {
              if(objectsDone == objects) mongoose.connection.close();
          });
        });
      }
  }, 3000);
});
