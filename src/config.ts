const config = {
  cryptography: {
    saltRounds: process.env.SALT_ROUNDS_BCRYPT
  },
  api: {
    host: process.env.HOST_API ?? 'localhost',
    port: process.env.PORT_API ?? 4000
  },
  mariadb: {
    type: 'mysql',
    productionDatabase: process.env.PRODUCTION_DATABASE_MARIADB ?? 'intranet',
    testDatabase: process.env.TEST_DATABASE_MARIADB ?? 'test',
    host: process.env.HOST_DATABASE_MARIADB ?? 'localhost',
    username: process.env.USER_DATABASE_MARIADB ?? 'root',
    password: process.env.PASSWORD_DATABASE_MARIADB ?? 'mariadb',
    port: process.env.PORT_DATABASE_MARIADB ?? 3306
  },
  oracledb: {
    type: 'oracle',
    productionDatabase: process.env.PRODUCTION_DATABASE_ORACLE ?? 'intranet',
    testDatabase: process.env.TEST_DATABASE_ORACLE ?? 'test',
    host: process.env.HOST_DATABASE_ORACLE ?? 'localhost',
    username: process.env.USER_DATABASE_ORACLE ?? 'sys',
    password: process.env.PASSWORD_DATABASE_ORACLE ?? 'oracledb',
    ssid: process.env.SSID_DATABASE_ORACLE ?? 'xe',
    port: process.env.PORT_DATABASE_ORACLE ?? 3306,
    connectString: process.env.CONNECTION_STRING_DATABASE_ORACLE ?? 'localhost/xe'
  },
  postgres: {
    user: 'postgres',
    host: 'localhost',
    database: 'motion_blade_2',
    password: 'postgres',
    port: 5432 // 5432 3211
  },
  json: {
    secret: process.env.SECRET_JSON ?? 'secret'
  }
}

export default config
