module.exports = {
  server: {
    gruntConfig: ['gruntfile.js'],
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'src/config/**/*.js', 'src/app/**/*.js'],
    models: 'src/app/**/models/**/*.js',
    routes: ['src/app/!(core)/routes/**/*.js', 'src/app/core/routes/**/*.js'],
    sockets: 'src/app/**/sockets/**/*.js',
    config: ['src/app/**/config/*.js'],
    policies: 'src/app/**/policies/*.js',
    views: ['src/app/**/views/*.html']
  }
};
