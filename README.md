# Widi

## Menyimpan RSVP ke Google Sheets

1. Buat Google Sheet baru. Buka **Ekstensi → Apps Script**, lalu salin isi [`Code.gs`](./Code.gs) ke editor dan simpan. Form hanya meminta nama, pilihan **Hadir/Tidak hadir**, dan ucapan.
2. Di Apps Script, pilih **Deploy → New deployment → Web app**. Atur **Execute as** ke akun Anda dan **Who has access** ke **Anyone**, lalu deploy dan setujui izin yang diminta. Gunakan URL Web App yang berakhiran `/exec`.
3. Tempel URL tersebut ke properti `rsvpApiUrl` di bagian `data()` pada [`index.html`](./index.html), menggantikan string kosong.
4. Buka halaman undangan dan kirim RSVP percobaan. Tab `RSVP` akan dibuat otomatis di spreadsheet.

Spreadsheet tetap hanya dapat dibuka oleh pemilik dan orang yang diberi akses. Namun, karena daftar ucapan dan nama tamu ditampilkan di halaman undangan, data tersebut dapat dilihat pengunjung. URL Web App juga bersifat publik agar tamu dapat mengirim konfirmasi; jangan menaruh token atau kredensial Google di halaman.

## Berbagi Story Instagram

Tombol **Bagikan ke Instagram** memakai menu berbagi perangkat untuk mengirim PNG pada browser yang mendukung Web Share API. Jika tidak didukung, PNG akan diunduh. Setelah memilih Instagram Story, tambahkan stiker Mention untuk `@faishalmhmd` dan `@widisitia20` secara manual; teks mention biasa bukan tag Instagram.
