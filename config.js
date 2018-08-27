let config = {};

config.host = '0.0.0.0';
config.port = 3000;

config.email = {
  host: '', // email server
  port: 0, // email port
  username: '', // email user
  password: '', // email pass
  from: '"Affidea" <noreplay001@affidea.com>'
}

config.i18n = {
  locales: ['ro', 'hr', 'hu'],
  path: "./resources/locales"
};

config.bookingData = {
  path: './resources/affidea-db.xlsx'
};

module.exports = config;