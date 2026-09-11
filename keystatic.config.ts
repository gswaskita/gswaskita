import './src/lib/crypto-polyfill';
import React from 'react';
import { config, fields, collection, singleton } from '@keystatic/core';

// Custom read-only field for Keystatic CMS: displays content cleanly without allowing edit
function readOnlyField({
  label,
  description,
  multiline = false,
}: {
  label: string;
  description?: string;
  multiline?: boolean;
}) {
  const baseField = fields.text({ label, description, multiline });
  return {
    ...baseField,
    Input(props: any) {
      const val = props.value || '';
      return React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginBottom: '16px',
          },
        },
        React.createElement(
          'label',
          {
            style: {
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#64748b',
              fontFamily: 'sans-serif',
            },
          },
          label
        ),
        multiline
          ? React.createElement(
              'div',
              {
                style: {
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  minHeight: '64px',
                  userSelect: 'text',
                  fontFamily: 'sans-serif',
                },
              },
              val || '(Tidak ada data)'
            )
          : React.createElement(
              'div',
              {
                style: {
                  padding: '8px 12px',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  fontWeight: 500,
                  userSelect: 'text',
                  fontFamily: 'sans-serif',
                },
              },
              val || '(Tidak ada data)'
            ),
        description
          ? React.createElement(
              'span',
              {
                style: {
                  fontSize: '11px',
                  color: '#94a3b8',
                },
              },
              description
            )
          : null
      );
    },
  };
}

// Custom clickable link field for Keystatic CMS: renders a prominent link button
function clickableLinkField({
  label,
  description,
}: {
  label: string;
  description?: string;
}) {
  const baseField = fields.text({ label, description });
  return {
    ...baseField,
    Input(props: any) {
      const url = props.value || '';
      return React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '18px',
            padding: '12px 14px',
            backgroundColor: '#eff6ff',
            borderRadius: '10px',
            border: '1px solid #bfdbfe',
          },
        },
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              flexWrap: 'wrap',
            },
          },
          React.createElement(
            'label',
            {
              style: {
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#1e40af',
                fontFamily: 'sans-serif',
              },
            },
            label
          ),
          url
            ? React.createElement(
                'a',
                {
                  href: url,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    borderRadius: '7px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'sans-serif',
                    boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
                    cursor: 'pointer',
                  },
                },
                '🌐 Buka Halaman Artikel di Tab Baru ↗'
              )
            : null
        ),
        url
          ? React.createElement(
              'div',
              {
                style: {
                  fontSize: '12px',
                  color: '#2563eb',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                },
              },
              url
            )
          : React.createElement(
              'span',
              {
                style: {
                  fontSize: '12px',
                  color: '#64748b',
                  fontStyle: 'italic',
                },
              },
              'Belum ada tautan halaman artikel.'
            ),
        description
          ? React.createElement(
              'span',
              {
                style: {
                  fontSize: '11px',
                  color: '#64748b',
                },
              },
              description
            )
          : null
      );
    },
  };
}

const isProd = Boolean(
  (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') ||
  import.meta.env?.PROD
);

const githubRepo = (
  (typeof process !== 'undefined' && (process.env.KEYSTATIC_GITHUB_REPO || process.env.PUBLIC_KEYSTATIC_GITHUB_REPO || process.env.GITHUB_REPO)) ||
  (import.meta.env?.KEYSTATIC_GITHUB_REPO as string | undefined) ||
  (import.meta.env?.PUBLIC_KEYSTATIC_GITHUB_REPO as string | undefined) ||
  'gswaskita/gswaskita'
);

const AdaScholarMark = ({ colorScheme }: { colorScheme?: 'light' | 'dark' }) => {
  const isDark = colorScheme === 'dark';
  return React.createElement(
    'svg',
    {
      width: 28,
      height: 28,
      viewBox: '0 0 32 32',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      style: { flexShrink: 0 },
    },
    React.createElement(
      'defs',
      null,
      React.createElement(
        'linearGradient',
        {
          id: 'adascholar-cap-grad',
          x1: '3',
          y1: '4',
          x2: '29',
          y2: '17',
          gradientUnits: 'userSpaceOnUse',
        },
        React.createElement('stop', { stopColor: '#3b82f6' }),
        React.createElement('stop', { offset: '0.6', stopColor: '#4f46e5' }),
        React.createElement('stop', { offset: '1', stopColor: '#7c3aed' })
      ),
      React.createElement(
        'linearGradient',
        {
          id: 'adascholar-book-grad',
          x1: '8',
          y1: '20',
          x2: '24',
          y2: '28',
          gradientUnits: 'userSpaceOnUse',
        },
        React.createElement('stop', { stopColor: isDark ? '#38bdf8' : '#2563eb' }),
        React.createElement('stop', { offset: '1', stopColor: '#0284c7' })
      )
    ),
    // Mortarboard Diamond top
    React.createElement('path', {
      d: 'M16 4L29 10.5L16 17L3 10.5L16 4Z',
      fill: 'url(#adascholar-cap-grad)',
    }),
    // Cap lower structure / skullcap
    React.createElement('path', {
      d: 'M8 13.5V19.5C8 22.8 11.5 25 16 25C20.5 25 24 22.8 24 19.5V13.5L16 17.5L8 13.5Z',
      fill: isDark ? '#475569' : '#1e293b',
      opacity: 0.9,
    }),
    // Open Knowledge Book pages base
    React.createElement('path', {
      d: 'M10 22C12.5 23.5 14.5 23.8 16 23.8C17.5 23.8 19.5 23.5 22 22V24.5C19.5 26 17.5 26.5 16 26.5C14.5 26.5 12.5 26 10 24.5V22Z',
      fill: 'url(#adascholar-book-grad)',
    }),
    // Tassel ribbon hanging to right
    React.createElement('path', {
      d: 'M25.5 12V20.5C25.5 21.8 24.2 22.8 23 22.8',
      stroke: '#f59e0b',
      strokeWidth: '2',
      strokeLinecap: 'round',
    }),
    // Tassel golden bead
    React.createElement('circle', {
      cx: '23',
      cy: '23',
      r: '1.5',
      fill: '#f59e0b',
    }),
    // Cap apex button
    React.createElement('circle', {
      cx: '16',
      cy: '10.5',
      r: '1.5',
      fill: '#ffffff',
    })
  );
};

const AdaScholarBrandName = React.createElement(
  'div',
  {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minWidth: 0,
      lineHeight: 1.15,
      padding: '2px 0',
    },
  },
  React.createElement(
    'span',
    {
      style: {
        fontWeight: 800,
        fontSize: '15px',
        letterSpacing: '-0.02em',
        color: 'inherit',
      },
    },
    'ADAScholar'
  ),
  React.createElement(
    'span',
    {
      style: {
        fontSize: '9.5px',
        fontWeight: 500,
        color: '#64748b',
        marginTop: '2px',
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      },
    },
    'The Ultimate Researcher Profile Builder'
  )
);

