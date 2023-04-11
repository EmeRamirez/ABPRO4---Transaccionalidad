-- Active: 1680180900307@@127.0.0.1@5432@banco
CREATE DATABASE banco;

CREATE TABLE transacciones (
    id_transaccion SERIAL NOT NULL PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL,
    fecha VARCHAR(10) NOT NULL,
    monto FLOAT NOT NULL,
    cuenta_id INT NOT NULL
);

CREATE TABLE cuentas (
    id_cuenta SERIAL NOT NULL PRIMARY KEY,
    saldo FLOAT,
    CONSTRAINT restric_saldo CHECK(saldo >= 0)
);

ALTER TABLE transacciones ADD CONSTRAINT fk_cuentas_transacciones FOREIGN KEY (cuenta_id) REFERENCES cuentas(id_cuenta);

INSERT INTO cuentas (saldo) VALUES (20000);
INSERT INTO cuentas (saldo) VALUES (10000);

