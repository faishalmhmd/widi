const RSVP_SHEET_NAME = "RSVP";
const RSVP_HEADERS = ["Waktu", "Nama", "Kehadiran", "Ucapan"];

function doGet() {
  try {
    const sheet = getRsvpSheet_();
    const lastRow = sheet.getLastRow();
    const entries = lastRow < 2
      ? []
      : sheet.getRange(2, 1, lastRow - 1, RSVP_HEADERS.length).getValues()
        .filter((row) => row[1])
        .reverse()
        .map((row) => ({
          sentAt: row[0] instanceof Date ? row[0].toISOString() : new Date(row[0]).toISOString(),
          name: String(row[1]),
          attendance: String(row[2]),
          message: String(row[3]),
        }));

    return jsonOutput_({ ok: true, entries });
  } catch (error) {
    console.error(error);
    return jsonOutput_({ ok: false, error: "Gagal memuat data RSVP." });
  }
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents);
    const name = String(payload.name || "").trim();
    const attendance = String(payload.attendance || "").trim();
    const message = String(payload.message || "").trim();

    if (!name || name.length > 100) {
      throw new Error("Nama wajib diisi dan maksimal 100 karakter.");
    }
    if (!message || message.length > 1000) {
      throw new Error("Ucapan wajib diisi dan maksimal 1000 karakter.");
    }
    if (!["Hadir", "Tidak hadir"].includes(attendance)) {
      throw new Error("Pilihan kehadiran tidak valid.");
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getRsvpSheet_().appendRow([
        new Date(),
        safeSheetText_(name),
        attendance,
        safeSheetText_(message),
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonOutput_({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonOutput_({
      ok: false,
      error: error instanceof SyntaxError ? "Data RSVP tidak valid." : error.message,
    });
  }
}

function getRsvpSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(RSVP_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(RSVP_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(RSVP_HEADERS);
  } else {
    const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (header[3] === "Jumlah" && header[4] === "Ucapan") {
      sheet.deleteColumn(4);
    }
    sheet.getRange(1, 1, 1, RSVP_HEADERS.length).setValues([RSVP_HEADERS]);
  }
  return sheet;
}

function safeSheetText_(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function jsonOutput_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
