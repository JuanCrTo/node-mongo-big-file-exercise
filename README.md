# node-mongo-big-file-exercise

Hola! Este es un ejercicio para poner a prueba tus conocimientos de NodeJS y MongoDB. El objetivo es realizar un endpoint que reciba un archivo de ~80mb separado por comas y guarde cada uno de los registros del archivo en la base de datos.

El archivo podés descargarlo de este link:
https://drive.google.com/file/d/1tg8dWr4RD2CeKjEdlZdTT8kLDzfITv_S/view?usp=sharing
(está zippeado para que lo descargues rápido, descomprimilo manualmente)

Se evaluará teniendo en cuenta la prolijidad del código (indentación, comentarios y legibilidad), la performance (tiempo de procesado y memoria utilizada) y escalabilidad (si soporta archivos aún más grandes).

Para simplificarlo, hemos creado este repo starter que se conecta a la base de datos, crea el modelo y expone el endpoint `[POST] /upload` donde tenés que subir el archivo (podés probarlo con Postman). En el archivo `src/controller.js` tenés que ingresar tu código.

## Consideraciones

- Hace un fork de este repo para comenzar, y cuando tengas la solución compartí tu repositorio con quien te solicitó este ejercicio.
- Recordá correr `npm install` o `yarn install` para instalar las dependencias
- Podés usar hasta 1 librería de tu preferencia además de las incluídas.
- En el endpoint `[GET] /records` podés ver los 10 últimos registros que se procesaron.
- El archivo subido se guarda en el directorio `_temp`, recordá eliminarlo luego de utilizarlo.
- Modificá el archivo `.env` para cambiar el puerto y la conexión a la base de datos.

## Postman
En el directorio `postman` del repo, vas a encontrar los dos requests para que puedas importarlos en Postman.

# Resumen de la Solución:

# 🧠 Node-Mongo CSV Batch Uploader

Este proyecto es una solución a una prueba técnica para procesar un archivo CSV (~80 MB) y guardar cada registro en MongoDB de forma eficiente, validando, limpiando y mostrando métricas de rendimiento.

## 🚀 Tecnologías

- Node.js
- MongoDB
- csv-parser
- Multer

---

## 📌 Endpoints disponibles

### [POST] /upload
Carga un archivo `.csv` usando `form-data` con la key `file`.
Sube el archivo CSV (usando form-data → key: file) y lo procesa.

- ✅ Valida campos requeridos.
- ✅ Inserta en MongoDB en bloques para mayor performance.
- ✅ Mide tiempo y calcula métricas como:
  - Registros por segundo
  - Porcentaje de éxito
  - Tiempo total

#### 🧪 Ejemplo de respuesta exitosa:
```json
{
  "message": "Archivo procesado correctamente. Registros insertados: 78910. Tiempo: 22.31 segundos",
  "registros_invalidos": 123,
  "registros_fallidos": 4,
  "total_procesados": 79037,
  "registros_insertados": 78910,
  "registros_por_segundo": "3543.42",
  "porcentaje_exito": "99.84%"
}
```


### [GET] /records
Devuelve los últimos 10 registros insertados.
```json
[
  {
    "_id": "68547ec57407aba51d789d17",
    "id": 1,
    "firstname": "Nikki",
    "lastname": "Si",
    "email": "Nikki.Si@yopmail.com",
    "email2": "Nikki.Si@gmail.com",
    "profession": "police officer"
  },
  ...
]
```

## ⚙️ Consideraciones técnicas

- ✅ Procesamiento usando `csv-parser`.
- ✅ Inserciones en bloques con `bulkWrite` para mayor rendimiento.
- ✅ Validación de cada registro antes de insertarlo.
- ✅ Eliminación del archivo `.csv` tras procesarlo.
- ✅ Modularización clara por responsabilidad:
  - `fileProcessor.js` → Lectura del archivo.
  - `batchInsertService.js` → Inserciones por lotes.
  - `performance.js` → Cálculo de métricas.
  - `recordUtils.js` → Validación y transformación de registros.
  - `records.model.js` → Definición del modelo Mongoose.


# 🛠 Instalación y ejecución
### Instalar dependencias:
``` json
npm install
```
### Ejecutar la app:
``` json
npm run start
```