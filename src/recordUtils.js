function isValidEmail(email) {
  return typeof email === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function isValidRecord(row) {
  // Validar que existan todas las columnas requeridas
  const requiredFields = ["id", "firstname", "lastname", "email", "profession"];
  for (const field of requiredFields) {
    if (!(field in row)) return false;
  }
  return (
    row.id &&
    !isNaN(Number(row.id)) &&
    row.firstname &&
    typeof row.firstname === "string" &&
    row.firstname.trim() !== "" &&
    row.lastname &&
    typeof row.lastname === "string" &&
    row.lastname.trim() !== "" &&
    row.email &&
    isValidEmail(row.email) &&
    row.profession &&
    typeof row.profession === "string" &&
    row.profession.trim() !== ""
  );
}

function transformRecord(row) {
  return {
    id: isNaN(Number(row.id)) ? null : Number(row.id),
    firstname:
      typeof row.firstname === "string" && row.firstname.trim() !== ""
        ? row.firstname.trim()
        : null,
    lastname:
      typeof row.lastname === "string" && row.lastname.trim() !== ""
        ? row.lastname.trim()
        : null,
    email:
      typeof row.email === "string" && row.email.trim() !== ""
        ? row.email.trim()
        : null,
    email2:
      typeof row.email2 === "string" && row.email2.trim() !== ""
        ? row.email2.trim()
        : null,
    profession:
      typeof row.profession === "string" && row.profession.trim() !== ""
        ? row.profession.trim()
        : null,
  };
}

module.exports = {
  isValidEmail,
  isValidRecord,
  transformRecord,
};
