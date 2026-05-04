//database connection 

//uses better-sqlite3to connect to sqlite
const Database = require('better-sqlite3');

let database;

try { 
    database = new Database('../database/ecommerce.db');
    console.log('connected successfully');
} catch (error){
    console.error('failed to connect ', error.message);
    process.exit(1);

}

//make this connection available to other files
module.exports = database;






