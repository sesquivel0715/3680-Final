//database connection 

const Database = require('better-sqlite3');

const path = require('path');
const dbPath = path.join(__dirname, '../database/ecommerce.db'); 
let database;

try { 
    database = new Database(dbPath);
    //needed for sqlite
    database.pragma('foreign_keys = ON');
    console.log('connected successfully');
} catch (error){
    console.error('failed to connect ', error.message);
    process.exit(1);

}

//make this connection available to other files
module.exports = database;






