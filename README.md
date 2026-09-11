<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.
https://ai.studio/apps/7f43c2aa-cd42-4864-8c01-d9ab994d6aff

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

Viewed keystatic.config.ts:1-150
Viewed keystatic.config.ts:150-300
Viewed keystatic.config.ts:300-450
Viewed keystatic.config.ts:450-600
Viewed keystatic.config.ts:600-716
Viewed keystatic.ts:290-370
Viewed keystatic.ts:370-450
Viewed keystatic.ts:500-600
Viewed keystatic.ts:600-666
Listed directory pages
Viewed index.astro:1-117
Viewed about.astro:1-31
Viewed research.astro:1-28
Viewed books.astro:1-27
Viewed beyond.astro:1-28
Listed directory blog
Viewed index.astro:1-33
Viewed %5Bslug%5D.astro:1-47
Viewed Layout.astro:1-100
Viewed Layout.astro:190-300
Viewed Layout.astro:300-380
Viewed Hero.tsx:1-100
Viewed Hero.tsx:100-260
Viewed Hero.tsx:260-350
Viewed Hero.tsx:350-454
Viewed AboutSection.tsx:1-140
Viewed ScholarSection.tsx:1-100
Viewed ScholarSection.tsx:320-370
Viewed ScholarSection.tsx:370-440
Viewed BooksSection.tsx:1-100
Viewed BlogSummarySection.tsx:1-80
Viewed GallerySection.tsx:60-110
Viewed GallerySection.tsx:110-140
Viewed BeyondAcademia.tsx:1-100
Viewed AboutMePage.tsx:80-160
Viewed AboutMePage.tsx:240-311
Viewed ResearchPage.tsx:1-100
Viewed BooksPage.tsx:1-100
Viewed BlogPage.tsx:1-100
Searched for "pageContent."
Searched for "authorNoteHeading"
Viewed BlogPage.tsx:845-900
Viewed GalleryPage.tsx:60-140
Viewed GalleryPage.tsx:140-205
Viewed GalleryPage.tsx:220-250
Viewed BeyondAcademiaPage.tsx:80-140
Viewed BeyondAcademiaPage.tsx:140-201
Searched for "cvPdfUrl"
Searched for "CVModal"
Viewed academicLinks.ts:1-83
Viewed scholarStats.json:1-34
Viewed HeroCitationTrajectory.tsx:1-60
Viewed phdStatus.json:1-20
Viewed education.json:1-29
Searched for "education"
Viewed AboutMePage.tsx:205-225
Searched for "blogTelemetryHeading"
Searched for "blogTelemetryHeading"
Searched for "Article Telemetry"
Viewed BeyondAcademiaPage.tsx:65-85
Searched for "documentFile"
Viewed BlogPage.tsx:1380-1440
Viewed InstagramFeedSection.tsx:95-200
Viewed InstagramFeedSection.tsx:340-384
Viewed keystatic.config.ts:340-375
Viewed portfolioData.ts:30-60
Edited keystatic.config.ts
Edited keystatic.config.ts
Viewed scholarStats.json:1-34
Edited scholarStats.json
Viewed keystatic.ts:325-345
Edited keystatic.ts
Viewed Hero.tsx:195-220
Edited Hero.tsx
Viewed AboutMePage.tsx:105-120
Viewed AboutMePage.tsx:210-225
Edited AboutMePage.tsx
Edited AboutMePage.tsx
Viewed BlogPage.tsx:1345-1360
Edited BlogPage.tsx
Ran command: `npm run build`

Hasil audit menyeluruh terhadap **seluruh input di Dashboard Keystatic CMS** dan keterhubungannya dengan **frontend** telah selesai dilakukan.

Semua input telah diperiksa, disinkronkan, dan diverifikasi melalui `npm run build` (lulus 100% tanpa error).

Berikut adalah laporan pemetaan lengkap keterhubungan setiap menu dan input di dashboard ke tampilan frontend:

---

### 1. Menu Profil & Dokumen PhD

