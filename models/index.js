if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize')
    , sequelize = null

  // the application is executed on the local machine ... use mysql
  sequelize = new Sequelize(
    'test_synthesis',
    'postgres',
    '123',
    {
      dialect: 'postgres',
      host: 'localhost',
//      dialectOptions: {
//        prependSearchPath: true
//      },
    }
  );

  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Author:      sequelize.import(__dirname + '/author'),
    Entry:      sequelize.import(__dirname + '/entry'),
    Tag:      sequelize.import(__dirname + '/tag'),
    author:      sequelize.import(__dirname + '/author'),
    entry:      sequelize.import(__dirname + '/entry'),
    tag:      sequelize.import(__dirname + '/tag'),
    // add your other models here
  }

  /*
    Associations can be defined here. E.g. like this:
    global.db.User.hasMany(global.db.SomethingElse)
  */
  global.db.Author.hasMany(global.db.Entry);
  global.db.Entry.belongsTo(global.db.Author);
}

module.exports = global.db

