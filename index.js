import express from 'express';
import Cursor from 'pg-cursor';
import { pool } from './db.js';

import { nvaTransaccion } from './functions.js';


// const accion = process.argv[2];

// switch (accion){
//     case 'transaccion':
//     nvaTransaccion();
//     break;
// }


// pool.query('SELECT * FROM table_name',(err,res)=>{
//     if (err) throw err;
//     console.table(res.rows);
//     pool.end()
// });


let preguntas =["Ingresa el número de tu cuenta \n", "Indica tipo de transacción\n 1: Giro \n 2:Transferencia \n 3: Pago \n","Ingresa el monto \n"];
export let respuestas =[];

function preguntar(indice){
    process.stdout.write(preguntas[indice])
}

process.stdin.on('data', async(data)=>{
    respuestas.push(data.toString().trim()) 
    if(respuestas.length < preguntas.length){
        preguntar(respuestas.length);
    }else{
        // process.stdout.write(respuestas.toString())
        await nvaTransaccion(respuestas)     
    }
  
})


preguntar(0);