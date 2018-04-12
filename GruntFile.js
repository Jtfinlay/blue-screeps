module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            default: {
                tsconfig: './tsconfig.json',
                flatten: true,
                expand: true
            }
        },
        screeps: {
            options: {
                email: process.env.SCREEPS_EMAIL,
                password: process.env.SCREEPS_PASSWORD,
                branch: 'default',
                ptr: false
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-ts');
    
    grunt.registerTask("default", ["ts"]);
}