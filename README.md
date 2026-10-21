# aosera · Landing page survei kebutuhan usaha

Landing page dua bahasa (`/id`, `/en`) untuk survei kebutuhan pemilik usaha, dengan bahasa desain yang sama seperti [aosera-website](https://aosera-website.vercel.app/id).

## Isi halaman

- Hero, "Kenapa survei ini", survei 4 langkah, kartu kontak geser (WhatsApp, Telegram, Email), footer.
- Tema terang/gelap mengikuti pengaturan perangkat; tombol di navbar bisa menimpanya.
- Teks ada di `lib/dictionary.ts`, pertanyaan survei di `lib/survey.ts`, nomor dan tautan kontak di `lib/site.ts`.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi nilai Google Sheets
npm run dev                  # http://localhost:3000 → /id
```

## Jawaban survei → Google Sheets

Form dikirim ke `POST /api/survey`, divalidasi di server, lalu diteruskan ke Google Apps Script yang menulis baris ke Sheet milik aosera.ai@gmail.com. Panduan pemasangan: [`apps-script/README.md`](apps-script/README.md).

Env yang dibutuhkan (Vercel → Settings → Environment Variables):

| Nama | Isi |
| --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL Web App Apps Script (berakhiran `/exec`) |
| `GOOGLE_SHEETS_SECRET` | Sama dengan properti `SECRET` di Apps Script |

## Deploy

Import repo ini di Vercel (framework Next.js terdeteksi otomatis), isi dua env di atas, lalu deploy.
