/*global module:false*/
module.exports = function(grunt) {

  var src_files = [
    'src/intro.js',
    'src/util.js',
    'src/collection.js',
    'src/notifications.js',
    'src/stylesheet.js',
    'src/builder.js',
    'src/breakpoint.js',
    'src/panel.js',
    'src/sub_panel.js',
    'src/control.js',
    'src/control_group.js',
    'src/controls.js',
    'src/controls/*.js',
    'src/events.js',
    'src/events/*.js',
    'src/api.js',
    'src/outro.js'
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
