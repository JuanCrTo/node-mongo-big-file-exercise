function getPerformanceIndicators({ total, processedCount, elapsed }) {
  const registrosPorSegundo =
    elapsed > 0 ? (processedCount / elapsed).toFixed(2) : processedCount;
  const porcentajeExito =
    processedCount > 0 ? ((total / processedCount) * 100).toFixed(2) : 0;
  return {
    registros_por_segundo: registrosPorSegundo,
    porcentaje_exito: porcentajeExito + "%",
  };
}

module.exports = {
  getPerformanceIndicators,
};
