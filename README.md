# Portofolio Web Elegan - Muhammad Luthfi 'Aziiz Musyafa'

Portofolio web modern, sederhana namun berkelas dengan skema warna utama **Putih & Hitam** (monokrom elegan). Dibuat menggunakan **Native Web Technology** murni (HTML5, CSS3, dan JavaScript Vanilla ES6+) tanpa ketergantungan library berat, terinspirasi oleh estetika profil GitHub.

![Screenshot Portofolio](assets/images/profile.jpg)

## ✨ Fitur & Keunggulan

1. **Desain Monokrom Elegan:**
   - Paduan warna utama putih bersih dengan kontras aksen hitam dan abu-abu arang modern.
   - Dilengkapi **Theme Switcher** (Mode Terang & Mode Gelap ala GitHub) yang otomatis tersimpan di `localStorage`.
2. **Hero Section Profil:**
   - Card di tengah bergaya modern dev profile.
   - Foto profil bulat dengan indikator status aktif (pulse beacon).
   - Nama lengkap & tagar `@aziizmusyafa18`.
   - **2 Tombol Aksi Utama**:
     - **Follow Me**: Terhubung langsung ke dokumentasi GitHub (`https://github.com/aziizmusyafa18`).
     - **Hubungi Saya**: Smooth scroll langsung ke formulir pesan/chat di bagian paling bawah.
   - Quick stats metrik repositori publik.
3. **Section Tentang Saya (About Me):**
   - Tampilan kotak preview markdown `README.md` khas GitHub.
   - Uraian dedikasi, prinsip kerja, serta kartu profil samping.
4. **Section Tech Stack & Tools:**
   - Dikelompokkan ke dalam kategori: *Frontend Development*, *Backend & Logika Server*, serta *Database & Tools*.
   - Dilengkapi *color code dots* resmi bahasa pemrograman (JavaScript, PHP, Laravel, HTML, CSS, MySQL, Express, dll).
5. **Section Semua Proyek (Showcase):**
   - Kartu proyek dengan mockup window ala browser.
   - Filter dinamis (*Semua Proyek*, *Web Application*, *Native Web*, *Laravel & PHP*).
   - Proyek unggulan (*Highlight Project*): **Romansa**, **Khodrat Manajemen Keuangan**, **Restaurant Management System**, **Chatbot Gemini**, **Sistem Peminjaman Laptop**, **Judol Simulation**, dll.
   - Desain kartu yang sangat mudah dicustom dan diduplikasi.
6. **Section Hubungi Saya (Chat-Style Form):**
   - Desain jendela chat interaktif dengan balon sapaan langsung.
   - Formulir pesan langsung terhubung ke email (`mailto`) dan tombol instan kirim via **WhatsApp Web / Mobile**.
7. **Animasi On-Scroll Ringan & Interaktif:**
   - Transisi *fade-up* halus menggunakan `IntersectionObserver` native tanpa library eksternal (AOS / GSAP).
   - Scroll progress bar di bagian paling atas.
   - Navigasi Scrollspy aktif otomatis mengikuti posisi layar.
   - Tombol mengambang *Back to Top*.

---

## 📁 Struktur Berkas

```
porto-v3/
├── index.html              # Struktur utama dokumen HTML5
├── css/
│   └── style.css           # Styling lengkap, variabel warna, responsive & animasi
├── js/
│   └── main.js             # Logika tema, filter proyek, scroll reveal & form WhatsApp
├── assets/
│   └── images/
│       └── profile.jpg     # Foto profil lokal (dengan fallback online)
└── README.md               # Dokumentasi portofolio
```

---

## 🛠️ Cara Menjalankan Secara Lokal

Karena proyek ini 100% menggunakan native web language, Anda tidak memerlukan instalasi Node.js atau compiler apa pun:

1. **Buka Langsung di Browser:**
   - Cukup klik dua kali berkas `index.html`, atau drag-and-drop ke browser favorit Anda (Google Chrome, Edge, Firefox, Brave).
2. **Menggunakan Live Server (VS Code / Editor):**
   - Jika menggunakan VS Code, pasang ekstensi `Live Server`.
   - Klik kanan pada `index.html` dan pilih **Open with Live Server**.

---

## ✏️ Panduan Kustomisasi Proyek Sendiri

Untuk menambah atau mengubah daftar proyek di `index.html`, temukan baris komentar `<!-- ========================================== PROYEK ...` pada section `#projects`.

Cukup salin dan sesuaikan template elemen `<article>` berikut:

```html
<article class="project-card reveal-on-scroll" data-category="web-app native">
  <div class="project-card-top">
    <div class="project-type-badge normal">Kategori Proyek</div>
    <a href="LINK_GITHUB_ANDA" target="_blank" rel="noopener noreferrer" class="project-ext-link">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
    </a>
  </div>

  <div class="project-mockup minimal">
    <div class="mockup-screen">
      <div class="mockup-bar">
        <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
        <span class="mockup-title-text">nama-proyek.domain</span>
      </div>
      <div class="mockup-preview-content">
        <div class="mockup-card-stat">
          <span class="stat-badge-mock">Highlight Fitur</span>
          <span class="stat-val-mock">Deskripsi Singkat Fitur</span>
        </div>
      </div>
    </div>
  </div>

  <div class="project-body">
    <h3 class="project-title">
      <a href="LINK_GITHUB_ANDA" target="_blank" rel="noopener noreferrer">Nama Proyek Anda</a>
    </h3>
    <p class="project-desc">
      Penjelasan fungsi dan tujuan dari aplikasi yang Anda buat.
    </p>
    <div class="project-tags">
      <span class="tag">HTML5</span>
      <span class="tag">JavaScript</span>
    </div>
  </div>

  <div class="project-footer">
    <div class="repo-meta">
      <span class="lang-dot" style="background-color: #f1e05a;"></span>
      <span class="lang-name">JavaScript</span>
    </div>
    <div class="project-links">
      <a href="LINK_GITHUB_ANDA" target="_blank" rel="noopener noreferrer" class="link-btn">
        <span>Source Code</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </div>
</article>
```

---

## 🚀 Publikasi (Hosting)

Proyek ini sangat ringan dan siap di-deploy langsung ke:
- **GitHub Pages:**
  1. Buat repository baru di GitHub atau gunakan repository `porto-v3`.
  2. Buka menu **Settings** > **Pages**.
  3. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
- **Vercel / Netlify:**
  - Cukup sambungkan repository GitHub Anda, Vercel/Netlify akan otomatis mendeteksi berkas `index.html` statis dalam hitungan detik.

---

### Profil Pengembang
- **Nama:** Muhammad Luthfi 'Aziiz Musyafa'
- **GitHub:** [https://github.com/aziizmusyafa18](https://github.com/aziizmusyafa18)
- **Instagram:** [@aziizzz18](https://instagram.com/aziizzz18)
- **Lokasi:** Kediri, Jawa Timur, Indonesia
