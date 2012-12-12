/*global module:false*/
module.exports = function(grunt) {

  var src_files = [
    'source/intro.js',
    'source/collection.js',
    'source/notifications.js',
    'source/stylesheet.js',
    'source/builder.js',
    'source/panel.js',
    'source/sub_panel.js',
    'source/control.js',
    'source/control_group.js',
    'source/controls.js',
    'source/controls/*.js',
    'source/events.js',
    'source/events/*.js',
    'source/api.js',
    'source/outro.js'
  ];

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.3',
      banner: '/**\n' +
        ' * CoffeeBuilder - v<%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * Copyright (c) 2006-<%= grunt.template.today("yyyy") %>  CoffeeCup Software, Inc. (http://www.coffeecup.com/)\n' +
        ' */'
    },
    lint: {
      files: ['grunt.js','<config:concat.dist.dest>']
    },    
    concat: {
      dist: {
        src: ['<banner:meta.banner>',src_files],
        dest: '/var/www/html/builder/js/jquery.coffeeBuilder.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>','<config:concat.dist.dest>'],
        dest: '/var/www/html/builder/js/jquery.coffeeBuilder.min.js'
      }
    },
    watch: {
      files: ['grunt.js',src_files],
      tasks: 'default'
    },
    jshint: {
      options: {
        boss: true,
        browser: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        expr: true,
        latedef: true,
        laxcomma: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true
      },
      globals: {
        jQuery: true,
        alert: true,
        put: true,
        console: true
      }
    },    
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'concat lint min');
};