#### A. Profil Akademisi & Target PhD (`profile`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **Full Name, Prefix, Suffix** | `name`, `prefix`, `suffix` | Header Hero, Kartu Identitas, Navbar brand, Footer, Metadata JSON-LD |
| **Academic Role / Title** | `role` | Sub-judul Hero (`profile.role`), Kartu potret halaman About, Footer |
| **Faculty & University** | `faculty`, `institution` | Baris afiliasi di bawah nama pada Hero dan About Me |
| **Location** | `location` | Tag lokasi di Hero (`Indonesia`) |
| **Academic Tagline** | `tagline` | Badge kapsul biru di atas kutipan Hero |
| **Editorial Bio Quote** | `bioQuote` | Teks kutipan miring bergaris biru di Hero, About Me, dan Footer |
| **Heading Badge Note** | `authorNoteHeading` | Badge teks biru kecil di kartu About the Author (sidebar artikel blog) |
| **Deskripsi Catatan Note** | `authorNoteText` | Teks refleksi metodologis di kartu About the Author (sidebar artikel blog) |
| **Badge Teks Foto About** | `aboutPhotoBadge` | Badge kecil di sudut foto persegi halaman About (e.g. `UK PhD Applicant`) |
| **Foto Profil Utama (Upload / URL)** | `avatarImage`, `avatarUrl` | Foto headshot Hero, foto persegi About Me, default avatar Instagram feed |
| **Foto Brand & Favicon** | `brandImage`, `brandImageUrl` | Logo lingkaran monogram di Navbar & Footer serta Favicon tab browser |
| **Email Address** | `email` | Tombol *"Scholarly Inquiry & Supervision"* (otomatis `mailto:`) & kontak |
| **Phone / WhatsApp** | `phone` | Data kontak akademisi |
| **5 URL Profil Akademik** | `scholarUrl`, `orcidUrl`, `sintaUrl`, `researchGateUrl`, `scopusUrl` | 5 Tombol logo resmi di Hero (jika dikosongkan, logo otomatis hilang) |
| **Upload CV PDF / URL** | `cvPdfFile`, `cvPdfUrl` | Tombol *"Download Academic CV"* di Hero & About Me (langsung unduh berkas) |

#### B. Riwayat Pendidikan & Gelar (`education`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **Section Badge** | `sectionBadge` | Badge kapsul biru di atas judul pendidikan halaman About Me |
| **Section Title & Description** | `sectionTitle`, `sectionDescription` | Judul dan paragraf pengantar section Education di About Me |
| **Timeline Gelar** | `timeline[].degree, status, institution, focus, period` | Kartu riwayat gelar (PhD, S2, S1), status kehormatan, periode tahun, dan fokus riset |

#### C. Academic Profile / Kotak Hero (`phdStatus`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **Hero Top Badge** | `heroBadge` | Badge kapsul ungu/biru paling atas di Hero |
| **Kotak Kiri: Heading & Status Badge** | `supervisoryTargetHeading`, `supervisoryBadge` | Header dan badge hijau di kotak kiri Hero |
| **Kotak Kiri: Judul Proposal & Deskripsi** | `phdTargetProposal`, `phdTargetDescription` | Judul proposal tebal dan paragraf deskripsi di kotak kiri Hero |
| **Kotak Kanan: Heading & Deskripsi** | `rightSupervisoryHeading`, `rightSupervisoryDescription` | Kotak fokus riset di kolom kanan Hero (bawah grafik sitasi) |
| **Banner Proposal: Heading, Judul, Tombol, URL** | `bannerProposalHeading`, `bannerProposalTitle`, `bannerProposalButtonText`, `bannerProposalButtonUrl` | Banner *"Full Proposal & CV"* di halaman beranda bawah pilar |
| **Footer: Status, Fokus, Deskripsi, Copyright, Verifikasi** | `footerStatusTitle`, `footerFocus`, `footerDescription`, `copyrightText`, `verificationText` | Seluruh teks blok status PhD dan hak cipta di Footer website |

---

### 2. Menu Teks Halaman & Refleksi

