const Records = require("./records.model");

async function batchInsert(batch, counters) {
  if (batch.length === 0) return;
  const operations = batch.map((doc) => ({ insertOne: { document: doc } }));
  try {
    const result = await Records.bulkWrite(operations, { ordered: false });
    counters.total += result.insertedCount || 0;
    if (result.hasWriteErrors && result.getWriteErrors) {
      counters.failedInserts += result.getWriteErrors().length;
    }
  } catch (err) {
    if (err && err.writeErrors) {
      counters.failedInserts += err.writeErrors.length;
      counters.total +=
        err.result && err.result.nInserted ? err.result.nInserted : 0;
    } else {
      throw err;
    }
  }
}

module.exports = {
  batchInsert,
};
