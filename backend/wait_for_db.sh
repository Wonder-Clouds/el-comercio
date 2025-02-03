#!/bin/sh

# Espera a que la base de datos esté disponible
until nc -z -v -w30 db 5432
do
  echo "Esperando a que la base de datos esté disponible..."
  sleep 1
done

echo "Base de datos lista. Ejecutando migraciones..."

# Ejecutar makemigrations solo para las aplicaciones específicas que se indican
python manage.py makemigrations assignment detail_assignment devolution product seller --noinput

# Ejecutar migrate para aplicar las migraciones pendientes de las aplicaciones especificadas
python manage.py migrate --noinput
