/**
 * ==========================================================================
 * AI PROJECT ENGINE & GITHUB AUTO-SYNC
 * Portofolio - Muhammad Luthfi 'Aziiz Musyafa'
 *
 * Mengintegrasikan portofolio langsung ke akun GitHub @aziizmusyafa18:
 * 1. Otomatis sinkronisasi saat Anda push proyek/repositori baru ke GitHub.
 * 2. Jika repo memiliki berkas .md (README.md), AI otomatis merangkumnya.
 *    (Otomatis menyaring & mengabaikan boilerplate default framework seperti Laravel/Vite).
 * 3. Jika repo TIDAK memiliki berkas .md atau hanya berisi boilerplate framework,
 *    AI langsung mereview struktur kode, komposisi bahasa, dan file arsitektur
 *    untuk menyusun deskripsi teknis otomatis.
 * ==========================================================================
 */

(function () {
  'use strict';

  const GITHUB_USERNAME = 'aziizmusyafa18';

  // Knowledge Base Resmi untuk 15 proyek karya utama
  const AI_README_KNOWLEDGE_BASE = {
    'aziizmusyafa18/Romansa': {
      title: 'Romansa - Sistem Administrasi Anggota',
      description: 'Sistem administrasi dan tata kelola data anggota organisasi berbasis Laravel dan Vue.js, dilengkapi dashboard interaktif, validasi data real-time, serta manajemen hak akses pengguna yang aman dan terstruktur.'
    },
    'aziizmusyafa18/khodrat-manajemen-keuangan': {
      title: 'Khodrat Bendahara - Sistem Transparansi Kas',
      description: 'Platform transparansi kas dan pembukuan organisasi berbasis Native Web dan Google Apps Script, menghadirkan pencatatan iuran kas bulanan terpadu, visualisasi arus kas via Chart.js, serta pencetakan laporan otomatis tanpa server database terpisah.'
    },
    'aziizmusyafa18/restaurant-management-system': {
      title: 'RODHENA - Sistem Manajemen Restoran',
      description: 'Sistem operasional restoran terpadu berbasis Laravel 11 dan MySQL, mengintegrasikan alur pemesanan mandiri customer via QR meja, modul kasir dengan kalkulasi struk printer termal otomatis, serta dashboard analitik penjualan multi-role.'
    },
    'aziizmusyafa18/chatbot-with-gemini': {
      title: 'AI Chatbot Assistant with Google Gemini',
      description: 'Aplikasi asisten percakapan cerdas yang mengintegrasikan Google Gemini Generative AI, dirancang dengan antarmuka chat responsif, pemrosesan prompt kontekstual cepat, serta manajemen riwayat percakapan yang adaptif.'
    },
    'aziizmusyafa18/sistem-peminjaman': {
      title: 'Sistem Peminjaman Laptop Terpadu',
      description: 'Aplikasi manajemen inventaris dan sirkulasi peminjaman perangkat berbasis Node.js dan Express.js, menyediakan pelacakan ketersediaan unit secara akurat, pencatatan durasi peminjaman, serta proteksi RESTful API dengan konfigurasi CORS yang aman.'
    },
    'aziizmusyafa18/judol-simulation': {
      title: 'Full-Stack Judol System & RMS Telemetry Simulation',
      description: 'Simulasi arsitektur telemetri berbasis web untuk riset edukasi rekayasa perangkat lunak, mendemonstrasikan integrasi Frontend Game Engine 5x3 dengan Backend Risk Management System (RMS), throttling RTP dinamis, dan analisis manipulasi kognitif bandar.'
    },
    'aziizmusyafa18/wedding-netflix': {
      title: 'Wedding Invitation Gaya Netflix',
      description: 'Platform undangan pernikahan digital kreatif bertema antarmuka streaming Netflix, dilengkapi efek splash screen sinematik, sistem personalisasi nama tamu dinamis via URL parameter (?to=), serta integrasi formulir RSVP langsung ke Google Sheets.'
    },
    'aziizmusyafa18/portofolio-v2': {
      title: 'Portofolio Web Developer v2',
      description: 'Website showcase portofolio personal generasi kedua dengan konsep tata letak minimalis, penekanan pada performa muat tinggi, tipografi modern, serta navigasi mulus yang menampilkan riwayat karya rekayasa web.'
    },
    'aziizmusyafa18/zana-wedding': {
      title: 'Zana Wedding Invitation',
      description: 'Undangan digital bertema monokrom modern yang menyajikan tata letak foto galeri sinematik, panduan rute acara Google Maps, dan buku tamu ucapan selamat dengan performa ringan di semua perangkat seluler.'
    },
    'aziizmusyafa18/dwifany-wedding': {
      title: 'Dwifany & Pasangan - Digital Invitation',
      description: 'Undangan pernikahan digital interaktif dengan estetika visual elegan, menyajikan hitung mundur acara personal, pemutar musik latar lembut, peta penunjuk rute terintegrasi, dan konfirmasi kehadiran (RSVP) responsif.'
    },
    'aziizmusyafa18/hafidintan-wedding': {
      title: 'Hafid & Intan Wedding Invitation',
      description: 'Website undangan digital bernuansa romantis dan elegan, menghadirkan integrasi countdown timer akurat, galeri memori foto interaktif, serta fitur RSVP instan bagi kerabat dan sahabat.'
    },
    'aziizmusyafa18/absen-digital': {
      title: 'ADINDA - Absensi Digital & Dokumentasi Agenda',
      description: 'Platform tata kelola presensi akademik terintegrasi (ADINDA) berbasis Node.js dan Socket.io, dilengkapi gateway notifikasi WhatsApp otomatis ke wali murid, modul rekapitulasi nilai harian, serta ekspor laporan administratif sekolah.'
    },
    'aziizmusyafa18/birthdaygreatings': {
      title: 'Interactive Birthday Greetings',
      description: 'Karya interaktif web kreatif berbasis Native JavaScript murni untuk perayaan ulang tahun, menghadirkan animasi kartu dinamis, efek transisi visual ceria, dan pesan ucapan personal tanpa library eksternal.'
    },
    'aziizmusyafa18/birthdaynew': {
      title: 'Birthday Greetings Modern Concept',
      description: 'Eksplorasi antarmuka kreatif mikro-interaksi untuk ucapan digital personal, menampilkan tipografi ekspresif, efek elemen mengambang, serta arsitektur kode frontend yang ringan dan adaptif.'
    },
    'aziizmusyafa18/cafe-mr.klasik': {
      title: 'Cafe & Warkop Mr. Klasik Official Website',
      description: 'Website profil bisnis coffee shop dan warkop modern, menghadirkan sajian katalog menu kuliner terstruktur, informasi fasilitas operasional, serta tautan pemesanan langsung ke kasir via WhatsApp.'
    }
  };

  /**
   * Validasi ketat: Memastikan string deskripsi valid dan bukan tag HTML/boilerplate rusak
   */
  function isValidDescription(text) {
    if (!text || typeof text !== 'string') return false;
    const trimmed = text.trim();
    if (trimmed.length < 25) return false;
    // Cek keberadaan tag HTML mentah seperti <a href atau <img>
    if (trimmed.includes('<a') || trimmed.includes('<img') || trimmed.includes('</') || trimmed.includes('laravel.com')) return false;
    if (trimmed.toLowerCase().includes('laravel is a web application framework')) return false;
    if (trimmed.toLowerCase().includes('this project was bootstrapped with')) return false;
    return true;
  }

  /**
   * Deteksi apakah README merupakan template bawaan framework (Laravel, Vite, Next, CRA)
   */
  function isFrameworkBoilerplate(text) {
    if (!text || typeof text !== 'string') return true;
    const lower = text.toLowerCase();
    if (lower.includes('about laravel') || lower.includes('laravel is a web application framework')) return true;
    if (lower.includes('actions/workflows/tests/badge.svg')) return true;
    if (lower.includes('create react app') && lower.includes('bootstrapped with')) return true;
    if (lower.includes('react + vite') && lower.includes('minimal setup to get react working in vite')) return true;
    if (lower.includes('next.js project bootstrapped with')) return true;
    return false;
  }

  /**
   * Membersihkan cache lama yang rusak atau berisi tag HTML anchor
   */
  function purgeCorruptedCache() {
    try {
      const keysToClean = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('porto_ai_desc_')) {
          const val = localStorage.getItem(key);
          if (!isValidDescription(val)) {
            keysToClean.push(key);
          }
        }
      }
      keysToClean.forEach(k => {
        localStorage.removeItem(k);
        localStorage.removeItem(k.replace('porto_ai_desc_', 'porto_ai_pushed_'));
      });
    } catch (e) {}
  }

  /* ==========================================================================
     1. INISIALISASI KARTU YANG ADA DENGAN DESKRIPSI LENGKAP & VALID
     ========================================================================== */
  function initExistingCards() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    cards.forEach(card => {
      let repo = card.getAttribute('data-repo');
      if (!repo) {
        const extLink = card.querySelector('.project-ext-link') || card.querySelector('.link-btn');
        if (extLink && extLink.href) {
          const match = extLink.href.match(/github\.com\/([a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+)/i);
          if (match) repo = match[1];
        }
      }

      if (!repo) return;
      card.setAttribute('data-repo', repo);

      const descElement = card.querySelector('.project-desc');
      if (descElement) {
        const cachedDesc = localStorage.getItem('porto_ai_desc_' + repo);
        const kbEntry = AI_README_KNOWLEDGE_BASE[repo] ||
                        AI_README_KNOWLEDGE_BASE[repo.replace(/^aziizmusyafa18\//i, '')] ||
                        AI_README_KNOWLEDGE_BASE[`${GITHUB_USERNAME}/${repo}`];
        const kbDesc = kbEntry ? kbEntry.description : '';
        const currentText = (descElement.textContent || '').trim();

        // Utamakan Knowledge Base resmi jika teks saat ini invalid atau kosong
        if (isValidDescription(cachedDesc)) {
          descElement.textContent = cachedDesc;
        } else if (kbDesc) {
          descElement.textContent = kbDesc;
          localStorage.setItem('porto_ai_desc_' + repo, kbDesc);
        } else if (isValidDescription(currentText)) {
          descElement.textContent = currentText;
        }

        descElement.classList.add('ai-synced');
      }

      injectAiBadge(card, 'readme');
    });
  }

  /**
   * Menyisipkan badge AI Summary atau AI Code Review ke kartu proyek
   */
  function injectAiBadge(card, type = 'readme') {
    const cardTop = card.querySelector('.project-card-top');
    if (!cardTop) return;

    const oldBadge = cardTop.querySelector('.ai-summary-tag');
    if (oldBadge) oldBadge.remove();

    const isCodeReview = (type === 'code_review');
    const badge = document.createElement('span');
    badge.className = `ai-summary-tag ${isCodeReview ? 'ai-code-review' : ''}`;
    badge.title = isCodeReview
      ? 'Hasil AI Code Review: Menganalisis komposisi bahasa & struktur repositori GitHub'
      : 'AI Summary: Dirangkum otomatis oleh AI dari repositori GitHub';

    if (isCodeReview) {
      badge.innerHTML = `
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
        <span>AI Code Review</span>
      `;
    } else {
      badge.innerHTML = `
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
        </svg>
        <span>AI Summary</span>
      `;
    }

    const extLink = cardTop.querySelector('.project-ext-link');
    if (extLink) {
      let wrap = cardTop.querySelector('.project-card-top-right');
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'project-card-top-right';
        cardTop.insertBefore(wrap, extLink);
        wrap.appendChild(badge);
        wrap.appendChild(extLink);
      } else {
        wrap.insertBefore(badge, extLink);
      }
    } else {
      cardTop.appendChild(badge);
    }
  }

  /* ==========================================================================
     2. GITHUB AUTO-SYNC: HANYA INJEKSI PROYEK BARU AGAR HEMAT RATE LIMIT
     ========================================================================== */
  async function syncGitHubRepositories() {
    const statusText = document.getElementById('aiSyncStatusText');
    const pulseDot = document.querySelector('.ai-pulse-dot');

    if (pulseDot) pulseDot.classList.add('is-syncing');

    try {
      // 1 Request saja ke endpoint publik user untuk memeriksa semua repositori
      const resp = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=60`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      if (!resp.ok) {
        throw new Error(`GitHub API Status: ${resp.status}`);
      }

      const repos = await resp.json();
      if (!Array.isArray(repos)) return;

      const projectsGrid = document.getElementById('projectsGrid');
      let newProjectsCount = 0;
      let totalProjectsCount = document.querySelectorAll('.project-card').length;

      const validRepos = repos.filter(repo => {
        if (!repo || repo.fork) return false;
        if (repo.name.toLowerCase() === GITHUB_USERNAME.toLowerCase()) return false;
        return true;
      });

      for (const repo of validRepos) {
        const repoFullName = repo.full_name || `${GITHUB_USERNAME}/${repo.name}`;
        let existingCard = document.querySelector(`.project-card[data-repo="${repoFullName}"]`) ||
                           document.querySelector(`.project-card[data-repo="${repo.name}"]`) ||
                           document.querySelector(`.project-card[data-repo="${GITHUB_USERNAME}/${repo.name}"]`);

        // Jika kartu sudah ada di halaman portofolio, pastikan deskripsinya valid
        if (existingCard) {
          const descEl = existingCard.querySelector('.project-desc');
          let currentDesc = descEl ? descEl.textContent.trim() : '';

          if (!isValidDescription(currentDesc)) {
            const kbEntry = AI_README_KNOWLEDGE_BASE[repoFullName] || AI_README_KNOWLEDGE_BASE[`${GITHUB_USERNAME}/${repo.name}`];
            if (kbEntry && descEl) {
              descEl.textContent = kbEntry.description;
              descEl.classList.add('ai-synced');
            }
          }
          continue;
        }

        // HANYA UNTUK PROYEK BARU YANG BELUM ADA DI HALAMAN
        let desc = localStorage.getItem(`porto_ai_desc_${repoFullName}`);
        let aiType = localStorage.getItem(`porto_ai_type_${repoFullName}`) || 'readme';

        if (!isValidDescription(desc)) {
          const aiResult = await processRepositoryWithAi(repo);
          desc = aiResult.description;
          aiType = aiResult.type;

          if (isValidDescription(desc)) {
            localStorage.setItem(`porto_ai_desc_${repoFullName}`, desc);
            localStorage.setItem(`porto_ai_type_${repoFullName}`, aiType);
          }
        }

        if (projectsGrid && isValidDescription(desc)) {
          const newCard = await createProjectCardForRepo(repo, desc, aiType);
          if (newCard) {
            projectsGrid.insertBefore(newCard, projectsGrid.firstChild);
            newProjectsCount++;
            totalProjectsCount++;
          }
        }
      }

      const countAllEl = document.getElementById('countAll');
      if (countAllEl) {
        countAllEl.textContent = totalProjectsCount.toString();
      }

      if (statusText) {
        if (newProjectsCount > 0) {
          statusText.textContent = `✨ ${newProjectsCount} Proyek Baru Terdeteksi di GitHub & Disinkronkan via AI`;
        } else {
          statusText.textContent = `Terhubung ke GitHub @${GITHUB_USERNAME} • Semua Proyek Terupdate`;
        }
      }
    } catch (err) {
      if (statusText) {
        statusText.textContent = `Terhubung ke GitHub @${GITHUB_USERNAME} • Mode Sinkronisasi Cerdas Aktif`;
      }
    } finally {
      if (pulseDot) pulseDot.classList.remove('is-syncing');
    }
  }

  /* ==========================================================================
     3. PEMROSESAN AI: Skenario README vs Skenario CODE REVIEW
     ========================================================================== */
  async function processRepositoryWithAi(repo) {
    const repoFullName = repo.full_name || `${GITHUB_USERNAME}/${repo.name}`;
    const defaultBranch = repo.default_branch || 'main';
    const branches = [defaultBranch, defaultBranch === 'main' ? 'master' : 'main'];
    let readmeText = null;

    // Cek apakah ada berkas README.md
    for (const b of branches) {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${b}/README.md`;
        const resp = await fetch(rawUrl, { cache: 'no-cache' });
        if (resp.ok) {
          const text = await resp.text();
          if (text && text.trim().length > 30) {
            readmeText = text;
            break;
          }
        }
      } catch (e) {}
    }

    // Jika ada README dan BUKAN boilerplate Laravel/Vite, rangkum README
    if (readmeText && !isFrameworkBoilerplate(readmeText)) {
      const summarized = summarizeReadme(readmeText, repoFullName);
      if (isValidDescription(summarized)) {
        return {
          type: 'readme',
          description: summarized
        };
      }
    }

    // SKENARIO 2: README tidak ada atau HANYA boilerplate bawaan framework
    // AI otomatis mereview struktur kode & bahasa repositori
    const codeReviewDesc = await performAiCodeReview(repo);
    return {
      type: 'code_review',
      description: codeReviewDesc
    };
  }

  /**
   * AI CODE REVIEW ENGINE
   * Mereview kode repositori secara otomatis
   */
  async function performAiCodeReview(repo) {
    let languages = {};
    let rootFiles = [];

    try {
      const langResp = await fetch(repo.languages_url || `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/languages`);
      if (langResp.ok) {
        languages = await langResp.json();
      }
    } catch (e) {}

    try {
      const contentsResp = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents`);
      if (contentsResp.ok) {
        const contents = await contentsResp.json();
        if (Array.isArray(contents)) {
          rootFiles = contents.map(f => f.name.toLowerCase());
        }
      }
    } catch (e) {}

    const sortedLanguages = Object.keys(languages).sort((a, b) => languages[b] - languages[a]);
    const primaryLang = sortedLanguages[0] || repo.language || 'Web Technology';
    const secondaryLang = sortedLanguages[1] || '';
    const hasComposer = rootFiles.includes('composer.json') || rootFiles.includes('artisan');
    const hasPackageJson = rootFiles.includes('package.json');
    const hasDockerfile = rootFiles.includes('dockerfile') || rootFiles.includes('docker-compose.yml');
    const hasIndexHtml = rootFiles.includes('index.html');
    const repoTitle = formatRepoTitle(repo.name);

    let architecture = 'Arsitektur Modular';
    let stackName = primaryLang;

    if (hasComposer) {
      architecture = 'Laravel & PHP Enterprise Architecture';
      stackName = 'Laravel Framework, PHP, dan MySQL';
    } else if (hasPackageJson) {
      architecture = 'Full-Stack JavaScript / Node.js Environment';
      stackName = `Node.js, ${primaryLang}${secondaryLang ? ', dan ' + secondaryLang : ''}`;
    } else if (hasIndexHtml) {
      architecture = 'Native Web Frontend Architecture';
      stackName = `HTML5, CSS3, dan ${primaryLang}`;
    }

    if (hasDockerfile) {
      architecture += ' dengan Kontainerisasi Docker';
    }

    const nameLower = repo.name.toLowerCase();
    const isWedding = nameLower.includes('wedding') || nameLower.includes('undangan');
    const isSim = nameLower.includes('simulation') || nameLower.includes('simulasi');
    const isBot = nameLower.includes('bot') || nameLower.includes('ai') || nameLower.includes('gemini');

    if (isWedding) {
      return `Hasil AI Code Review: Platform undangan digital personal berbasis ${stackName}, menghadirkan struktur antarmuka interaktif responsif, manajemen aset visual yang efisien, serta transisi multimedia yang ringan di berbagai ukuran layar.`;
    }

    if (isSim) {
      return `Hasil AI Code Review: Sistem komputasi dan simulasi logika berbasis ${stackName}. Analisis repositori menunjukkan implementasi kalkulasi algoritma yang terstruktur, pengujian skenario interaktif, serta visualisasi data telemetri yang responsif.`;
    }

    if (isBot) {
      return `Hasil AI Code Review: Implementasi layanan otomasi dan pemrosesan kecerdasan buatan berbasis ${stackName}, mengintegrasikan pipeline penanganan prompt kontekstual cepat, validasi respons API, serta pengelolaan riwayat state yang aman.`;
    }

    if (repo.description && repo.description.trim().length > 15) {
      return `Hasil AI Code Review: ${repo.description.trim()} Dibangun dengan fondasi ${architecture} memanfaatkan ${stackName} untuk menjamin efisiensi performa, keterbacaan kode, serta skalabilitas sistem.`;
    }

    return `Hasil AI Code Review: Repositori rekayasa perangkat lunak ${repoTitle} yang diimplementasikan dengan ${architecture}. Memanfaatkan ekosistem ${stackName} untuk menghadirkan alur kerja sistem terstruktur, manipulasi data efisien, dan performa kode yang optimal.`;
  }

  /**
   * AI Summarizer untuk berkas README.md
   * Membersihkan semua tag HTML, badge shields.io, URL gambar mentah, dan boilerplate
   */
  function summarizeReadme(rawText, repoFullName) {
    if (!rawText || isFrameworkBoilerplate(rawText)) {
      return (AI_README_KNOWLEDGE_BASE[repoFullName] && AI_README_KNOWLEDGE_BASE[repoFullName].description) || null;
    }

    // Pembersihan total dari tag HTML, scripts, styles, gambar markdown, dan tautan
    let cleaned = rawText
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ') // Hapus SEMUA tag HTML (<a href...>, <img>, dll)
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // Hapus markdown gambar & badge
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // Ambil teks anchor saja
      .replace(/https?:\/\/\S+/gi, ' '); // Hapus link URL mentah

    const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
    let meaningfulParagraphs = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('#') || line.startsWith('```') || line.startsWith('---') || line.startsWith('>')) {
        continue;
      }
      if (line.length >= 35 && !line.includes('git clone') && !line.includes('npm install') && !line.includes('composer install')) {
        const cleanLine = line.replace(/[*_`]/g, '').trim();
        if (cleanLine.length >= 35 && !cleanLine.startsWith('<')) {
          meaningfulParagraphs.push(cleanLine);
          if (meaningfulParagraphs.length >= 2) break;
        }
      }
    }

    if (meaningfulParagraphs.length > 0) {
      let combined = meaningfulParagraphs.join(' ');
      if (combined.length > 220) {
        const sentenceEnd = combined.indexOf('.', 120);
        if (sentenceEnd !== -1) {
          combined = combined.substring(0, sentenceEnd + 1);
        }
      }
      if (isValidDescription(combined)) {
        return combined;
      }
    }

    return (AI_README_KNOWLEDGE_BASE[repoFullName] && AI_README_KNOWLEDGE_BASE[repoFullName].description) || null;
  }

  /* ==========================================================================
     4. PEMBUATAN ELEMEN KARTU PROYEK BARU DARI GITHUB
     ========================================================================== */
  async function createProjectCardForRepo(repo, description, aiType) {
    const repoFullName = repo.full_name || `${GITHUB_USERNAME}/${repo.name}`;
    const nameLower = repo.name.toLowerCase();

    let category = 'web-app';
    let badgeTitle = 'Web Application';

    if (nameLower.includes('wedding') || nameLower.includes('undangan')) {
      category = 'digital-invitation native';
      badgeTitle = 'Undangan Digital';
    } else if (repo.language === 'PHP' || nameLower.includes('laravel')) {
      category = 'laravel web-app';
      badgeTitle = 'Enterprise App';
    } else if (repo.language === 'HTML' || repo.language === 'CSS' || repo.language === 'JavaScript') {
      category = 'native';
      badgeTitle = 'Creative Web';
    }

    let tags = [];
    if (repo.language) tags.push(repo.language);
    if (repo.topics && Array.isArray(repo.topics)) {
      tags = tags.concat(repo.topics.slice(0, 3));
    }
    if (tags.length === 0) tags = ['GitHub', 'Web'];

    const tagSpans = tags.map(t => {
      const slug = t.toLowerCase().replace(/[^a-z0-9]/g, '');
      return `          <span class="tag tag-${slug}">${t}</span>`;
    }).join('\n');

    const card = document.createElement('article');
    card.className = 'project-card reveal-on-scroll is-visible ai-new-repo';
    card.setAttribute('data-category', category);
    card.setAttribute('data-repo', repoFullName);

    const isCodeReview = (aiType === 'code_review');

    const langColors = {
      'PHP': '#4F5D95',
      'JavaScript': '#f1e05a',
      'TypeScript': '#3178c6',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Python': '#3572A5',
      'Vue': '#41b883',
      'Blade': '#f7523f'
    };
    const langColor = langColors[repo.language] || '#38bdf8';

    card.innerHTML = `
      <div class="project-card-top">
        <div class="project-type-badge normal">
          <span class="star-icon">●</span> ${badgeTitle}
        </div>
        <div class="project-card-top-right">
          <span class="ai-summary-tag ${isCodeReview ? 'ai-code-review' : ''}" title="${isCodeReview ? 'Hasil AI Code Review dari repositori GitHub' : 'Dirangkum otomatis oleh AI dari berkas README.md'}">
            ${isCodeReview ? `
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              <span>AI Code Review</span>
            ` : `
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
              </svg>
              <span>AI Summary</span>
            `}
          </span>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-ext-link" title="Buka di GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      </div>

      <div class="project-showcase">
        <div class="project-showcase-fallback">
          <div class="fallback-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </div>
          <p class="fallback-text">${repo.name}</p>
        </div>
      </div>

      <div class="project-body">
        <h3 class="project-title">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${formatRepoTitle(repo.name)}</a>
        </h3>
        <p class="project-desc ai-synced">
          ${description}
        </p>
        <div class="project-tags">
${tagSpans}
        </div>
      </div>

      <div class="project-footer">
        <div class="repo-meta">
          <span class="lang-dot" style="background-color: ${langColor};"></span>
          <span class="lang-name">${repo.language || 'Web'}</span>
        </div>
        <div class="project-links">
          <button type="button" class="btn-detail-desc" title="Lihat detail deskripsi proyek">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <span>Detail Deskripsi</span>
          </button>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="link-btn">
            <span>Source Code</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    `;

    return card;
  }

  function formatRepoTitle(str) {
    if (!str) return '';
    return str
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  /* ==========================================================================
     5. MODAL DETAIL DESKRIPSI PROYEK
     ========================================================================== */
  function initProjectDetailModal() {
    const modal = document.getElementById('projectDetailModal');
    const closeBtn = document.getElementById('detailModalClose');
    const closeSecondaryBtn = document.getElementById('detailModalCloseBtn');
    const overlay = document.getElementById('detailModalOverlay');

    if (!modal) return;

    function closeModal() {
      modal.classList.remove('is-active');
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }, 250);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeSecondaryBtn) closeSecondaryBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Buka modal saat tombol .btn-detail-desc atau teks .project-desc diklik
    document.addEventListener('click', (e) => {
      const detailBtn = e.target.closest('.btn-detail-desc');
      const descEl = e.target.closest('.project-desc');
      const trigger = detailBtn || descEl;

      if (!trigger) return;

      const card = trigger.closest('.project-card');
      if (!card) return;

      openProjectDetailModal(card);
    });
  }

  function openProjectDetailModal(card) {
    const modal = document.getElementById('projectDetailModal');
    if (!modal) return;

    const titleEl = card.querySelector('.project-title a') || card.querySelector('.project-title');
    const descEl = card.querySelector('.project-desc');
    const typeBadge = card.querySelector('.project-type-badge');
    const aiBadge = card.querySelector('.ai-summary-tag');
    const screenshot = card.querySelector('.project-screenshot');
    const tags = card.querySelectorAll('.project-tags .tag');
    const extLink = card.querySelector('.project-ext-link') || card.querySelector('.link-btn');

    const modalTitle = document.getElementById('detailModalTitle');
    const modalDesc = document.getElementById('detailModalDesc');
    const modalBadge = document.getElementById('detailModalBadge');
    const modalAiTag = document.getElementById('detailModalAiTag');
    const modalMedia = document.getElementById('detailModalMedia');
    const modalTags = document.getElementById('detailModalTags');
    const modalRepoLink = document.getElementById('detailModalRepoLink');

    if (modalTitle && titleEl) modalTitle.textContent = titleEl.textContent.trim();
    if (modalDesc && descEl) modalDesc.textContent = descEl.textContent.trim();

    if (modalBadge && typeBadge) {
      modalBadge.textContent = typeBadge.textContent.replace('★', '').replace('●', '').trim();
      modalBadge.className = typeBadge.className;
    }

    if (modalAiTag && aiBadge) {
      modalAiTag.innerHTML = aiBadge.innerHTML;
      modalAiTag.className = aiBadge.className;
    }

    if (modalMedia) {
      if (screenshot && screenshot.src && screenshot.style.display !== 'none') {
        modalMedia.innerHTML = `<img src="${screenshot.src}" alt="${screenshot.alt || 'Screenshot Proyek'}" class="detail-modal-img">`;
      } else {
        const titleText = (titleEl ? titleEl.textContent.trim() : 'Proyek');
        modalMedia.innerHTML = `
          <div class="project-showcase-fallback">
            <div class="fallback-icon">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </div>
            <p class="fallback-text">${titleText}</p>
          </div>
        `;
      }
    }

    if (modalTags) {
      modalTags.innerHTML = '';
      tags.forEach(t => {
        const clone = t.cloneNode(true);
        modalTags.appendChild(clone);
      });
    }

    if (modalRepoLink && extLink) {
      modalRepoLink.href = extLink.href;
    }

    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('is-active'), 10);
    document.body.style.overflow = 'hidden';
  }

  /* ==========================================================================
     6. INISIALISASI SAAT HALAMAN DIBUKA
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    purgeCorruptedCache();
    initExistingCards();
    initProjectDetailModal();
    syncGitHubRepositories();
  });

})();
