# Guía de Instalación RTECH

Esta carpeta contiene scripts para facilitar el despliegue de la aplicación en un servidor Ubuntu 24.04.

## Prerrequisitos
- Un servidor con Ubuntu 24.04 limpio.
- Acceso SSH al servidor.

## Instrucciones

1. **Subir el script al servidor**:
   Si tienes este proyecto en tu repositorio, puedes clonar solo este archivo o copiar su contenido.
   
   Opción rápida (copiar y pegar):
   En tu servidor, crea el archivo:
   ```bash
   nano install.sh
   # Pega el contenido de install.sh aquí, guarda (Ctrl+O) y sal (Ctrl+X)
   ```

2. **Ejecutar el instalador**:
   Dale permisos de ejecución y correlo:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. **Durante la instalación**:
   - El script te pedirá un usuario y contraseña para crear la base de datos PostgreSQL.
   - Creará automáticamente un archivo `.env` con la conexión a la base de datos.

4. **Post-Instalación**:
   - Es **CRÍTICO** que edites el archivo `.env` generado para agregar tus claves de API (MercadoPago, Cloudinary, etc.):
     ```bash
     cd ~/rtech
     nano .env
     ```
   - Reinicia la aplicación si cambias el .env:
     ```bash
     pm2 restart rtech-ecommerce
     ```

## Comandos Útiles

- Ver logs: `pm2 logs rtech-ecommerce`
- Detener servidor: `pm2 stop rtech-ecommerce`
- Reiniciar servidor: `pm2 restart rtech-ecommerce`
