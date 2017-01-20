module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'app/**/*.js',
          './server-config.js',
          './server.js',
          'public/client/*.js',
          'lib/*.js'
        ],
        dest: './public/dist/built.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      build: {
        src: './public/dist/built.js',
        dest: './public/dist/built.min.js'
      }
    },

    jshint: {
      files: [
        'app/**/*.js',
        './server-config.js',
        './server.js',
        'public/client/*.js',
        'lib/*.js'
      ],
      options: {
        force: false,
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push origin master \n git push azure master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);
    console.log("Yay!!!")
    grunt.task.run([ 'watch', 'test', 'shell' ], grunt.fatal);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
    ]);

  grunt.registerTask('build', [
    'concat:dist',
    'uglify'
    //gets it ready for the deployment
    //we want to run uglify, etc. here
    //minify, etc.
  ]);

  grunt.registerTask('upload', function(n) {

    if(grunt.option('prod')) {
      console.log("we are in prod");
      grunt.task.run(['jshint']);
      grunt.task.run(['shell']);
      // grunt.fatal(['jshint', 'test']);
      // grunt.task.run(['shell']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    //deploy calls build and upload
    'build', 'upload'
  ]);
};