FROM python:3.12.8-alpine

WORKDIR /app

# Copiar los archivos de requerimientos
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copiar todo el proyecto
COPY . .

# Asegurarse de que los scripts sean ejecutables
RUN chmod +x /app/wait_for_db.sh /app/create_super_user.sh

EXPOSE 8000

# Ejecutar los scripts explícitamente con sh
CMD sh /app/wait_for_db.sh && sh /app/create_super_user.sh && python manage.py runserver 0.0.0.0:8000
