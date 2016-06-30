const assign = require('object-assign');
const PORT = process.env.PORT || 3000;
const MONGO = 'mongodb://wenskinkyenjorster:gaanhard@ds023634.mlab.com:23634/koffieskript';
const portString = (process.env.NODE_ENV !== 'production') ? `:${PORT}` : '';

const configureItems = (data, req) => {
  const items = data.map((item) => assign(item, configureLink(item, req)));
  return assign({}, { items });
};


const configureCollection = (data, req, model) => {
  return assign({},
    configureItems(data, req),
    configureCollectionLinks(req)
  );
}

const sortByTime = (data, key) => {
  data.items = data.items.sort((x, y) => y[key] - x[key]);
  return data;
}

const configureCollectionLinks = (req) => {
  const baseLink = `${req.protocol}://${req.hostname}${portString}${req.baseUrl}`;

  return {
    links: [
      {
        rel: 'collection',
        href: baseLink
      }
    ]
  }
}

const getQuery = (req) => {
  const skip = Number.parseInt(req.query.skip) || 0;
  const limit = Number.parseInt(req.query.limit) || 0;
  return { skip, limit };
}

const configureLink = (item, req) => {
  const baseLink = `${req.protocol}://${req.hostname}${portString}${req.baseUrl}`;

  const collectionLink = {
    rel: 'collection',
    href: baseLink
  };

  const selfLink = {
    rel: 'self',
    href: `${baseLink}/${item._id}`
  };

  const links = {
    links: [
      selfLink,
      collectionLink
    ]
  }
  return links;
};

const configureLinks = () => [{
  href: `${req.protocol}://${req.hostname}${portString}${req.baseUrl}`,
  rel: 'self'
}];

module.exports = {
  PORT,
  configureCollection,
  getQuery,
  sortByTime,
  MONGO
};
