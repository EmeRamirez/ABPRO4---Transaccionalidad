import express from 'express';
import Cursor from 'pg-cursor';
import { pool } from './db.js';

import { nvaTransaccion, buscarSaldo, mostrarRegistros } from './functions.js';

const accion = process.argv[2];
const argumentos = process.argv.slice(3);

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
        await nvaTransaccion(respuestas)     
    }
  
})

switch (accion){
    case 'transaccion':
        preguntar(0);
        break;
    case 'saldo':
        buscarSaldo(argumentos[0]);
        break;
    case 'registros':
        mostrarRegistros(argumentos[0]);
        break;
    default:
        process.exit();
        break;
}
