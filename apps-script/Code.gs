/**
 * Menerima jawaban survei dari landing page dan menambahkannya sebagai baris baru.
 * Pasang di Google Sheet milik aosera.ai@gmail.com (lihat README.md di folder ini).
 */
var COLUMNS = [
  ["timestamp", "Waktu"],
  ["lang", "Bahasa"],
  ["businessType", "Jenis usaha"],
  ["teamSize", "Jumlah karyawan"],
  ["location", "Lokasi"],
  ["problems", "Masalah terbesar"],
  ["currentTool", "Cara saat ini"],
  ["painLevel", "Tingkat gangguan (1-5)"],
  ["helpfulness", "Seberapa membantu (1-5)"],
  ["budget", "Biaya bulanan wajar"],
  ["story", "Cerita"],
  ["name", "Nama"],
  ["whatsapp", "WhatsApp"],
  ["pilot", "Ikut uji coba"],
];

function doPost(e) {
  var out = function (obj) {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  };

  try {
    var data = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty("SECRET");
    if (!secret || data.secret !== secret) return out({ ok: false, error: "unauthorized" });

    var sheet = getSheet_();
    var row = data.row || {};
    row.timestamp = new Date();
    sheet.appendRow(
      COLUMNS.map(function (c) {
        var v = row[c[0]];
        // Cegah formula injection: teks yang diawali = + - @ dijadikan teks biasa.
        if (typeof v === "string" && /^[=+\-@]/.test(v)) v = "'" + v;
        return v === undefined ? "" : v;
      })
    );
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(function (c) { return c[1]; }));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
  }
  return sheet;
}
