#!/bin/bash

# RTECH E-commerce Installer Script for Ubuntu 24.04
# Author: Antigravity
# Description: Automates the setup of Node.js, PostgreSQL, and the RTECH application.

set -e # Exit immediately if a command exits with a non-zero status.

echo "========================================================="
echo "   Iniciando instalación de RTECH E-commerce Server"
echo "========================================================="

# 1. System Updates
echo "[1/7] Actualizando el sistema..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential

# 2. Install Node.js 20 (LTS)
echo "[2/7] Instalando Node.js 20 (LTS)..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Install PostgreSQL
echo "[3/7] Instalando PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# 4. Configure Database
echo "[4/7] Configurando Base de Datos..."
echo "Te solicitaremos un nombre de usuario y contraseña para la base de datos."
read -p "Ingresa el nombre de usuario para la DB (ej: rtech_user): " DB_USER
read -s -p "Ingresa la contraseña para la DB: " DB_PASS
echo ""
read -p "Ingresa el nombre de la base de datos (ej: rtech_db): " DB_NAME

# Create user and database
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" || echo "El usuario ya podría existir."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" || echo "La base de datos ya podría existir."
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"

# 5. Clone Repository
echo "[5/7] Descargando el proyecto..."
APP_DIR=~/rtech
if [ -d "$APP_DIR" ]; then
    echo "El directorio $APP_DIR ya existe. Actualizando..."
    cd $APP_DIR
    git pull origin main
else
    git clone https://github.com/bferreyr/rtech.git $APP_DIR
    cd $APP_DIR
fi

# 6. Install Dependencies & Configure
echo "[6/7] Instalando dependencias..."
npm install

echo "Configurando variables de entorno (.env)..."
if [ ! -f .env ]; then
    echo "Creando archivo .env básico..."
    cat <<EOT >> .env
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME?schema=public"
AUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://$(curl -s ifconfig.me)"
# Agrega aquí tus otras claves (MERCADOPAGO, CORREO ARGENTINO, etc.)
EOT
    echo "Archivo .env creado. POR FAVOR EDÍTALO con tus credenciales reales de MercadoPago y demás servicios."
    echo "Puedes editarlo con: nano .env"
else
    echo "El archivo .env ya existe. No se modificará."
fi

# Init Prisma
echo "Inicializando base de datos con Prisma..."
npx prisma generate
npx prisma db push

# Build
echo "Construyendo la aplicación..."
npm run build

# 7. Setup PM2
echo "[7/7] Configurando gestor de procesos (PM2)..."
sudo npm install -g pm2

# Check if app is already running
if pm2 list | grep -q "rtech-ecommerce"; then
    pm2 restart rtech-ecommerce
else
    pm2 start npm --name "rtech-ecommerce" -- start
fi

# Startup script
pm2 save
pm2 startup | tail -n 1 > startup_script.sh
chmod +x startup_script.sh
./startup_script.sh
rm startup_script.sh

echo "========================================================="
echo "   ¡Instalación completada con éxito!"
echo "   Tu aplicación debería estar corriendo en el puerto 3000."
echo "   Verifica con: pm2 status"
echo "========================================================="
