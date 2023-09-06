import DatabaseHelper from './helper/DatabaseHelper'
import MariadbDataSource from './data/MariadbDataSource'

const databaseHelper = new DatabaseHelper()
const mariadb = new MariadbDataSource(databaseHelper)

void mariadb.bootstrap()