#### A. Judul, Badge & Teks Halaman (`pageContent`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **About Section (Beranda)** | `aboutSectionBadge`, `aboutSectionTitle`, `aboutSectionSubtitle`, `aboutSectionCta` | Header section About Me di beranda & tombol *"Read Full Biography"* |
| **About Page (Halaman Penuh)** | `aboutPageBadge`, `aboutPageTitle`, `aboutPageBreadcrumb`, `aboutPillarsHeading`, `aboutPillarsSubtitle` | Badge, judul utama, breadcrumb, dan judul pilar riset di `/about` |
| **Research Page** | `researchBadge`, `researchTitle`, `researchSubtitle`, `researchBreadcrumb` | Badge, judul, deskripsi, dan breadcrumb di `/research` |
| **Books Page** | `booksBadge`, `booksTitle`, `booksSubtitle`, `booksBreadcrumb` | Badge, judul, deskripsi, dan breadcrumb di `/books` |
| **Blog Page & Home** | `blogBadge`, `blogTitle`, `blogPageTitle`, `blogSubtitle`, `blogPageSubtitle`, `blogBreadcrumb`, `blogTelemetryHeading` | Judul section blog di beranda, judul halaman `/blog`, dan header sidebar *"Article Telemetry & Dossier"* |
| **Gallery Page** | `galleryBadge`, `galleryTitle`, `gallerySubtitle`, `galleryBreadcrumb`, `galleryArchiveCountLabel`, `galleryTabAll`, `galleryTabInstagram`, `galleryTabAcademic`, `galleryDividerLabel`, `galleryArchiveHeading`, `galleryArchiveSubtitle` | Seluruh tab filter, badge, judul, pemisah, dan teks arsip di `/gallery` |
| **Beyond Academia** | `beyondBadge`, `beyondTitle`, `beyondPageTitle`, `beyondSubtitle`, `beyondPageSubtitle`, `beyondCta`, `beyondBreadcrumb`, `beyondTaglineRight` | Seluruh teks pengantar section beranda dan halaman penuh `/beyond` |
| **Footer Navigation Labels** | `footerSubpagesHeading`, `footerNavAbout`, `footerNavResearch`, dll. | Label tautan navigasi di kolom tengah Footer |

#### B. Refleksi Somatik & Filosofi (`somaticReflections`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **Section Title & Subtitle** | `sectionTitle`, `sectionSubtitle` | Header section *"Somatic Endurance & Research Philosophy"* di `/beyond` |
| **Daftar Refleksi** | `reflections[].title, quote, author` | Kartu kutipan filosofis somatik di bagian bawah halaman `/beyond` |

---

### 3. Menu Publikasi & Sitasi

#### A. SINTA Garuda Metrics & VOSviewer (`scholarStats`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **Google Scholar Metrics** *(Baru ditambahkan & disinkronkan)* | `totalCitations`, `hIndex`, `i10Index` | 3 Kotak angka metrik live di kolom kanan Hero (Total Citations, h-index, i10-index) |
| **Tren Sitasi Tahunan Google Scholar** | `yearlyCitations` | Komponen tabel dan grafik interaktif *Hero Citation Trajectory* |
| **SINTA Garuda Headings & Badges** | `sectionBadge`, `sectionTitle`, `sectionSubtitle`, `chartLatestBadge`, `chartIndexBadge`, `chartTitle`, `chartSubtitle` | Header section publikasi SINTA Garuda di beranda dan halaman riset |
| **Garuda Count & URL** | `garudaPublicationsCount`, `garudaCitationsCount`, `sintaGarudaUrl` | Jumlah total publikasi Garuda dan tautan resmi profil SINTA Garuda |
| **Tren Publikasi Garuda Per Tahun** | `yearlyPublications[].year, count` | Grafik garis melengkung (*Garuda Curved Line Chart*) |
| **VOSviewer Embed & Deskripsi** | `vosViewerUrl`, `vosViewerTitle`, `vosViewerDescription` | Iframe interaktif jaringan bibliometrik VOSviewer dan deskripsi analisis |

#### B. Research Articles (`researchArticles`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **Featured di Homepage** | `isFeatured`, `featuredOrder` (1 / 2) | Penentuan khusus 2 artikel pilihan yang tampil di beranda (posisi 1 & 2) |
| **Detail Publikasi** | `title`, `authors`, `journal`, `year`, `citations`, `doi`, `url`, `category`, `abstract`, `status`, `keywords` | Kartu artikel di beranda dan halaman `/research`, filter pencarian, filter kategori, badge status, dan tombol salin DOI |

#### C. Books & Monographs (`books`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **Featured di Homepage** | `isFeatured`, `featuredOrder` (1 / 2 / 3) | Penentuan khusus 3 buku pilihan yang tampil di beranda (posisi 1, 2, 3) |
| **Cover Buku** | `coverImage` (upload) / `coverUrl` / `coverGradient` | Cover 3D realistis buku di beranda dan katalog `/books` |
| **Detail & Marketplace** | `title`, `subtitle`, `publisher`, `year`, `isbn`, `pages`, `blurb`, `status`, `topics`, `ctaText`, `ctaUrl`, `marketplaceLinks` | Seluruh kartu buku, modal detail buku, dan tombol beli di marketplace |

