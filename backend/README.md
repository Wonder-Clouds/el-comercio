# Proyecto Comercio 🗞️🐍

El proyecto _Comercio_ es un sistema de gestión de personas que reciben periódicos para vender en Cusco. El sistema asigna y controla los periódicos asignados a las personas, cuántos devuelven y cuánto deben pagar.

Este proyecto utiliza Django como backend y PostgreSQL como base de datos. Además, el sistema está configurado para funcionar con Podman y Podman Compose.

## Requisitos previos

1. **Podman** y **Podman Compose** instalados en tu máquina.
2. **Python 3.x** y **pip** instalados para la instalación de dependencias.

## Instalación

### Paso 1: Clonar el repositorio

Clona el repositorio del proyecto:

```bash
git clone https://github.com/Wonder-Clouds/el-comercio
cd backend
```

### Paso 2: Crear un archivo `.env`

Crea un archivo .env en la raíz del proyecto y agrega la siguiente configuración para la base de datos PostgreSQL:

```env
# Database Configuration
POSTGRES_USER=custom_user_here
POSTGRES_PASSWORD=password_here
POSTGRES_DB=name_of_bd
ENGINE=django.db.backends.postgresql
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Django 
SECRET_KEY=your_secret_key_here
```

Asegúrate de reemplazar `custom_user_here`, `password_here` y `name_of_bd` con los valores que desees usar para la base de datos PostgreSQL.

### Paso 3: Instalar dependencias

Para instalar las dependencias de Python del proyecto, usa el archivo `requirements.txt`:

```bash
pip install -r requirements.txt
```

### Paso 4: Configurar Podman

Este proyecto incluye un archivo podman-compose.yml que configura un contenedor de PostgreSQL.

```yml
services:
  db:
    image: postgres
    container_name: backend_db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgresql:/var/lib/postgresql/data

volumes:
  postgresql:
```

Este archivo configura un servicio de PostgreSQL que usa las variables de entorno definidas en el archivo `.env`.

### Paso 5: Iniciar el contenedor de Podman

Levanta los contenedores con el siguiente comando:

```bash
podman-compose up -d
```

Esto descargará la imagen de PostgreSQL y configurará un contenedor con la base de datos configurada.

### Paso 6: 

Ahora, puedes crear las migraciones de la base de datos ejecutando el siguiente comando:

```bash
python manage.py makemigrations
```

### Paso 7: Aplicar las migraciones
Aplica las migraciones para configurar la base de datos:

```bash 
python manage.py migrate
```

### Paso 8: Crear un superusuario (opcional)
Si deseas acceder al panel de administración de Django, puedes crear un superusuario con el siguiente comando:

```bash 
python manage.py createsuperuser
```

### Paso 9: Iniciar el servidor de desarrollo
Para iniciar el servidor de desarrollo, usa el siguiente comando:

```bash
python manage.py runserver
```

### Acceso a la aplicación
Una vez que el servidor esté en funcionamiento, puedes acceder a la aplicación a través de http://localhost:8000.

### Notas
Asegúrate de que tu base de datos PostgreSQL esté en funcionamiento y accesible con los valores proporcionados en el archivo `.env`.
Si necesitas detener el servidor de desarrollo, simplemente presiona `Ctrl+C` en la terminal.
### Tecnologías utilizadas
- Django: Framework web de Python.
- PostgreSQL: Base de datos.
