# Usa una imagen base de Node.js
# Esto ya incluye Node.js y npm
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json al directorio de trabajo
# Esto es importante para que Docker pueda cachear la instalación de dependencias
COPY package*.json ./

# Instala las dependencias de la aplicación
# El flag --production asegura que solo se instalen las dependencias de producción
RUN npm install --production

# Copia el resto del código de la aplicación al directorio de trabajo
COPY . .

# Expone el puerto en el que la aplicación Node.js escuchará
EXPOSE 3000

# Define el comando para ejecutar la aplicación cuando el contenedor se inicie
CMD ["node", "app.js"]