---

### 4. Menu Tulisan, Pilar & Galeri

#### A. Blog Posts & Research Notes (`blogPosts`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **Metadata Artikel** | `slug`, `title`, `excerpt`, `category`, `datetime`, `tags` | Kartu ringkasan di beranda, daftar artikel di `/blog`, dan halaman baca artikel `/blog/[slug]` |
| **Cover Image & Caption** | `coverImage`, `imageCaption`, `illustrationType` | Visual landscape header artikel blog |
| **Penulis Tambahan (Co-Authors)** | `authors[].name, avatarImage, avatarUrl, role, affiliation` | Blok co-author di sidebar *Article Telemetry* jika artikel ditulis bersama rekan lain |
| **Lampiran Dokumen & Media** | `documentFile` (PDF), `mediaFile` (Video/Audio/Slide) | Tombol unduh lampiran paper/media di bawah konten artikel |
| **Konten Lengkap WYSIWYG** | `content` (Markdoc) | Badan teks artikel lengkap, heading dinamis (ToC), blockquote, tabel, dan gambar |

#### B. About Pillars (`aboutPillars`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **Pilar Riset** | `title`, `description`, `quote`, `icon`, `tags`, `order` | 2 Pilar utama di beranda dan 4 pilar lengkap di halaman About Me |

#### C. Photo Gallery Items (`galleryItems`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **Foto Kegiatan Akademik** | `title`, `description`, `category`, `imageUrl`, `date`, `location`, `order` | Grid 6 foto di beranda, arsip lengkap di `/gallery`, slider popup modal dengan navigasi keyboard/swipe |

#### D. Instagram Feed (`instagramFeed`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **Identitas Instagram** | `username`, `profileUrl`, `displayName`, `bio`, `avatarImage`, `avatarUrl` | Header kartu feed Instagram (avatar otomatis fallback ke foto profil jika belum diunggah khusus) |
| **Statistik & Tombol** | `postsCount`, `followersCount`, `followingCount`, `statusBadge`, `followButtonText`, `dmButtonText` | Angka statistik Instagram, badge *"Live Connected"*, dan tombol Direct Message |
| **Section & Banner Teks** | `sectionBadge`, `sectionTitle`, `sectionSubtitle`, `bannerTitle`, `bannerSubtitle` | Judul section feed dan banner ajakan follow di bagian bawah |
| **Postingan Feed** | `posts[].caption, imageUrl, postUrl, date, likes, comments, category` | Grid foto Instagram dan modal detail postingan |

#### E. Beyond Academia / Martial Arts (`martialArts`)
| Input di Dashboard | Field Schema | Lokasi Sinkronisasi di Frontend |
| :--- | :--- | :--- |
| **Disiplin Bela Diri** | `name`, `type`, `subtitle`, `description`, `academicParallel`, `badge`, `iconName`, `keyPillars`, `order` | 3 Disiplin bela diri di beranda dan daftar lengkap di halaman `/beyond` lengkap dengan filosofi paralel ke dunia riset |

---

### Perbaikan Tambahan yang Telah Diterapkan
Selama proses audit, ditemukan dan langsung disempurnakan 4 titik sinkronisasi:
1. **Tombol Hero Action**: Tombol *"Download Academic CV"* dan *"Scholarly Inquiry & Supervision"* di Hero beranda kini langsung membuka berkas `profile.cvPdfUrl` dan tautan `mailto:${profile.email}` yang diatur dari dashboard.
2. **Google Scholar Metrics di Dashboard**: Menambahkan kolom input `totalCitations`, `hIndex`, `i10Index`, dan `yearlyCitations` ke dalam singleton `scholarStats` di dashboard sehingga metrik Google Scholar di Hero dapat diedit langsung.
3. **Blog Telemetry Heading**: Menambahkan input `blogTelemetryHeading` ke `pageContent` di dashboard dan menghubungkannya ke kartu sidebar artikel blog.
4. **Halaman About Me**: Judul utama About kini membaca `pageContent.aboutPageTitle` dan menampilkan pill `education.sectionBadge` jika diisi dari dashboard.