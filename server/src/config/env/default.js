
module.exports = {
  app: {
    title: 'trumap',
    description: '',
    keywords: '',
    url: ''
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  sessionSecret: 'trumap',
  sessionCollection: 'sessions',
  sessionKey: 'connect.sid',
  token: {
    secret: 'trumap123#',
    session: {
      session: false
    },
    // token expiration set to 5 days in milliseconds
    rememberMeExpires: 5 * 24 * (60 * 60 * 1000),//default expiration set to 24 hours
    defaultExpires: 24 * (60 * 60 * 1000)
  },
  favicon: 'src/public/favicon.ico',
  sessionCookie: {
     // session expiration is set by default to 1 year
     maxAge: 365 * 24 * (60 * 60 * 1000),
     // httpOnly flag makes sure the cookie is only accessed
     // through the HTTP protocol and not JS/browser
     httpOnly: true,
     // secure cookie should be turned to true to provide additional
     // layer of security so that the cookie is set only when working
     // in HTTPS mode.
     secure: false
 },
};
