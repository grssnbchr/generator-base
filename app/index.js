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
     type: 'checkbox',
     name: 'features',
     message: 'What more would you like?',
     choices: [{
       name: 'Bootstrap (including respond.js)',
       value: 'includeBootstrap',
       checked: true
     }]
     },
     {
     type: 'confirm',
     name: 'htmlmin',
     message: 'Should HTML be minified, too?',
     default: false
    }];

    this.prompt(prompts, function (props) {
      var features = props.features;

      function hasFeature(feat) { return features.indexOf(feat) !== -1; }

      this.includeBootstrap = hasFeature('includeBootstrap');

      this.htmlminify = props.htmlmin;

      done();
    }.bind(this));
  },

  writeIndex: function() {
    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
    this.indexFile = this.engine(this.indexFile, this);
    // wire Bootstrap plugins, and also wire respond.js
    if (this.includeBootstrap) {
      var bs = 'bower_components/bootstrap/js/';
      var respond = 'bower_components/respond/src/';
      this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
        bs + 'affix.js',
        bs + 'alert.js',
        bs + 'dropdown.js',
        bs + 'tooltip.js',
        bs + 'modal.js',
        bs + 'transition.js',
        bs + 'button.js',
        bs + 'popover.js',
        bs + 'carousel.js',
        bs + 'scrollspy.js',
        bs + 'collapse.js',
        bs + 'tab.js',
	respond + 'respond.js'
      ]);
    }
    // Append main script after plugins.js
    this.indexFile = this.appendFiles({
      html: this.indexFile,
      fileType: 'js',
      optimizedPath: 'scripts/main.js',
      sourceFileList: ['scripts/main.js'],
      searchPath: '{app,.tmp}'
    });
  },

  // Copy the stylesheet template
  mainStylesheet: function () {
    var css = 'main.' /*+ (this.includeCompass ? 's' : '')*/ + 'css';
    this.copy(css, 'app/styles/' + css);
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
    // Copy main.js script template
    this.copy('main.js','app/scripts/main.js');   
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = BaseGenerator;
