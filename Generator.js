'use strict';

/**
 * Module dependencies
 */

const util = require('util');
const fs = require('fs');
const path = require('path');
const DBMigrate = require('db-migrate');
const Sails = require('sails').Sails;
const commands = [
  'up',
  'down',
  'create'
];
const adapters = [
  {driver: 'sqlite3', regex: /sqlite/i},
  {driver: 'mysql', regex: /mysql/i},
  {driver: 'pg', regex: /postgre|pg/i},
  {driver: 'mongodb', regex: /mongo/i},
];


/**
 * sails-generate-migrate
 *
 * Usage:
 * `sails generate migrate`
 *
 * @description Generates a migrate
 * @help See http://links.sailsjs.org/docs/generators
 */

function maybeMakeDir(dir, done){

  fs.stat(dir, (err, stat) =>{

    if( !err && stat)
      return done();

    fs.mkdir(dir, done);
  });
}

/**
 * INVALID_SCOPE_VARIABLE()
 *
 * Helper method to put together a nice error about a missing or invalid
 * scope variable. We should always validate any required scope variables
 * to avoid inadvertently smashing someone's filesystem.
 *
 * @param {String} varname [the name of the missing/invalid scope variable]
 * @param {String} details [optional - additional details to display on the console]
 * @param {String} message [optional - override for the default message]
 * @return {Error}
 * @api private
 */

function INVALID_SCOPE_VARIABLE (varname, details, message) {
  var DEFAULT_MESSAGE =
    'Issue encountered in generator "migrate":\n'+
    'Missing required scope variable: `%s`"\n' +
    'If you are the author of `sails-generate-migrate`, please resolve this '+
    'issue and publish a new patch release.';

  message = (message || DEFAULT_MESSAGE) + (details ? '\n'+details : '');
  message = util.inspect(message, varname);

  return new Error(message);
}

function getMigrateInstance(config){

  if( !config ){
    var migrate = DBMigrate.getInstance(true, {env: 'dev',config:{
      ['dev'] : {}
    }});
    migrate.internals.argv._ = migrate.internals.argv._.slice(3);
    return migrate;
  }

  var connection;
  try{
    connection = config.connections[config.models.connection];
  }catch(e){}

  if( !connection || !connection.adapter){
    sails.log.warn('Connection not supported or missing adapter');
    return done();
  }

  let driver = adapters.filter(adapter => adapter.regex.test(connection.adapter))
    .reduce((o, n) => n.driver || o, false);

  if( !driver ){
    sails.log.warn('adapter %s not supported for sails-hook-migrate', connection.adapter);
    return done();
  }

  var migrate = DBMigrate.getInstance(true, {
    config: {
      [process.env.NODE_ENV]: Object.assign({
        driver: driver,
      }, connection)
    }
  });
  migrate.internals.argv._ = migrate.internals.argv._.slice(3);
  return migrate;
}

var Migrator = {

  /**
   * `before()` is run before executing any of the `targets`
   * defined below.
   *
   * This is where we can validate user input, configure default
   * scope variables, get extra dependencies, and so on.
   *
   * @param  {Object} scope
   * @param  {Function} done    [callback]
   */

  before: function (scope, done) {

    if (!scope.args[0])
      return done( new Error('Please provide a task') );

    //if (!scope.args[1])
      //return done( new Error('Please provide a name for this migrate.') );

    if (!scope.rootPath)
      return done( INVALID_SCOPE_VARIABLE('rootPath') );

    maybeMakeDir(path.join(scope.rootPath, 'migrations'), err =>{

      if( err )
        return done(err);

      // initialize db migrate as module. Environment and connection strings do not matter here
      var migrate = getMigrateInstance();
      let command = scope.args.slice(0, 1)[0].split(':')[0];

      if( command === 'create' )
        return Migrator[command].call(migrate, scope.args, done);

      Sails().lift({
        hooks: {
          grunt: false,
          blueprints: false,
          cors: false,
          csrf: false,
          http: false,
          i18n: false,
          request: false,
          responses: false,
          policies: false,
          routes: false,
          session: false,
          sockets: false,
          views: false,
          pubsub: false
        },
        log: {level: "error"}
      },function (err, _sails) {

        if (err) return done(err);

        var migrate = getMigrateInstance(_sails.config);
        Migrator[command].call(migrate, scope.args, done);

      });

    });

  },

  up: function(argv, done){

    this.up(done);
  },

  down: function(argv, done){

    this.down(done);
  },

  create: function(argv, done){

    let model = argv[1];
    this.create(model, done);
  },

};

module.exports = Migrator;
