import {pool} from './db.js';

//Funcion para crear una nueva transacción
export async function nvaTransaccion(args){
    const fecha = new Date()
    const day = fecha.getDate();
    const month = 0+`${fecha.getMonth()+1}`;
    const year = fecha.getFullYear();
    const fechaActual= `${day}/${month}/${year}`

    let monto = parseInt(args[2]);
    const cuenta = parseInt(args[0]);
    let descripcion;
    switch(args[1]){
        case '1':
            descripcion = 'Giro';
            break;
        case '2':
            descripcion = 'Transferencia';
            break;
        case '3':
            descripcion = 'Pago';
            break;
    };

    pool.query('SELECT * FROM cuentas',(err,res)=>{
        if (err) throw err;
       
        let encontrado = res.rows.find(e => e.id_cuenta == cuenta);

        if (encontrado){
            if (encontrado.saldo >= monto){
                console.log('entró a la validacion');
                pool.query('INSERT INTO transacciones (descripcion,fecha,monto,cuenta_id) VALUES ($1,$2,$3,$4) RETURNING *',[descripcion,fechaActual,monto,cuenta],(err,res)=>{
                    if (err) throw err;
                    
                    console.log(res.rows);
                    
                });
            }else{
                console.log('Saldo insuficiente, se cancela la transacción.');
            }
        } else {
            console.log('La cuenta ingresada no existe');
        }
        pool.release;
        process.exit();
    })




 


};