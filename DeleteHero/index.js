var MongoClient = require('mongodb').MongoClient;

module.exports = function(context, req) {
  MongoClient.connect(process.env.CosmosDBConnectionString,{ useNewUrlParser: true }, (err, client) => {
    let send = response(client, context);

    if (err) send(500, err.message);

    let db = client.db('admin');

    let heroId = parseInt(req.body.id);

    db.collection('heros').deleteOne({ id: heroId }, (err, result) => {
      if (err) send(500, err.message);

      send(200, 'Deleted id : '+heroId);
    });
  });
};

function response(client, context) {
  return function(status, body) {
    context.res = {
      status: status,
      body: body
    };

    client.close();
    context.done();
  };
}
