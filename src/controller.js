const Records = require("./records.model");
const { processFile } = require("./fileProcessor");
const { getPerformanceIndicators } = require("./performance");

/**
 * Orquestador del endpoint de carga masiva.
 * Solo coordina servicios y responde.
 */
const upload = (req, res) => {
  (async () => {
    try {
      const { file } = req;
      if (!file) {
        return res.status(400).json({ message: "No se subió ningún archivo." });
      }
      const filePath = file.path;
      const BATCH_SIZE = 1000;
      const result = await processFile({ filePath, batchSize: BATCH_SIZE });
      const perf = getPerformanceIndicators({
        total: result.total,
        processedCount: result.processedCount,
        elapsed: result.elapsed,
      });
      const response = {
        message: `Archivo procesado correctamente. Registros insertados: ${
          result.total
        }. Tiempo: ${result.elapsed.toFixed(2)} segundos`,
        registros_invalidos: result.invalidCount,
        registros_fallidos: result.failedInserts,
        total_procesados: result.processedCount,
        registros_insertados: result.total,
        ...perf,
      };
      if (result.errorOcurred) {
        response.message = `Error al insertar algunos registros. Tiempo: ${result.elapsed.toFixed(
          2
        )} segundos`;
        return res.status(500).json(response);
      }
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({
        message: "Error inesperado en el servidor.",
        error: err && err.message ? err.message : err,
      });
    }
  })();
};

const list = async (_, res) => {
  try {
    const data = await Records.find({}).limit(10).lean();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  upload,
  list,
};
