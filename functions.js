import {pool} from './db.js';
import Cursor from 'pg-cursor';

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

    let encontrado;
    (async()=>{
        const res = await pool.query('SELECT * FROM cuentas')
            encontrado = res.rows.find(e => e.id_cuenta == cuenta);

            if (encontrado){
                if (encontrado.saldo >= monto){
                    await pool.query("BEGIN")
                        try {
                            const res2 = await pool.query('INSERT INTO transacciones (descripcion,fecha,monto,cuenta_id) VALUES ($1,$2,$3,$4) RETURNING *',[descripcion,fechaActual,monto,cuenta]);  
                            console.log(`Se insertó el siguiente registro:`);
                            console.table(res2.rows)
                            let nvoSaldo = encontrado.saldo - monto
                            const ajusteSaldo = await pool.query('UPDATE cuentas SET saldo = $1 WHERE id_cuenta=$2',[nvoSaldo,cuenta]);
                            console.log(`${descripcion} realizado/a. Su nuevo saldo es: $${nvoSaldo}`); 
                            await pool.query("COMMIT");
                        } catch (error) {
                            console.log('No se pudo concretar la transacción',error);
                            await pool.query("ROLLBACK");
                        }   
                }else{
                    console.log('Saldo insuficiente, se cancela la transacción.');
                }
            } else {
                console.log('La cuenta ingresada no existe');
            }
            pool.release;
            process.exit();
    })();
};


//Funcion para mostrar el saldo de una cuenta por ID
export async function buscarSaldo(id){
    const res = await pool.query('SELECT saldo FROM cuentas WHERE id_cuenta=$1',[id]);
    console.log(`El saldo de su cuenta es de $${res.rows[0].saldo}`);
    pool.release;
};

//Función para mostrar las 10 primeras transacciones de una cuenta en especifico
export async function mostrarRegistros(id){
    const client = await pool.connect()
    const cursor = client.query(new Cursor('SELECT * FROM transacciones WHERE cuenta_id=$1',[id]))
    
    cursor.read(10, (err, rows)=>{
        if(err) throw err;
        else{
            if(rows.length == 0){
                console.log("Cliente sin transacciones")
            }else{
                console.table(rows)
            }
        }
        cursor.close(() => {
            client.release();
            process.exit();
        });
    });
}