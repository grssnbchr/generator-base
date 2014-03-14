'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var BaseGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the base generator drafted by Timo Grossenbacher.'));

    var prompts = [{
     // type: 'confirm',
     // name: 'someOption',
     // message: 'Would you like to enable this option?',
     // default: true
    }];

    //this.prompt(prompts, function (props) {
    //  this.someOption = props.someOption;

    //  done();
    //}.bind(this));
    done();
  },

  writeIndex: function() {
    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
    this.indexFile = this.engine(this.indexFile, this);
  },

  app: function () {
    this.mkdir('app');
    this.mkdir('app/templates');
    this.mkdir('app/scripts');
    this.mkdir('app/styles');
    this.mkdir('app/images');
    this.write('app/index.html', this.indexFile);

    // Copy necessary description files
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('bowerrc', '.bowerrc');
    this.template('Gruntfile.js');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = BaseGenerator;
