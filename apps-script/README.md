# Menyambungkan survei ke Google Sheets

Jawaban survei dikirim oleh server landing page ke sebuah Google Apps Script, lalu ditulis ke Google Sheet milik **aosera.ai@gmail.com**. Langkah ini dilakukan sekali saja, sekitar 5 menit.

1. Masuk ke Google dengan akun **aosera.ai@gmail.com**, lalu buka Sheet [Survei Kebutuhan Usaha - Jawaban](https://docs.google.com/spreadsheets/d/1h8AR6LE0nUds_YH_oW1IoFZpoFHVV-im-g_QhJMNYzs/edit) (sudah dibuat, baris judul kolom sudah ada).
2. Di Sheet tersebut buka **Ekstensi → Apps Script**.
3. Hapus isi `Code.gs` bawaan, lalu tempel seluruh isi file [`Code.gs`](./Code.gs) dari folder ini. Simpan.
4. Buka **Setelan proyek** (ikon roda gigi) → **Properti skrip** → **Tambahkan properti**:
   - Nama: `SECRET`
   - Nilai: kata sandi acak yang panjang, misalnya hasil dari generator password. Simpan nilainya untuk langkah 6.
5. Klik **Terapkan → Deployment baru** → pilih jenis **Aplikasi web**:
   - Jalankan sebagai: **Saya (aosera.ai@gmail.com)**
   - Yang memiliki akses: **Siapa saja**
   - Klik **Terapkan**, izinkan akses, lalu salin **URL aplikasi web** (berakhiran `/exec`).
6. Di Vercel, buka proyek landing page → **Settings → Environment Variables**, lalu tambahkan:
   - `GOOGLE_SHEETS_WEBHOOK_URL` = URL dari langkah 5
   - `GOOGLE_SHEETS_SECRET` = nilai `SECRET` dari langkah 4
7. Redeploy proyek di Vercel. Isi survei sekali sebagai uji coba; baris baru akan muncul di tab pertama Sheet.

Jika `Code.gs` diubah nanti, pilih **Terapkan → Kelola deployment → Edit → Versi baru** agar URL tetap sama.

Untuk menjalankan secara lokal, salin `.env.example` menjadi `.env.local` dan isi kedua nilai yang sama.
