#!/bin/sh

# Espera a que la base de datos esté disponible
until nc -z -v -w30 db 8000
do
  echo "Esperando a que el backend este disponible..."
  sleep 1
done

echo "El backend esta listo. Ejecutando la conexion..."
