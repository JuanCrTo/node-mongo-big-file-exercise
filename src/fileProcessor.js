// src/fileProcessor.js

const fs = require("fs");
const csv = require("csv-parser");
const { isValidRecord, transformRecord } = require("./recordUtils");
const { batchInsert } = require("./batchInsertService");

/**
 * Procesa un archivo CSV por lotes, validando y transformando cada registro.
 * Llama a batchInsert para insertar en la base de datos.
 * Devuelve métricas y control de errores.
 */
async function processFile({
  filePath,
  batchSize = 1000,
  onProgress = () => {},
}) {
  let batch = [];
  let counters = {
    total: 0,
    failedInserts: 0,
    invalidCount: 0,
    processedCount: 0,
  };
  let errorOcurred = false;
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath).pipe(csv());
    let processing = Promise.resolve();
    let streamEnded = false;

    function finish() {
      fs.unlink(filePath, () => {});
      const elapsed = (Date.now() - startTime) / 1000;
      resolve({
        total: counters.total,
        failedInserts: counters.failedInserts,
        invalidCount: counters.invalidCount,
        processedCount: counters.processedCount,
        elapsed,
        errorOcurred,
      });
    }

    stream.on("data", (row) => {
      counters.processedCount++;
      if (isValidRecord(row)) {
        batch.push(transformRecord(row));
      } else {
        counters.invalidCount++;
      }
      if (batch.length >= batchSize) {
        stream.pause();
        processing = processing
          .then(() => batchInsert(batch, counters))
          .then(() => {
            batch = [];
            stream.resume();
            onProgress({ processedCount: counters.processedCount });
            if (streamEnded) finish();
          })
          .catch((err) => {
            errorOcurred = true;
            finish();
          });
      }
    });

    stream.on("end", () => {
      streamEnded = true;
      processing
        .then(() => batchInsert(batch, counters))
        .then(() => finish())
        .catch((err) => {
          errorOcurred = true;
          finish();
        });
    });

    stream.on("error", (err) => {
      errorOcurred = true;
      finish();
    });
  });
}

module.exports = {
  processFile,
};
