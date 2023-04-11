import dotenv from 'dotenv';
import pg from 'pg';

const {Pool} = pg;

dotenv.config();

export const pool = new Pool({
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    host: process.env.HOST_DB,
    port: process.env.PORT_DB,
    database: process.env.DATABASE_NAME
});


// pool.query('SELECT * FROM usuarios',(err,res)=>{
//     if (err) throw err;
//     console.table(res.rows);
//     pool.end()
// })