//connection of database
import mysql from "mysql2/promise";

import 'dotenv/config';

const connection = mysql.createPool({
  host: process.env.HOSTNAME,
  user: process.env.DATABASE_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

export default connection;