export default config({
  storage: isProd && githubRepo
    ? {
        kind: 'github',
        repo: githubRepo as any,
      }
    : {
        kind: 'local',
      },

  ui: {
    brand: {
      name: AdaScholarBrandName as any,
      mark: AdaScholarMark,
    },
    navigation: {
      '1. Profil & Dokumen PhD': ['profile', 'education', 'phdStatus'],
      '2. Teks Halaman & Refleksi': ['pageContent', 'somaticReflections'],
      '3. Publikasi & Sitasi': ['scholarStats', 'researchArticles', 'books'],
      '4. Tulisan, Pilar & Galeri': ['blogPosts', 'aboutPillars', 'galleryItems', 'instagramFeed', 'martialArts'],
      '5. Komunitas': ['comments'],
    },
  },

  singletons: {
    profile: singleton({
      label: 'Profil Akademisi & Target PhD (Author Profile)',
      path: 'src/content/profile',
      format: { data: 'json' },
      schema: {
        siteTitle: fields.text({
          label: 'Browser Tab Title / Meta SEO Title (Homepage & General)',
          description: 'Judul tab browser untuk homepage dan meta SEO title (Default: Gautama Sastra Waskita - Academic Portfolio & PhD Research). Mengubah teks ini akan langsung mengubah judul tab browser.',
          defaultValue: 'Gautama Sastra Waskita - Academic Portfolio & PhD Research',
        }),
        name: fields.text({ label: 'Full Name' }),
        lastName: fields.text({ label: 'Last Name / Family Name' }),
        prefix: fields.text({ label: 'Academic Prefix' }),
        suffix: fields.text({ label: 'Academic Suffix' }),
        role: fields.text({ label: 'Academic Role / Title' }),
        faculty: fields.text({ label: 'Faculty / Department' }),
        institution: fields.text({ label: 'University / Institution' }),
        location: fields.text({ label: 'Location' }),
        tagline: fields.text({ label: 'Academic Tagline' }),
        bioQuote: fields.text({ label: 'Editorial Bio Quote', multiline: true }),
        authorNoteHeading: fields.text({
          label: '1. [About the Author / Dossier] - Judul / Heading Badge (e.g. Peer-Triangulated Note)',
          description: 'Judul badge teks biru kecil dengan ikon perisai pada kotak di kartu About the Author (dan sidebar Article Telemetry)',
          defaultValue: 'Peer-Triangulated Note',
        }),
        authorNoteText: fields.text({
          label: '2. [About the Author / Dossier] - Deskripsi Catatan (Description Text)',
          description: 'Teks paragraf refleksi metodologis di dalam kotak About the Author (dan sidebar Article Telemetry)',
          multiline: true,
          defaultValue: 'Methodological empirical reflections for doctoral supervision in Operations Management.',
        }),
        aboutPhotoBadge: fields.text({
          label: 'Badge Teks Foto Halaman About (e.g. UK PhD Applicant)',
          description: 'Teks badge kecil di sudut bawah foto profil pada halaman About (default: UK PhD Applicant)',
          defaultValue: 'UK PhD Applicant',
        }),
        avatarImage: fields.image({
          label: 'Foto Profil Utama / Hero (Upload Berkas)',
          description: 'Unggah file gambar foto profil untuk Hero section di beranda (tersimpan di public/static/images/profile/)',
          directory: 'public/static/images/profile',
          publicPath: '/static/images/profile/',
        }),
        avatarUrl: fields.text({
          label: 'Foto Profil Utama / Hero (Atau URL Gambar Eksternal)',
          description: 'Gunakan input ini jika ingin menggunakan link URL gambar online untuk Hero section',
        }),
        brandImage: fields.image({
          label: 'Foto Brand Logo & Favicon (Upload Berkas)',
          description: 'Unggah berkas gambar khusus untuk foto brand monogram lingkaran (Navbar & Footer) serta Favicon tab browser (tersimpan di public/static/images/brand/)',
          directory: 'public/static/images/brand',
          publicPath: '/static/images/brand/',
        }),
        brandImageUrl: fields.text({
          label: 'Foto Brand Logo & Favicon (Atau URL Gambar Eksternal)',
          description: 'Gunakan input ini jika ingin menempelkan link URL gambar online khusus untuk foto brand & favicon (berbeda dengan foto Hero)',
        }),
        email: fields.text({ label: 'Email Address' }),
        phone: fields.text({ label: 'Phone / WhatsApp' }),
        researchGateUrl: fields.text({
          label: 'ResearchGate Profile URL',
          description: 'Contoh: https://www.researchgate.net/profile/Gautama-Waskita (Kosongkan bila tidak ingin menampilkan logo di homepage)',
        }),
        scholarUrl: fields.text({
          label: 'Google Scholar Profile URL (Full Link)',
          description: 'Contoh: https://scholar.google.com/citations?user=jUvO-FEAAAAJ&hl=id (Kosongkan bila tidak ingin menampilkan logo di homepage)',
        }),
        sintaUrl: fields.text({
          label: 'SINTA Profile URL (Kemdiktisaintek Full Link)',
          description: 'Contoh: https://sinta.kemdiktisaintek.go.id/authors/profile/6801795 (Kosongkan bila tidak ingin menampilkan logo di homepage)',
        }),
        orcidUrl: fields.text({
          label: 'ORCID Profile URL (Full Link)',
          description: 'Contoh: https://orcid.org/0009-0003-6479-7936 (Kosongkan bila tidak ingin menampilkan logo di homepage)',
        }),
        scopusUrl: fields.text({
          label: 'Scopus Profile URL (Full Link)',
          description: 'Contoh: https://www.scopus.com/authid/detail.uri?authorId=57195348648 (Kosongkan bila tidak ingin menampilkan logo di homepage)',
        }),
        cvPdfFile: fields.file({
          label: 'Upload File CV (PDF)',
          description: 'Unggah berkas dokumen Curriculum Vitae / Resume PDF langsung (tersimpan di public/static/docs/cv/)',
          directory: 'public/static/docs/cv',
          publicPath: '/static/docs/cv/',
        }),
        cvPdfUrl: fields.text({
          label: 'URL Link CV (Online / Eksternal)',
          description: 'Atau masukkan tautan URL dokumen CV (misal: Google Drive, OneDrive, atau link PDF online) jika tidak mengunggah file',
        }),
        campusAddress: fields.text({
          label: 'Alamat Afiliasi Kampus Tempat Kerja (Opsional)',
          description: 'Alamat lengkap universitas / kampus tempat kerja (kosongkan jika tidak ingin ditampilkan). Mendukung multi-baris.',
          multiline: true,
        }),
        campusMapsUrl: fields.text({
          label: 'Tautan Google Maps Kampus (Opsional)',
          description: 'Tautan Google Maps untuk petunjuk arah ke kampus/institusi (kosongkan bila tidak ada)',
        }),
        domicileAddress: fields.text({
          label: 'Alamat Domisili / Korespondensi Pribadi (Opsional)',
          description: 'Alamat lengkap tempat tinggal/domisili untuk korespondensi resmi (kosongkan jika tidak ingin ditampilkan). Mendukung multi-baris.',
          multiline: true,
        }),
        domicileMapsUrl: fields.text({
          label: 'Tautan Google Maps Domisili (Opsional)',
          description: 'Tautan Google Maps untuk lokasi domisili (kosongkan bila tidak ada)',
        }),
      },
    }),

    education: singleton({
      label: 'Riwayat Pendidikan & Gelar (Academic Qualifications)',
      path: 'src/content/education',
      format: { data: 'json' },
      schema: {
        sectionBadge: fields.text({ label: 'Section Badge' }),
        sectionTitle: fields.text({ label: 'Section Title' }),
        sectionDescription: fields.text({ label: 'Section Description', multiline: true }),
        timeline: fields.array(
          fields.object({
            degree: fields.text({ label: 'Degree Name (e.g. PhD, M.M., S.E.)' }),
            status: fields.text({ label: 'Status (e.g. Graduated with Honors / Application Review)' }),
            institution: fields.text({ label: 'Institution / Target Universities' }),
            focus: fields.text({ label: 'Specialization Focus / Honors' }),
            period: fields.text({ label: 'Period / Timeline (e.g. 2025 – Present)' }),
          }),
          {
            label: 'Academic Degrees Timeline',
            itemLabel: props => `${props.fields.degree.value || 'Degree'} (${props.fields.period.value || 'Period'})`,
          }
        ),
      },
    }),

    phdStatus: singleton({
      label: 'Academic Profile (Kotak Kiri & Kotak Kanan Hero)',
      path: 'src/content/phdStatus',
      format: { data: 'json' },
      schema: {
        heroBadge: fields.text({ label: 'Hero Top Badge (e.g. PhD Application Dossier • UK Universities Admission)' }),
        
        // --- KOTAK KIRI (KOLOM UTAMA HERO) ---
        supervisoryTargetHeading: fields.text({ 
          label: '1. [KOTAK KIRI] - Heading (e.g. UK PhD Supervisory Target)',
          description: 'Judul kecil header kotak di kolom kiri Hero'
        }),
        supervisoryBadge: fields.text({ 
          label: '2. [KOTAK KIRI] - Status Badge (e.g. Open for Supervision)',
          description: 'Badge teks hijau kecil di samping heading kotak kiri'
        }),
        phdTargetProposal: fields.text({ 
          label: '3. [KOTAK KIRI] - Judul Proposal Doktoral / Riset (Proposal Title)',
          description: 'Judul tebal proposal di dalam kotak kiri (e.g. Sustaining Dynamic Capabilities in Decentralized SME Value Networks...)',
          multiline: true 
        }),
        phdTargetDescription: fields.text({ 
          label: '4. [KOTAK KIRI] - Deskripsi / Ringkasan Supervisi (Description)',
          description: 'Paragraf deskripsi di dalam kotak kiri (e.g. halo My research has progressively examined...)',
          multiline: true 
        }),

        // --- KOTAK KANAN (SIDEBAR DI BAWAH GRAFIK CITATION TRAJECTORY) ---
        rightSupervisoryHeading: fields.text({ 
          label: '5. [KOTAK KANAN HERO] - Heading (e.g. Doctoral Research Proposal Focus)',
          description: 'Judul header kotak di kolom kanan bawah grafik Citation Trajectory (berbeda dengan kotak kiri)'
        }),
        rightSupervisoryDescription: fields.text({ 
          label: '6. [KOTAK KANAN HERO] - Deskripsi Fokus Riset (Description)',
          description: 'Paragraf deskripsi di dalam kotak kanan bawah grafik Citation Trajectory (berbeda dengan kotak kiri)',
          multiline: true 
        }),

        // --- BANNER FULL PROPOSAL & CV (BERANDA DI BAWAH ACADEMIC FOUNDATION) ---
        bannerProposalHeading: fields.text({ 
          label: '7. [BANNER FULL PROPOSAL & CV] - Heading (e.g. Doctoral Research Proposal Focus)',
          description: 'Badge heading di atas judul proposal pada banner "Full Proposal & CV" di beranda'
        }),
        bannerProposalTitle: fields.text({ 
          label: '8. [BANNER FULL PROPOSAL & CV] - Judul Proposal Riset (Proposal Title)',
          description: 'Judul proposal riset yang ditampilkan di dalam tanda kutip pada banner Full Proposal & CV (terpisah dari Kotak Kiri)',
          multiline: true 
        }),
        bannerProposalButtonText: fields.text({ 
          label: '9. [BANNER FULL PROPOSAL & CV] - Teks Tombol (e.g. View Full Proposal & CV →)',
          description: 'Teks tombol pada banner Full Proposal & CV (default: View Full Proposal & CV →)' 
        }),
        bannerProposalButtonUrl: fields.text({ 
          label: '10. [BANNER FULL PROPOSAL & CV] - Link URL Tombol (e.g. /about)',
          description: 'Tautan saat tombol diklik (default: /about)' 
        }),

        verifiedTriangulationHeading: fields.text({ label: 'Triangulation Heading (e.g. Verified Academic Triangulation:)' }),
        footerStatusTitle: fields.text({ label: 'Footer Status Title (e.g. UK PhD Application Status)' }),
        footerFocus: fields.text({ label: 'Footer Focus Line (e.g. Focus: Sustainable Dynamic Value Networks)' }),
        footerDescription: fields.text({ label: 'Footer Description', multiline: true }),
        verificationText: fields.text({ label: 'Footer Verification Line (e.g. Google Scholar Verified • ORCID Verified)' }),
        copyrightText: fields.text({ label: 'Footer Copyright Text' }),
      },
    }),

    pageContent: singleton({
      label: 'Judul, Badge & Teks Halaman (Page Intros & Headings)',
      path: 'src/content/pageContent',
      format: { data: 'json' },
      schema: {
        // About Section & Page
        aboutSectionBadge: fields.text({ label: 'About Section Badge' }),
        aboutSectionTitle: fields.text({ label: 'About Section Title' }),
        aboutSectionSubtitle: fields.text({ label: 'About Section Subtitle', multiline: true }),
        aboutSectionCta: fields.text({ label: 'About Section Button Text' }),
        aboutProposalHeading: fields.text({ label: 'About Banner: Proposal Heading (e.g. Doctoral Research Proposal Focus)' }),
        aboutProposalTitle: fields.text({ label: 'About Banner: Proposal Title', multiline: true }),
        aboutProposalCta: fields.text({ label: 'About Banner: Button Text (e.g. View Full Proposal & CV →)' }),
        aboutProposalUrl: fields.text({ label: 'About Banner: Button URL (default: /about)' }),
        aboutPageBadge: fields.text({ label: 'About Page Top Badge' }),
        aboutPageTitle: fields.text({ label: 'About Page Heading' }),
        aboutPageBreadcrumb: fields.text({ label: 'About Page Breadcrumb Label' }),
        aboutPillarsHeading: fields.text({ label: 'About Pillars Section Heading' }),
        aboutPillarsSubtitle: fields.text({ label: 'About Pillars Subtitle', multiline: true }),
        aboutPhotoBadge: fields.text({ label: 'About Photo Badge (e.g. UK PhD Applicant)' }),

        // Halaman About: Afiliasi Institusi & Alamat Domisili
        aboutAddressSectionBadge: fields.text({
          label: 'Halaman About - Badge Section Alamat (e.g. Verifiable Institutional Affiliation & Correspondence)',
          defaultValue: 'Verifiable Institutional Affiliation & Correspondence',
        }),
        aboutAddressSectionTitle: fields.text({
          label: 'Halaman About - Judul Section Alamat (e.g. Academic Workplace & Domicile Addresses)',
          defaultValue: 'Academic Workplace & Domicile Addresses',
        }),
        aboutAddressSectionSubtitle: fields.text({
          label: 'Halaman About - Deskripsi Section Alamat',
          multiline: true,
          defaultValue: 'Official university workplace affiliation and residential correspondence address for formal supervisory, research collaborations, and doctoral inquiries.',
        }),
        aboutCampusCardBadge: fields.text({
          label: 'Halaman About - Badge Kartu Kampus (e.g. Afiliasi Kampus Tempat Kerja)',
          defaultValue: 'Afiliasi Kampus Tempat Kerja',
        }),
        aboutCampusAddressLabel: fields.text({
          label: 'Halaman About - Label Teks Alamat Kampus (e.g. Alamat Kampus:)',
          defaultValue: 'Alamat Kampus:',
        }),
        aboutCampusMapsButtonText: fields.text({
          label: 'Halaman About - Teks Tombol Maps Kampus (e.g. Petunjuk Lokasi (Google Maps))',
          defaultValue: 'Petunjuk Lokasi (Google Maps)',
        }),
        aboutDomicileCardBadge: fields.text({
          label: 'Halaman About - Badge Kartu Domisili (e.g. Alamat Domisili & Korespondensi)',
          defaultValue: 'Alamat Domisili & Korespondensi',
        }),
        aboutDomicileCardTitle: fields.text({
          label: 'Halaman About - Judul Kartu Domisili (e.g. Kediaman Resmi • Korespondensi)',
          defaultValue: 'Kediaman Resmi • Korespondensi',
        }),
        aboutDomicileAddressLabel: fields.text({
          label: 'Halaman About - Label Teks Alamat Domisili (e.g. Alamat Domisili Lengkap:)',
          defaultValue: 'Alamat Domisili Lengkap:',
        }),
        aboutDomicileMapsButtonText: fields.text({
          label: 'Halaman About - Teks Tombol Maps Domisili (e.g. Lokasi Domisili (Google Maps))',
          defaultValue: 'Lokasi Domisili (Google Maps)',
        }),
        aboutProposalCardBadge: fields.text({
          label: 'Halaman About - Badge Kartu Proposal PhD (e.g. Prospective PhD Dissertation Title • UK Admission)',
          defaultValue: 'Prospective PhD Dissertation Title • UK Admission',
        }),

        // Research Section & Page
        researchBadge: fields.text({ label: 'Research Badge' }),
        researchTitle: fields.text({ label: 'Research Page Heading' }),
        researchSubtitle: fields.text({ label: 'Research Subtitle', multiline: true }),
        researchBreadcrumb: fields.text({ label: 'Research Breadcrumb Label' }),

        // Books Section & Page
        booksBadge: fields.text({ label: 'Books Badge' }),
        booksTitle: fields.text({ label: 'Books Heading' }),
        booksSubtitle: fields.text({ label: 'Books Subtitle', multiline: true }),
        booksBreadcrumb: fields.text({ label: 'Books Breadcrumb Label' }),

        // Blog Section & Page
        blogBadge: fields.text({ label: 'Blog Badge' }),
        blogTitle: fields.text({ label: 'Blog Home Section Heading' }),
        blogPageTitle: fields.text({ label: 'Blog Page Main Heading' }),
        blogSubtitle: fields.text({ label: 'Blog Home Section Subtitle', multiline: true }),
        blogPageSubtitle: fields.text({ label: 'Blog Page Main Subtitle', multiline: true }),
        blogBreadcrumb: fields.text({ label: 'Blog Breadcrumb Label' }),
        blogTelemetryHeading: fields.text({ 
          label: 'Blog Article Telemetry Heading (e.g. Article Telemetry & Dossier)',
          defaultValue: 'Article Telemetry & Dossier',
        }),
        blogArticleNoteHeading: fields.text({ 
          label: 'Blog Article Note Heading (e.g. Peer-Triangulated Note)',
          defaultValue: 'Peer-Triangulated Note',
        }),
        blogArticleNoteText: fields.text({ 
          label: 'Blog Article Note Description Text', 
          multiline: true,
          defaultValue: 'Methodological empirical reflections for doctoral supervision in Operations Management.',
        }),

        // Gallery Section & Page
        galleryBadge: fields.text({ label: 'Gallery Badge' }),
        galleryTitle: fields.text({ label: 'Gallery Heading' }),
        gallerySubtitle: fields.text({ label: 'Gallery Subtitle', multiline: true }),
        galleryBreadcrumb: fields.text({ label: 'Gallery Breadcrumb Label' }),
        galleryArchiveCountLabel: fields.text({ label: 'Gallery Total Archive Label' }),
        galleryTabAll: fields.text({ label: 'Gallery Tab: All Documentation' }),
        galleryTabInstagram: fields.text({ label: 'Gallery Tab: Instagram Feed' }),
        galleryTabAcademic: fields.text({ label: 'Gallery Tab: Academic Archive' }),
        galleryDividerLabel: fields.text({ label: 'Gallery Divider Label' }),
        galleryArchiveHeading: fields.text({ label: 'Academic Archive Sub-Heading' }),
        galleryArchiveSubtitle: fields.text({ label: 'Academic Archive Sub-Title', multiline: true }),

        // Beyond Section & Page
        beyondBadge: fields.text({ label: 'Beyond Academia Badge' }),
        beyondTitle: fields.text({ label: 'Beyond Academia Home Title' }),
        beyondPageTitle: fields.text({ label: 'Beyond Academia Page Title' }),
        beyondSubtitle: fields.text({ label: 'Beyond Academia Home Subtitle', multiline: true }),
        beyondPageSubtitle: fields.text({ label: 'Beyond Academia Page Subtitle', multiline: true }),
        beyondCta: fields.text({ label: 'Beyond Academia Button Text' }),
        beyondBreadcrumb: fields.text({ label: 'Beyond Academia Breadcrumb Label' }),
        beyondTaglineRight: fields.text({ label: 'Beyond Tagline Right' }),

        // Footer Navigation
        footerSubpagesHeading: fields.text({ label: 'Footer Subpages Heading' }),
        footerNavAbout: fields.text({ label: 'Footer Nav: About' }),
        footerNavResearch: fields.text({ label: 'Footer Nav: Research' }),
        footerNavBooks: fields.text({ label: 'Footer Nav: Books' }),
        footerNavBlog: fields.text({ label: 'Footer Nav: Blog' }),
        footerNavGallery: fields.text({ label: 'Footer Nav: Gallery' }),
        footerNavBeyond: fields.text({ label: 'Footer Nav: Beyond' }),
      },
    }),

    somaticReflections: singleton({
      label: 'Refleksi Somatik & Filosofi (Beyond Academia Quotes)',
      path: 'src/content/somaticReflections',
      format: { data: 'json' },
      schema: {
        sectionTitle: fields.text({ label: 'Section Title (e.g. Somatic Endurance & Research Philosophy)' }),
        sectionSubtitle: fields.text({ label: 'Section Subtitle', multiline: true }),
        reflections: fields.array(
          fields.object({
            title: fields.text({ label: 'Reflection Title (e.g. Mental Endurance & The Revision Grind)' }),
            quote: fields.text({ label: 'Philosophical Quote', multiline: true }),
            author: fields.text({ label: 'Author Name' }),
          }),
          {
            label: 'Somatic Reflections List',
            itemLabel: props => props.fields.title.value || 'Reflection',
          }
        ),
      },
    }),

    scholarStats: singleton({
      label: 'SINTA Garuda Metrics & VOSviewer',
      path: 'src/content/scholarStats',
      format: { data: 'json' },
      schema: {
        sectionBadge: fields.text({
          label: 'Badge Section Garuda',
          description: 'Label badge kecil di atas judul (Contoh: SINTA Kemdiktisaintek • Garuda Index)',
        }),
        sectionTitle: fields.text({
          label: 'Judul Utama Section Garuda',
          description: 'Judul section publikasi Garuda (Contoh: SINTA Garuda Publications & Metric Timeline)',
        }),
        sectionSubtitle: fields.text({
          label: 'Deskripsi / Subtitle Section Garuda',
          description: 'Teks deskripsi penjelasan di bawah judul section',
          multiline: true,
        }),
        chartLatestBadge: fields.text({
          label: 'Badge Status Grafik (Contoh: Latest number of publications)',
          description: 'Label status teks oranye di atas grafik garis melengkung',
        }),
        chartIndexBadge: fields.text({
          label: 'Badge Indeks Grafik (Contoh: SINTA Garuda Index)',
          description: 'Pill badge indeks di samping status grafik',
        }),
        chartTitle: fields.text({
          label: 'Judul Grafik Garis Melengkung (Contoh: Garuda Annual Publication Trajectory)',
          description: 'Judul utama di atas grafik garis melengkung Garuda',
        }),
        chartSubtitle: fields.text({
          label: 'Subtitle / Deskripsi Grafik Garis Melengkung',
          description: 'Teks deskripsi di bawah judul grafik garis melengkung',
          multiline: true,
        }),
        sintaGarudaUrl: fields.text({
          label: 'SINTA Garuda Profile URL',
          description: 'Link profil resmi SINTA Garuda (contoh: https://sinta.kemdiktisaintek.go.id/authors/profile/6801795/?view=garuda)',
        }),
        garudaPublicationsCount: fields.integer({
          label: 'Total Dokumen Publikasi Garuda',
          description: 'Jumlah seluruh publikasi terindeks Garuda (contoh: 21)',
        }),
        garudaCitationsCount: fields.integer({
          label: 'Total Sitasi Garuda (Opsional)',
          description: 'Jumlah sitasi Garuda (contoh: 18)',
        }),
        totalCitations: fields.integer({
          label: 'Google Scholar: Total Citations (e.g. 348)',
          description: 'Total sitasi Google Scholar yang tampil di kolom kanan Hero (default: 348)',
        }),
        hIndex: fields.integer({
          label: 'Google Scholar: h-index (e.g. 9)',
          description: 'Skor h-index Google Scholar di kolom kanan Hero',
        }),
        i10Index: fields.integer({
          label: 'Google Scholar: i10-index (e.g. 8)',
          description: 'Skor i10-index Google Scholar di kolom kanan Hero',
        }),
        yearlyCitations: fields.array(
          fields.object({
            year: fields.integer({ label: 'Tahun (Year)', validation: { min: 1990, max: 2100 } }),
            count: fields.integer({ label: 'Jumlah Sitasi (Citations Count)' }),
            growthPercent: fields.integer({
              label: 'YoY % (Opsional - Kosongkan jika ingin dihitung otomatis)',
              description: 'Persentase pertumbuhan dibanding tahun sebelumnya (contoh: 150 atau -20). Jika dikosongkan, dihitung otomatis.',
            }),
            cumulative: fields.integer({
              label: 'Kumulatif (Opsional - Kosongkan jika ingin dihitung otomatis)',
              description: 'Total akumulasi sitasi sampai tahun ini. Jika dikosongkan, dihitung otomatis dari tahun-tahun sebelumnya.',
            }),
            milestone: fields.text({
              label: 'Milestone Riset (Tampil di Kolom Tabel & Tooltip Grafik)',
              description: 'Catatan pencapaian riset penting di tahun ini (contoh: First research citations, Scopus Q1, dll)',
            }),
          }),
          {
            label: 'Tren Sitasi Tahunan Google Scholar (Hero Citation Trajectory Graphic & Table)',
            itemLabel: props => `${props.fields.year.value || 'Tahun'}: ${props.fields.count.value || 0} sitasi ${props.fields.milestone.value ? `• ${props.fields.milestone.value}` : ''}`,
          }
        ),
        yearlyPublications: fields.array(
          fields.object({
            year: fields.integer({ label: 'Tahun (Year)', validation: { min: 1990, max: 2100 } }),
            count: fields.integer({ label: 'Jumlah Publikasi (Publications Count)' }),
          }),
          {
            label: 'Tren Publikasi Garuda Per Tahun (Garuda Curved Line Chart)',
            itemLabel: props => `${props.fields.year.value || 'Tahun'}: ${props.fields.count.value || 0} publikasi`,
          }
        ),
        vosViewerUrl: fields.text({
          label: 'VOSviewer Embed Link (Web App / Google Drive)',
          description: 'Link embed resmi VOSviewer (https://app.vosviewer.com/?json=...) atau link Google Drive (contoh: https://drive.google.com/file/d/1ydh.../view?usp=sharing). Link Google Drive otomatis diambil ID filenya dan ditransform menjadi https://app.vosviewer.com/?json=https://drive.google.com/uc?id=FILE_ID&simple_ui=true',
        }),
        vosViewerTitle: fields.text({ label: 'VOSviewer Section Title' }),
        vosViewerDescription: fields.text({ label: 'VOSviewer Analytical Description', multiline: true }),
      },
    }),

    instagramFeed: singleton({
      label: 'Instagram Feed',
      path: 'src/content/instagramFeed',
      format: { data: 'json' },
      schema: {
        username: fields.text({ label: 'Instagram Username' }),
        profileUrl: fields.text({ label: 'Instagram Profile URL' }),
        displayName: fields.text({ label: 'Display Name' }),
        bio: fields.text({ label: 'Bio / Tagline', multiline: true }),
        avatarImage: fields.image({
          label: 'Profile Picture (Upload Foto)',
          description: 'Unggah file foto avatar (disimpan di public/static/images/profile/)',
          directory: 'public/static/images/profile',
          publicPath: '/static/images/profile/',
        }),
        avatarUrl: fields.text({
          label: 'Profile Picture URL (Atau URL Eksternal)',
          description: 'Gunakan input ini jika ingin menggunakan link URL gambar langsung tanpa mengunggah file',
        }),
        postsCount: fields.text({ label: 'Posts Count (e.g. 240+)' }),
        followersCount: fields.text({ label: 'Followers Count (e.g. 1.2k)' }),
        followingCount: fields.text({ label: 'Following Count (e.g. 380)' }),
        statusBadge: fields.text({ label: 'Active Status Badge Text (e.g. Live Connected)' }),
        sectionBadge: fields.text({ label: 'Feed Section Badge' }),
        sectionTitle: fields.text({ label: 'Feed Section Title' }),
        sectionSubtitle: fields.text({ label: 'Feed Section Subtitle', multiline: true }),
        followButtonText: fields.text({ label: 'Follow Button Text' }),
        dmButtonText: fields.text({ label: 'Direct Message Button Text' }),
        viewProfileText: fields.text({ label: 'View Profile Link Text' }),
        bannerTitle: fields.text({ label: 'Bottom Banner Heading' }),
        bannerSubtitle: fields.text({ label: 'Bottom Banner Subtitle', multiline: true }),
        bannerCtaText: fields.text({ label: 'Bottom Banner Button Text' }),
        posts: fields.array(
          fields.object({
            id: fields.text({ label: 'Post ID' }),
            caption: fields.text({ label: 'Caption', multiline: true }),
            imageUrl: fields.text({ label: 'Image URL' }),
            postUrl: fields.text({ label: 'Instagram Post URL' }),
            date: fields.text({ label: 'Date / Relative Time' }),
            likes: fields.integer({ label: 'Likes Count' }),
            comments: fields.integer({ label: 'Comments Count' }),
            category: fields.text({ label: 'Category / Tag' }),
          }),
          {
            label: 'Instagram Posts List',
            itemLabel: props => props.fields.caption.value?.slice(0, 40) || 'Instagram Post',
          }
        ),
      },
    }),
  },

  collections: {
    researchArticles: collection({
      label: 'Research Articles',
      slugField: 'id',
      path: 'src/content/researchArticles/*',
      format: { data: 'json' },
      schema: {
        id: fields.slug({ name: { label: 'Article ID / Slug' } }),
        isFeatured: fields.checkbox({
          label: 'Tampilkan di Homepage (Featured Article)',
          description: 'Centang jika artikel ini dipilih khusus untuk tampil di homepage (khusus 2 artikel pilihan).',
          defaultValue: false,
        }),
        featuredOrder: fields.select({
          label: 'Urutan Posisi Featured di Homepage',
          description: 'Pilih letak posisi artikel di homepage: 1 = Kiri/Artikel Utama, 2 = Kanan. Yang paling terakhir dipilih adalah yang paling kuat, yang lain menyesuaikan.',
          options: [
            { label: 'Posisi 1 (Kiri / Artikel Utama)', value: '1' },
            { label: 'Posisi 2 (Kanan / Artikel Kedua)', value: '2' },
          ],
          defaultValue: '1',
        }),
        title: fields.text({ label: 'Article Title' }),
        authors: fields.text({ label: 'Authors' }),
        journal: fields.text({ label: 'Journal / Conference' }),
        year: fields.integer({ label: 'Year Published' }),
        citations: fields.integer({ label: 'Citations Count' }),
        doi: fields.text({ label: 'DOI' }),
        url: fields.text({ label: 'Publisher / Scholar Link URL' }),
        category: fields.text({ label: 'Research Category' }),
        abstract: fields.text({ label: 'Abstract', multiline: true }),
        status: fields.select({
          label: 'Publication Status',
          options: [
            { label: 'Published', value: 'Published' },
            { label: 'Under Review', value: 'Under Review' },
            { label: 'In Press', value: 'In Press' },
          ],
          defaultValue: 'Published',
        }),
        keywords: fields.array(fields.text({ label: 'Keyword' }), {
          label: 'Keywords',
          itemLabel: props => props.value,
        }),
      },
    }),

    books: collection({
      label: 'Books & Monographs',
      slugField: 'id',
      path: 'src/content/books/*',
      format: { data: 'json' },
      schema: {
        id: fields.slug({ name: { label: 'Book ID / Slug' } }),
        isFeatured: fields.checkbox({
          label: 'Tampilkan di Homepage (Featured)',
          description: 'Centang jika buku ini dipilih khusus untuk tampil di homepage (khusus 3 buku pilihan).',
          defaultValue: false,
        }),
        featuredOrder: fields.select({
          label: 'Urutan Posisi Featured di Homepage',
          description: 'Pilih letak posisi buku di homepage (hanya 3 pilihan)',
          options: [
            { label: 'Posisi 1 (Kiri / Buku Utama)', value: '1' },
            { label: 'Posisi 2 (Tengah)', value: '2' },
            { label: 'Posisi 3 (Kanan)', value: '3' },
          ],
          defaultValue: '1',
        }),
        title: fields.text({ label: 'Book Title' }),
        subtitle: fields.text({ label: 'Subtitle' }),
        publisher: fields.text({ label: 'Publisher' }),
        year: fields.integer({ label: 'Publication Year' }),
        isbn: fields.text({ label: 'ISBN' }),
        coverUrl: fields.text({
          label: 'Cover Image URL (Link Eksternal)',
          description: 'Gunakan tautan URL gambar (misal Unsplash, link online) jika tidak mengunggah file',
        }),
        coverGradient: fields.text({ label: 'Cover Gradient Class' }),
        coverImage: fields.image({
          label: 'Cover Image Asset (Upload Foto)',
          description: 'Unggah berkas foto cover buku langsung (disimpan di public/static/images/books/)',
          directory: 'public/static/images/books',
          publicPath: '/static/images/books/',
        }),
        blurb: fields.text({ label: 'Synopsis / Blurb', multiline: true }),
        status: fields.select({
          label: 'Publication Status',
          options: [
            { label: 'Published', value: 'Published' },
            { label: 'Upcoming', value: 'Upcoming' },
          ],
          defaultValue: 'Published',
        }),
        topics: fields.array(fields.text({ label: 'Topic' }), {
          label: 'Key Topics',
          itemLabel: props => props.value,
        }),
        ctaText: fields.text({ label: 'Button Action Text' }),
        ctaUrl: fields.text({ label: 'Marketplace / Order URL' }),
        pages: fields.integer({ label: 'Page Count' }),
        edition: fields.text({ label: 'Edition' }),
        dimensions: fields.text({ label: 'Dimensions' }),
        marketplaceLinks: fields.array(
          fields.object({
            name: fields.text({ label: 'Platform / Store Name' }),
            url: fields.text({ label: 'Link URL' }),
            icon: fields.text({ label: 'Icon Name' }),
          }),
          {
            label: 'Marketplace Links',
            itemLabel: props => props.fields.name.value || 'Link',
          }
        ),
      },
    }),

    blogPosts: collection({
      label: 'Blog Posts & Research Notes',
      slugField: 'slug',
      path: 'src/content/blogPosts/*',
      format: { data: 'json' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug / URL Key' } }),
        title: fields.text({ label: 'Article Title' }),
        excerpt: fields.text({ label: 'Excerpt / Summary', multiline: true }),
        category: fields.text({ label: 'Category' }),
        datetime: fields.datetime({ label: 'Publication Date & Time (Datetime-local)', defaultValue: { kind: 'now' } }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/static/images/posts',
          publicPath: '/static/images/posts/',
        }),
        imageCaption: fields.text({ label: 'Image Caption' }),
        illustrationType: fields.text({ label: 'Illustration Type' }),
        authors: fields.array(
          fields.object({
            name: fields.text({ label: 'Nama Author Lain / Co-Author Name' }),
            avatarImage: fields.image({
              label: 'Upload Foto Co-Author',
              description: 'Unggah file foto profil rekan penulis (tersimpan di public/static/images/authors/)',
              directory: 'public/static/images/authors',
              publicPath: '/static/images/authors/',
            }),
            avatarUrl: fields.text({
              label: 'Atau URL Foto Eksternal',
              description: 'Link URL gambar online jika tidak mengunggah berkas foto',
            }),
            role: fields.text({ label: 'Pangkat / Jabatan (e.g. Co-Author, Assistant Professor)' }),
            affiliation: fields.text({ label: 'Afiliasi / Universitas (e.g. Universitas Nahdlatul Ulama Blitar)' }),
          }),
          {
            label: 'Penulis Tambahan / Co-Authors (Opsional)',
            description: 'Penulis utama (Gautama Sastra Waskita) sudah otomatis sinkron dari Profil. Tambahkan di sini HANYA jika ada rekan penulis tambahan.',
            itemLabel: props => props.fields.name.value || 'Penulis Tambahan',
          }
        ),
        documentFile: fields.file({
          label: 'Attached Working Paper (PDF / Document)',
          directory: 'public/static/docs',
          publicPath: '/static/docs/',
        }),
        mediaFile: fields.file({
          label: 'Attached Media (Video / Audio / Presentation)',
          directory: 'public/static/media',
          publicPath: '/static/media/',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: props => props.value,
        }),
        content: fields.markdoc({
          label: 'Full Markdoc Content (WYSIWYG)',
          options: {
            heading: [2, 3, 4, 5, 6],
            bold: true,
            italic: true,
            strikethrough: true,
            blockquote: true,
            code: true,
            codeBlock: true,
            divider: true,
            link: true,
            table: true,
            orderedList: true,
            unorderedList: true,
            image: {
              directory: 'public/static/images/posts',
              publicPath: '/static/images/posts/',
            },
          },
        }),
      },
    }),

    aboutPillars: collection({
      label: 'About Pillars',
      slugField: 'id',
      path: 'src/content/aboutPillars/*',
      format: { data: 'json' },
      schema: {
        id: fields.slug({ name: { label: 'Pillar ID' } }),
        title: fields.text({ label: 'Pillar Title' }),
        description: fields.text({ label: 'Pillar Description', multiline: true }),
        quote: fields.text({ label: 'Methodological Quote', multiline: true }),
        icon: fields.text({ label: 'Lucide Icon Name' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Focus Tags',
          itemLabel: props => props.value,
        }),
        order: fields.integer({ label: 'Display Order' }),
      },
    }),

    galleryItems: collection({
      label: 'Photo Gallery Items',
      slugField: 'id',
      path: 'src/content/galleryItems/*',
      format: { data: 'json' },
      schema: {
        id: fields.slug({ name: { label: 'Item ID' } }),
        title: fields.text({ label: 'Photo Title' }),
        description: fields.text({ label: 'Context & Description', multiline: true }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Conferences', value: 'Conferences' },
            { label: 'Field Research', value: 'Field Research' },
            { label: 'Teaching', value: 'Teaching' },
            { label: 'Community Service', value: 'Community Service' },
          ],
          defaultValue: 'Conferences',
        }),
        imageUrl: fields.image({
          label: 'Photo Image',
          directory: 'public/static/images/gallery',
          publicPath: '/static/images/gallery/',
        }),
        date: fields.text({ label: 'Date' }),
        location: fields.text({ label: 'Location' }),
        order: fields.integer({ label: 'Display Order' }),
      },
    }),

    martialArts: collection({
      label: 'Beyond Academia / Martial Arts',
      slugField: 'id',
      path: 'src/content/martialArts/*',
      format: { data: 'json' },
      schema: {
        id: fields.slug({ name: { label: 'Discipline ID' } }),
        name: fields.text({ label: 'Discipline Name' }),
        type: fields.text({ label: 'Type / Category' }),
        subtitle: fields.text({ label: 'Subtitle / Rank' }),
        description: fields.text({ label: 'Description', multiline: true }),
        academicParallel: fields.text({ label: 'Academic Synergy & Philosophy', multiline: true }),
        badge: fields.text({ label: 'Badge Label' }),
        iconName: fields.text({ label: 'Icon Name' }),
        order: fields.integer({ label: 'Display Order' }),
        keyPillars: fields.array(fields.text({ label: 'Pillar' }), {
          label: 'Core Pillars',
          itemLabel: props => props.value,
        }),
      },
    }),

    comments: collection({
      label: 'Scholarly Comments & Discussions',
      slugField: 'id',
      path: 'src/content/comments/*',
      format: { data: 'json' },
      columns: ['status', 'userName', 'postTitle'],
      schema: {
        id: fields.slug({ 
          name: { 
            label: 'Comment ID / Slug (Format Terbaca: Status + Nama Pengulas + Cuplikan)',
            description: 'Awalan status: approve-... / pending-... / hiden-... diikuti nama pengulas dan cuplikan komentar.'
          } 
        }),
        status: fields.select({
          label: 'Status Moderasi Komentar',
          description: 'Pilih apakah komentar langsung ditayangkan, menunggu moderasi, atau disembunyikan.',
          options: [
            { label: '✓ Ditayangkan (Approved)', value: 'approved' },
            { label: '⏳ Menunggu Moderasi (Pending)', value: 'pending' },
            { label: '✕ Disembunyikan (Hidden)', value: 'hidden' },
          ],
          defaultValue: 'approved',
        }),
        postUrl: clickableLinkField({
          label: '🔗 Tautan Halaman Artikel (Klik untuk Membuka)',
          description: 'Klik tombol di atas untuk langsung membuka artikel blog yang dikomentari di tab baru.',
        }),
        postTitle: readOnlyField({
          label: 'Judul Artikel Blog',
          description: 'Judul artikel yang dikomentari oleh pengulas (hanya-baca).',
        }),
        postSlug: readOnlyField({
          label: 'Blog Post Slug',
          description: 'Pengenal rute artikel blog (hanya-baca).',
        }),
        userName: readOnlyField({
          label: 'Nama Pengulas (Reviewer Name & Title)',
          description: 'Nama asli pengulas yang dikirimkan (hanya-baca).',
        }),
        userRole: readOnlyField({
          label: 'Peran / Jabatan Akademik (Academic Role)',
          description: 'Peran akademik pengulas (hanya-baca).',
        }),
        institution: readOnlyField({
          label: 'Universitas / Institusi Afiliasi',
          description: 'Institusi tempat pengulas terafiliasi (hanya-baca).',
        }),
        userEmail: readOnlyField({
          label: 'Email Pengulas (Privat / Rahasia)',
          description: 'Alamat email pengulas (hanya-baca).',
        }),
        content: readOnlyField({
          label: 'Isi Komentar / Peer Review',
          description: 'Teks ulasan akademik yang dikirimkan pengulas (hanya-baca).',
          multiline: true,
        }),
        createdAt: readOnlyField({
          label: 'Waktu Komentar Masuk (Timestamp)',
          description: 'Waktu penerimaan komentar di sistem (hanya-baca).',
        }),
        likes: fields.integer({ label: 'Jumlah Suka / Upvotes', defaultValue: 0 }),
        reply: fields.object({
          text: fields.text({ label: 'Isi Balasan Penulis (Author Reply Body)', multiline: true }),
          authorName: fields.text({
            label: 'Nama Penulis yang Menjawab',
            defaultValue: 'Prof. DR. Ir. H. Gautama Sastra Waskita, S.E., B.BA., M.M.',
            description: 'Otomatis terisi nama Prof. Gautama Sastra Waskita. Ubah hanya jika dijawab oleh rekan penulis/co-author lain.',
          }),
          repliedAt: fields.text({
            label: 'Waktu Balasan Disimpan (Reply Timestamp)',
            description: 'Otomatis diisi waktu saat balasan disimpan (contoh: Sep 11, 2026 atau tanggal saat ini).',
          }),
        }, { label: 'Tanggapan / Balasan Penulis (Official Author Reply)' }),
      },
    }),
  },
});
