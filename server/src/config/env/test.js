
module.exports = {
  port: 3001,
  app: {
    title: 'Trumap - Test Environment',
    url: ''
  },
  roles: ['admin','manager','user'],
  db: {
    options: {
      dialect: 'postgres',
      logging: process.env.DB_LOGGING === 'true' ? console.log : false,
      host: process.env.DB_HOST || '178.128.94.47',
      port: process.env.DB_PORT || '5432',
      database: process.env.DB_DATABASE || 'truexpert_dev',
      username: process.env.DB_USERNAME || 'galvinw',
      password: process.env.DB_PASSWORD || 'Westwood0'
    },
    sync: {
      force: process.env.DB_FORCE === 'true' ? true : false
    }
  },
  truexpert: {
    search: {
      secret: 'jueCiI29at',
      apiUrl: 'https://staging2.truuue.com/api/v1/zuulin/listings/search'
    }
  },
  analytics: {
    chat: {
      apiUrl: 'http://localhost:5000/chat/messages'
    }
  },
  seed: {
    data: {
      user: {
        username: process.env.DB_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.DB_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      admin: {
        username: process.env.DB_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.DB_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    },
    init: process.env.DB_SEED === 'true' ? true : false,
    logging: process.env.DB_SEED_LOGGING === 'false' ? false : true
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      //stream: {
      //  directoryPath: process.cwd(),
      //  fileName: 'access.log',
      //  rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
      //    active: false, // activate to use rotating logs
      //    fileName: 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
      //    frequency: 'daily',
      //    verbose: false
      //  }
      //}
    }
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      pool: true,
      debug: true,
      host: process.env.MAILER_SERVICE_PROVIDER || 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_FROM',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  }
};
