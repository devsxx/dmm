module.exports = function(grunt) {
	'use strict';
	grunt.initConfig({
		// jshint: {
		// 	options: {
		// 		jshintrc: 'js/.jshintrc'
		// 	},
		// 	src: ['Gruntfile.js', 'js/module/**/*.js']
		// },
		requirejs: {
			iphone: {
				options: {
					baseUrl: "./",
                    name: "app",
                    out: "./app/build/js/app.iphone.js",
					paths: {
						app: "./app/setting/app.iphone",
					},
					optimize: "none",
					mainConfigFile: "./app/setting/app.iphone.js",
				}
			},
			ipad: {
				options: {
					baseUrl: "./",
                    name: "app",
                    out: "./app/build/js/app.ipad.js",
					paths: {
						app: "./app/setting/app.ipad",
					},
					optimize: "none",
					mainConfigFile: "./app/setting/app.ipad.js",
				}
			},
			android: {
				options: {
					baseUrl: "./",
                    name: "app",
                    out: "./app/build/js/app.android.js",
					paths: {
						app: "./app/setting/app.android",
					},
					optimize: "none",
					mainConfigFile: "./app/setting/app.android.js",
				}
			},
        },
        less: {
            iphone: {
                options: {
                    paths: ["./app/theme"]
                },
                files: {
                    "./app/build/css/iphone.css": "./app/theme/iphone/style.less",
                }
            },
            ipad: {
                options: {
                    paths: ["./app/theme"]
                },
                files: {
                    "./app/build/css/ipad.css": "./app/theme/ipad/style.less",
                }
            },
            android: {
                options: {
                    paths: ["./app/theme"]
                },
                files: {
                    "./app/build/css/android.css": "./app/theme/android/style.less",
                }
            }
        }
	});

	// grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	
	// grunt.registerTask('build', ['jshint', 'requirejs']);
	grunt.registerTask('iphone', ['requirejs:iphone', 'less:iphone']);
	grunt.registerTask('ipad', ['requirejs:ipad', 'less:ipad']);
	grunt.registerTask('android', ['requirejs:android', 'less:android']);
	grunt.registerTask('build', ['requirejs', 'less']);
	// grunt.registerTask('default', ['jshint']);
};
