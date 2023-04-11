import express from 'express';
import Cursor from 'pg-cursor';
import {pool} from './db.js'

// pool.query('SELECT * FROM table_name',(err,res)=>{
//     if (err) throw err;
//     console.table(res.rows);
//     pool.end()
// });

pool.connect()