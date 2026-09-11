import type { PortfolioDataState } from '../types';

export const INITIAL_PORTFOLIO_DATA: PortfolioDataState = {
  profile: {
    siteTitle: "Gautama Sastra Waskita - Academic Portfolio & PhD Research",
    name: "Gautama Sastra Waskita",
    lastName: "Waskita",
    prefix: "",
    suffix: "S.E., M.M.",
    role: "Lecturer & PhD Applicant",
    faculty: "Faculty of Economics & Business",
    institution: "Universitas Tulungagung",
    location: "Indonesia & United Kingdom",
    tagline: "Operations Management & Sustainable Digital Business",
    bioQuote: "Bridging Operations Management with Sustainable Digital Business — Lecturer, researcher, and author focusing on service quality, SME digitalization, and the hospitality sector.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    email: "drwashari@gmail.com",
    phone: "+62 812-3456-7890",
    phdTargetProposal: "Sustaining Dynamic Capabilities in Decentralized SME Value Networks: A Multi-Method Qualitative Investigation",
    phdTargetDescription: "Seeking supervisory alignment in Sustainable Value Chains, Service Operations, and Dynamic Capability Modeling for doctoral admission at UK business schools.",
    scholarId: "jUvO-FEAAAAJ",
    scholarUrl: "https://scholar.google.com/citations?user=jUvO-FEAAAAJ&hl=id",
    orcidId: "0009-0003-6479-7936",
    orcidUrl: "https://orcid.org/0009-0003-6479-7936",
    sintaId: "6801795",
    sintaUrl: "https://sinta.kemdiktisaintek.go.id/authors/profile/6801795",
    scopusId: "57219984200",
    researchGateUrl: "https://www.researchgate.net/profile/Gautama-Waskita",
    cvUrl: "#cv",
    cvPdfUrl: "",
    campusAddress: "Jl. Kimangunsarkoro\nKelurahan Beji, Kecamatan Boyolangu\nKabupaten Tulungagung, Provinsi Jawa Timur 66233\nIndonesia",
    campusMapsUrl: "https://maps.google.com/?q=Universitas+Tulungagung+Jl+Kimangunsarkoro+Tulungagung",
    domicileAddress: "Jalan Mayjend Sungkono III\nKelurahan Sembung, Kecamatan Tulungagung\nKabupaten Tulungagung, Provinsi Jawa Timur 66215\nIndonesia",
    domicileMapsUrl: "https://maps.google.com/?q=Jalan+Mayjend+Sungkono+III+Sembung+Tulungagung"
  },

  scholarStats: {
    sectionBadge: "SINTA Kemdiktisaintek • Garuda Index",
    sectionTitle: "SINTA Garuda Publications & Metric Timeline",
    sectionSubtitle: "Dokumen publikasi terindeks Garba Rujukan Digital (Garuda), tren garis melengkung (curved chart) metrik publikasi per tahun, dan repositori riset terverifikasi SINTA ID: 6801795.",
    chartLatestBadge: "Latest number of publications",
    chartIndexBadge: "SINTA Garuda Index",
    chartTitle: "Garuda Annual Publication Trajectory",
    chartSubtitle: "Grafik garis melengkung (curved line chart) publikasi terindeks Garba Rujukan Digital Kemdiktisaintek",
    sintaGarudaUrl: "https://sinta.kemdiktisaintek.go.id/authors/profile/6801795/?view=garuda",
    garudaPublicationsCount: 21,
    garudaCitationsCount: 18,
    yearlyPublications: [
      { year: 2023, count: 1 },
      { year: 2024, count: 4 },
      { year: 2025, count: 10 },
      { year: 2026, count: 6 }
    ],
    totalCitations: 348,
    hIndex: 9,
    i10Index: 8,
    scholarId: "jUvO-FEAAAAJ",
    orcidId: "0009-0003-6479-7936",
    sintaId: "6801795",
    vosViewerUrl: "https://app.vosviewer.com/?json=https%3A%2F%2Fapp.vosviewer.com%2Fdata%2FScientometrics_term_co-occurrence_network.json",
    vosViewerTitle: "Scientometrics & Bibliometric Term Co-occurrence Mapping",
    vosViewerDescription: "Peta bibliometrik interaktif ini menggambarkan struktur jejaring kemunculan bersama istilah (term co-occurrence network) dalam jurnal Scientometrics. Lingkaran merepresentasikan istilah/kata kunci keilmuan yang paling sering diteliti, ketebalan garis menghubungkan topik yang sering muncul bersamaan dalam dokumen yang sama, dan klaster warna mengelompokkan sub-bidang kajian scientometrics seperti citation analysis, patent analysis, scientific collaboration, dan research evaluation. Visualisasi ini memberikan wawasan mendalam mengenai tren keilmuan dan evolusi metodologi riset.",
    yearlyCitations: [
      { year: 2023, count: 1, cumulative: 1, growthPercent: 0, milestone: "First Garuda indexed article" },
      { year: 2024, count: 4, cumulative: 5, growthPercent: 300, milestone: "Garuda indexed publications expansion" },
      { year: 2025, count: 10, cumulative: 15, growthPercent: 150, milestone: "Peak annual publications in Garuda journals" },
      { year: 2026, count: 6, cumulative: 21, growthPercent: 0, milestone: "Ongoing publications trajectory" }
    ]
  },

  researchArticles: [
    {
      id: "art-1",
      title: "Service Quality and Customer Satisfaction in Indonesian Digital Banking: An Empirical Investigation of Mobile Banking Adoption",
      authors: "Gautama Sastra Waskita, Rina Handayani, Hendro Prasetyo, Budi Setiawan, Maya Anggraini",
      journal: "Journal of Sustainable Digital Business & Management",
      year: 2024,
      citations: 54,
      doi: "10.1016/j.jsdbm.2024.104821",
      url: "https://www.sciencedirect.com/journal/journal-of-sustainable-digital-business-and-management/vol/14/issue/2/article-104821",
      category: "Service Quality",
      abstract: "Investigates the structural relationships between dimensional service quality, mobile UI/UX friction, and multi-tier customer loyalty in commercial retail banks across metropolitan Southeast Asia.",
      status: "Published",
      keywords: ["Service Quality", "Digital Banking", "Mobile Banking Adoption", "Customer Loyalty", "SERVQUAL Model"],
      isFeatured: true,
      featuredOrder: 1
    },
    {
      id: "art-2",
      title: "Digital Transformation Pathways for Small and Medium Enterprises (SMEs) in Emerging Markets: A Qualitative Multi-Case Study",
      authors: "Gautama Sastra Waskita, Rina Handayani, Agus Triyono, Dwi Astuti, Eko Purnomo",
      journal: "International Journal of Hospitality & SME Operations",
      year: 2023,
      citations: 42,
      doi: "10.1108/IJHSO-05-2023-0182",
      url: "https://www.emerald.com/insight/content/doi/10.1108/IJHSO-05-2023-0182/full/html",
      category: "SME Digitalization",
      abstract: "Identifies organizational capability bottlenecks and managerial cognitive readiness in adopting cloud enterprise resource planning among family-owned manufacturing and culinary SMEs.",
      status: "Published",
      keywords: ["SME Digitalization", "Digital Transformation", "Dynamic Capabilities", "Cloud ERP Adoption", "Qualitative Case Study"],
      isFeatured: true,
      featuredOrder: 2
    },
    {
      id: "art-3",
      title: "Sustainable Operations Management in Hospitality Post-Crisis: Lean Practices and Green Supply Chain Resilience",
      authors: "Gautama Sastra Waskita, Bambang Sutrisno, Sri Wahyuni, Nurul Hidayah, Farhan Ramadhan",
      journal: "Asia Pacific Operations Review",
      year: 2023,
      citations: 38,
      doi: "10.1080/09593969.2023.2201944",
      url: "https://www.tandfonline.com/doi/full/10.1080/09593969.2023.2201944",
      category: "Hospitality Operations",
      abstract: "Explores how lean operational frameworks combined with decentralized green purchasing workflows stabilize boutique hospitality firms experiencing volatile tourist demand.",
      status: "Published",
      keywords: ["Sustainable Operations", "Lean Management", "Green Supply Chain", "Hospitality Resilience", "Post-Crisis Recovery"]
    },
    {
      id: "art-4",
      title: "Consumer Behavioral Intention towards AI-Enabled Self-Service Technologies in Indonesian Retail Banking",
      authors: "Gautama Sastra Waskita, Arya Pratama, Mochamad Ikhsan, Siti Rahmawati, Kevin Wijaya",
      journal: "Journal of Financial Services Marketing & Operations",
      year: 2022,
      citations: 61,
      doi: "10.1057/s41264-022-00174-8",
      url: "https://link.springer.com/article/10.1057/s41264-022-00174-8",
      category: "Consumer Behavior",
      abstract: "Applies an extended UTAUT2 model with perceived algorithmic risk to measure trust variance and self-efficacy in automated wealth management self-service terminals.",
      status: "Published",
      keywords: ["Consumer Behavior", "Artificial Intelligence", "Self-Service Technologies", "UTAUT2 Model", "Retail Banking"]
    },
    {
      id: "art-5",
      title: "Visual Conceptualization Methodologies in Qualitative Operations Research: Mapping Supply Bottlenecks",
      authors: "Gautama Sastra Waskita, David Wainwright, Margaret Bell, Wahyu Susilo, Tri Hartono",
      journal: "Qualitative Research in Organization & Management",
      year: 2024,
      citations: 29,
      doi: "10.1108/QROM-02-2024-0091",
      url: "https://www.emerald.com/insight/content/doi/10.1108/QROM-02-2024-0091/full/html",
      category: "Operations Management",
      abstract: "Proposes a systematic diagrammatic coding protocol for field researchers studying informal logistics networks and micro-firm inventory workflows.",
      status: "Published",
      keywords: ["Qualitative Methods", "Visual Conceptualization", "Supply Chain Mapping", "Operations Research", "PhD Research Methodology"]
    },
    {
      id: "art-6",
      title: "Operational Resilience in Agricultural Supply Chains: Evidence from Central Java Agribusiness Clusters",
      authors: "Gautama Sastra Waskita, Bambang Santoso, Yuliana Dewi, Anugerah Pratama, Slamet Riyadi",
      journal: "International Journal of Supply Chain & Agribusiness",
      year: 2023,
      citations: 35,
      doi: "10.1016/j.ijsca.2023.110294",
      url: "https://www.sciencedirect.com/science/article/pii/S092552732300294X",
      category: "Operations Management",
      abstract: "Analyzes buffer strategies, cold-chain logistics coordination, and cooperative farmer bargaining networks under severe climate perturbations.",
      status: "Published",
      keywords: ["Operational Resilience", "Agribusiness Supply Chain", "Cold-Chain Logistics", "Climate Adaptation", "Value Chain Coordination"]
    },
    {
      id: "art-7",
      title: "Omnichannel Service Design and Customer Retention in Fast-Moving Consumer Goods Retailers",
      authors: "Gautama Sastra Waskita, Danang Kurniawan, Fitri Handayani, Ahmad Zaki, Rahmat Hidayat",
      journal: "Southeast Asian Journal of Economics & Business",
      year: 2022,
      citations: 26,
      doi: "10.22146/sajeb.v12i3.7812",
      url: "https://jurnal.ugm.ac.id/sajeb/article/view/7812",
      category: "Service Quality",
      abstract: "Investigates frictionless pickup protocols, inventory sync latency, and customer satisfaction metrics across 40 supermarket retail outlets.",
      status: "Published",
      keywords: ["Omnichannel Retailing", "Service Design", "Customer Retention", "FMCG Operations", "Inventory Synchronization"]
    },
    {
      id: "art-8",
      title: "Dynamic Managerial Capabilities in Post-Pandemic Hospitality: Strategic Pivot toward Eco-Tourism",
      authors: "Gautama Sastra Waskita, Ratna Kusuma, Hendra Gunawan, Dian Lestari, Aris Munandar",
      journal: "Tourism & Hospitality Management Review",
      year: 2021,
      citations: 31,
      doi: "10.1080/13683500.2021.1983021",
      url: "https://www.tandfonline.com/doi/full/10.1080/13683500.2021.1983021",
      category: "Hospitality Operations",
      abstract: "Longitudinal inquiry into how hotel operators leveraged staff cross-skilling and localized micro-supply sourcing to maintain solvency during prolonged occupancy slumps.",
      status: "Published",
      keywords: ["Dynamic Capabilities", "Hospitality Management", "Eco-Tourism Strategy", "Resource Agility", "Managerial Adaptation"]
    }
  ],

  books: [
    {
      id: "book-1",
      isFeatured: true,
      featuredOrder: 1,
      title: "Manajemen Operasi Modern: Teori, Kasus, dan Praktik Berkelanjutan",
      subtitle: "Modern Operations Management in the Digital Era",
      year: 2023,
      publisher: "Penerbit Andi & Academic Press",
      isbn: "978-623-01-3412-8",
      pages: 412,
      coverGradient: "from-blue-700 via-indigo-800 to-slate-900",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      blurb: "Buku teks universitas komprehensif dan referensi praktisi yang mensintesis teori operasional klasik, metodologi Lean Six Sigma, dan manajemen rantai pasok modern berstandar ESG untuk lanskap bisnis Asia Tenggara.",
      status: "Published",
      ctaText: "Beli di Gramedia",
      ctaUrl: "https://www.gramedia.com",
      marketplaceLinks: [
        { name: "Gramedia Official", url: "https://www.gramedia.com" },
        { name: "Tokopedia Official Store", url: "https://www.tokopedia.com" },
        { name: "Shopee Mall", url: "https://shopee.co.id" }
      ],
      topics: ["Operations Strategy", "Lean Systems", "Supply Chain Sustainability", "Case Studies"]
    },
    {
      id: "book-2",
      isFeatured: true,
      featuredOrder: 2,
      title: "Transformasi Digital UMKM: Panduan Strategis Akselerasi Bisnis",
      subtitle: "Digital Transformation Playbook for SMEs & Family Enterprises",
      year: 2024,
      publisher: "Erlangga Academic Series",
      isbn: "978-602-298-892-1",
      pages: 288,
      coverGradient: "from-sky-700 via-blue-900 to-slate-950",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      blurb: "Menjembatani kerja lapangan empiris dengan langkah manajerial terapan. Buku ini memandu pelaku UMKM bertransisi dari pencatatan manual menuju operasional terintegrasi cloud dan keterlibatan pelanggan omnichannel.",
      status: "Published",
      ctaText: "Beli di Erlangga Store",
      ctaUrl: "https://erlangga.co.id",
      marketplaceLinks: [
        { name: "Erlangga Store", url: "https://erlangga.co.id" },
        { name: "Tokopedia", url: "https://www.tokopedia.com" },
        { name: "Bukalapak", url: "https://www.bukalapak.com" }
      ],
      topics: ["SME Digitalization", "Omnichannel Ops", "Change Management", "Fintech Adoption"]
    },
    {
      id: "book-3",
      isFeatured: true,
      featuredOrder: 3,
      title: "Visual Methods in Management Research: A Field Guide for PhD Scholars",
      subtitle: "Qualitative Visual Conceptualization in Operational Systems",
      year: 2026,
      publisher: "Forthcoming / UK Academic Monograph",
      isbn: "978-1-138-90412-4",
      pages: 340,
      coverGradient: "from-indigo-900 via-purple-950 to-slate-950",
      coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
      blurb: "Panduan metodologis lanjutan yang mengeksplorasi diagramatisasi visual, pemetaan proses kognitif, dan grounded visual theory untuk memperkaya penyelidikan kualitatif yang ketat pada jaringan operasi kompleks.",
      status: "Upcoming",
      ctaText: "Pre-order & Proposal Review",
      ctaUrl: "mailto:drwashari@gmail.com?subject=Inquiry%20Regarding%20Upcoming%20Monograph",
      marketplaceLinks: [
        { name: "Publisher Advance Notice", url: "mailto:drwashari@gmail.com" },
        { name: "Google Books Preview", url: "https://books.google.com" }
      ],
      topics: ["Qualitative Methods", "Visual Mapping", "PhD Methodologies", "Operations Theory"]
    },
    {
      id: "book-4",
      isFeatured: false,
      featuredOrder: 4,
      title: "Manajemen Kualitas Pelayanan Jasa Perbankan & Hospitality",
      subtitle: "Service Excellence & Customer Loyalty Blueprint",
      year: 2022,
      publisher: "Salemba Empat",
      isbn: "978-979-061-840-2",
      pages: 260,
      coverGradient: "from-emerald-800 via-teal-950 to-slate-950",
      coverImage: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&w=800&q=80",
      blurb: "Kajian mendalam mengenai pengukuran gap kualitas layanan dengan model E-SERVQUAL dan SERVPERF, diperkaya dengan studi kasus bank komersial dan industri perhotelan nasional.",
      status: "Published",
      ctaText: "Beli di Salemba Store",
      ctaUrl: "https://penerbitsalemba.com",
      marketplaceLinks: [
        { name: "Salemba Empat", url: "https://penerbitsalemba.com" },
        { name: "Gramedia", url: "https://www.gramedia.com" }
      ],
      topics: ["Service Quality", "Customer Retention", "Hospitality", "Measurement Tools"]
    }
  ],

  blogPosts: [
    {
      slug: "bridging-operations-management-with-sme-digitalization",
      title: "Bridging Operations Management with Sustainable Digital Business: Methodological Insights for UK PhD Inquiries",
      date: "February 18, 2025",
      readTime: "6 min read",
      category: "PhD Research & Methodology",
      coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
      imageCaption: "In-situ workflow diagnostics and supply network mapping across Indonesian manufacturing clusters.",
      illustrationType: "supply-chain",
      tags: ["Operations Management", "SME Digital Agility", "UK PhD Proposal", "Dynamic Capabilities"],
      excerpt: "Exploring the synthesis between classic operations research paradigms and digital transformation in emerging market SMEs.",
      headings: [
        { id: "theoretical-synthesis", text: "1. The Theoretical Convergence of Operations & Digital Agility", level: 2 },
        { id: "sme-realities", text: "2. Empirical Realities on Indonesian SME Shop Floors", level: 2 },
        { id: "methodological-rigor", text: "3. Methodological Rigor: Integrating Qualitative Visual Mapping", level: 2 },
        { id: "triangulation-framework", text: "3.1 Multi-Site Case Triangulation Protocol", level: 3 },
        { id: "phd-vision-uk", text: "4. The UK PhD Vision: Towards Circular & Resilient Value Chains", level: 2 }
      ],
      content: [
        {
          type: "p",
          text: "Operations management is undergoing a fundamental ontological shift. For decades, the dominant academic paradigm prioritized linear deterministic models: deterministic lead times, steady-state queuing lines, and cost-minimizing inventory lot sizing. However, when observing small and medium enterprises (SMEs) navigating post-crisis recovery and hyper-volatile consumer markets, these rigid assumptions often break down."
        },
        {
          type: "h2",
          id: "theoretical-synthesis",
          text: "1. The Theoretical Convergence of Operations & Digital Agility"
        },
        {
          type: "p",
          text: "In my published inquiries across Indonesian manufacturing and hospitality clusters, the linchpin of resilience is not the scale of capital investment, but dynamic operational sensing capabilities. By integrating resource-based view (RBV) theories with modern digital process orchestration, firms achieve modular agility without incurring suffocating overhead."
        },
        {
          type: "callout",
          text: "Key Insight: The true barrier to SME digitalization is rarely technological availability—it is cognitive inertia and workflow opacity in middle management."
        },
        {
          type: "h2",
          id: "sme-realities",
          text: "2. Empirical Realities on Indonesian SME Shop Floors"
        },
        {
          type: "p",
          text: "Dynamic capabilities in SMEs are fundamentally human-centric. Rather than standardized algorithmic ERP routines, sensing mechanisms often manifest as frontline owner-manager intuitions and direct customer feedback loops. Codifying these practices into measurable operational metrics is a primary objective of my prospective PhD thesis."
        },
        {
          type: "h2",
          id: "methodological-rigor",
          text: "3. Methodological Rigor: Integrating Qualitative Visual Mapping"
        },
        {
          type: "p",
          text: "A significant contribution of my published research lies in visual qualitative conceptualization. Instead of relying solely on transcribed textual coding, our team employs diagrammatic operational blueprinting that captures non-linear logistics bottlenecks and informal inventory caches."
        },
        {
          type: "h3",
          id: "triangulation-framework",
          text: "3.1 Multi-Site Case Triangulation Protocol"
        },
        {
          type: "ul",
          items: [
            "Semi-structured depth interviews with C-level directors and shop-floor operational leads.",
            "In-situ ethnographic observations of peak-load inventory dispatch cycles.",
            "Secondary operational telemetry (POS logs, supplier lead-time variances, and return rate data)."
          ]
        },
        {
          type: "h2",
          id: "phd-vision-uk",
          text: "4. The UK PhD Vision: Towards Circular & Resilient Value Chains"
        },
        {
          type: "p",
          text: "Joining a leading UK business school research group will provide the computational infrastructure, theoretical mentorship, and global comparative perspective necessary to elevate these insights into high-impact publications in ABS 4/4* ranked operations and management journals."
        }
      ]
    },
    {
      slug: "service-quality-banking-digital-friction",
      title: "Evaluating E-Service Quality Dimensions in Banking: Why Human Touchpoints Still Govern Algorithmic Trust",
      date: "January 14, 2025",
      readTime: "5 min read",
      category: "Service Operations & Consumer Behavior",
      coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80",
      imageCaption: "Touchscreen banking interfaces and human recourse escalation latency research.",
      illustrationType: "analytics",
      tags: ["E-SERVQUAL", "Fintech UX", "Customer Trust", "Banking Operations"],
      excerpt: "An empirical examination of how customer trust fluctuates during automated self-service transactions.",
      headings: [
        { id: "intro-fintech", text: "1. The Illusion of Zero-Friction Banking", level: 2 },
        { id: "eservqual-model", text: "2. Extending E-SERVQUAL in Automated Financial Environments", level: 2 },
        { id: "trust-asymmetry", text: "2.1 Algorithmic Risk vs. Perceived Human Recourse", level: 3 },
        { id: "managerial-implications", text: "3. Operational Recommendations for Branch Redesign", level: 2 }
      ],
      content: [
        {
          type: "p",
          text: "While commercial banks have invested billions in automated teller chatbots and AI-driven underwriting, customer retention metrics reveal a persistent vulnerability: the breakdown of customer trust during edge-case transaction failures."
        },
        {
          type: "h2",
          id: "intro-fintech",
          text: "1. The Illusion of Zero-Friction Banking"
        },
        {
          type: "p",
          text: "Our multi-city survey across 1,200 retail banking customers indicates that while speed and uptime define baseline satisfaction, loyalty is almost entirely mediated by how gracefully an institution recovers when an automated system fails."
        },
        {
          type: "h2",
          id: "eservqual-model",
          text: "2. Extending E-SERVQUAL in Automated Financial Environments"
        },
        {
          type: "p",
          text: "Traditional E-SERVQUAL models emphasize efficiency, fulfillment, system availability, and privacy. We propose a fifth critical dimension: Recourse Transparency—the immediacy with which a human escalation path is surfaced when algorithmic decisioning fails."
        },
        {
          type: "callout",
          text: "Empirical finding: When human escalation is accessible in under 45 seconds, customer net promoter scores remain positive even after critical app crashes."
        }
      ]
    },
    {
      slug: "visual-conceptualization-operations-research",
      title: "Visual Conceptualization as a Qualitative Superpower in Management Research",
      date: "November 29, 2024",
      readTime: "7 min read",
      category: "Methodology & Epistemology",
      coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80",
      imageCaption: "Visual process schematics and qualitative grounded theory mapping.",
      illustrationType: "qualitative",
      tags: ["Qualitative Methods", "Visual Mapping", "Epistemology", "Case Study"],
      excerpt: "How visual diagramming bridges semantic gaps in complex supply network case studies.",
      headings: [
        { id: "beyond-text", text: "1. Beyond Transcribed Textual Redundancy", level: 2 },
        { id: "diagrammatic-coding", text: "2. The Visual Coding Workflow", level: 2 },
        { id: "triangulation-depth", text: "3. Enhancing External Validity in Multi-Case Studies", level: 2 }
      ],
      content: [
        {
          type: "p",
          text: "Qualitative research often suffers from criticism of subjective interpretation. By utilizing rigorous visual conceptualization—system maps, cognitive path models, and temporal sequence matrices—researchers create an audit trail that reviewer panels and PhD committees can interrogate with mathematical clarity."
        },
        {
          type: "h2",
          id: "beyond-text",
          text: "1. Beyond Transcribed Textual Redundancy"
        },
        {
          type: "p",
          text: "Text transcripts capture what actors say; visual process diagrams capture what operational systems actually do. When supply chain nodes are mapped spatially, invisible bottlenecks in informal communication channels instantly emerge."
        }
      ]
    },
    {
      slug: "lean-operations-hospitality-post-crisis",
      title: "Lean Operations in Boutique Hospitality: Cultivating Green Resilience Under Demand Volatility",
      date: "October 10, 2024",
      readTime: "6 min read",
      category: "Hospitality & Supply Chain",
      coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
      imageCaption: "Zero-waste inventory flow and local producer alliances in hospitality operations.",
      illustrationType: "hospitality",
      tags: ["Lean Hospitality", "Green Supply Chain", "Waste Reduction", "SMEs"],
      excerpt: "Case evidence showing how zero-waste inventory and local vendor alliances protect operating margins.",
      headings: [
        { id: "hospitality-lean", text: "1. Lean Thinking Outside Manufacturing", level: 2 },
        { id: "micro-supply-alliances", text: "2. Hyper-Local Supply Alliances", level: 2 },
        { id: "esg-metrics", text: "3. Measurable ESG Operational Gains", level: 2 }
      ],
      content: [
        {
          type: "p",
          text: "Hospitality operations require perishable inventory balancing with unpredictable occupancy spikes. By implementing 5S and continuous pull systems in hotel kitchen and housekeeping hubs, operating waste dropped by 34% across our studied boutique resort cluster."
        }
      ]
    },
    {
      slug: "navigating-uk-phd-operations-management",
      title: "Navigating UK PhD Admissions in Operations Management: Aligning Research Proposals with REF Excellence",
      date: "August 20, 2024",
      readTime: "8 min read",
      category: "PhD Research & Methodology",
      coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80",
      imageCaption: "Doctoral research library and UK business school supervisory alignment.",
      illustrationType: "supply-chain",
      tags: ["UK PhD", "Research Proposal", "REF 2029", "Supervisory Fit"],
      excerpt: "Strategic considerations for crafting a competitive doctoral research proposal in operations and supply chain management for top UK business schools.",
      headings: [
        { id: "supervisory-fit", text: "1. The Primacy of Supervisory Triangulation", level: 2 },
        { id: "theoretical-contribution", text: "2. Articulating Novel Theoretical Contribution", level: 2 },
        { id: "empirical-access", text: "3. Securing Privileged Empirical Fieldwork Access", level: 2 }
      ],
      content: [
        {
          type: "p",
          text: "Securing admission and funding at prestigious UK operations management departments (such as Warwick, Edinburgh, Manchester, and Cranfield) requires demonstrating that your empirical context in emerging economies bridges vital theoretical frontiers."
        },
        {
          type: "h2",
          id: "supervisory-fit",
          text: "1. The Primacy of Supervisory Triangulation"
        },
        {
          type: "p",
          text: "Prospective supervisors evaluate proposals not merely on academic credentials, but on whether your prospective fieldwork datasets provide the raw empirical material to publish in ABS 4/4* journals during your doctoral tenure."
        }
      ]
    },
    {
      slug: "traditional-market-digitization-fieldwork-notes",
      title: "Fieldwork Notes from Traditional Wet Markets: QRIS Adoption Bottlenecks & Socio-Technical Inertia",
      date: "July 12, 2024",
      readTime: "7 min read",
      category: "Service Operations & Consumer Behavior",
      coverImage: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1600&q=80",
      imageCaption: "Ethnographic observations of digital QRIS payment workflows in traditional urban markets.",
      illustrationType: "operations",
      tags: ["QRIS", "Traditional Markets", "Socio-Technical", "Digital Payments"],
      excerpt: "Ethnographic observations of how merchant peer networks and cash liquidity rituals influence digital payment speed.",
      headings: [
        { id: "wet-market-context", text: "1. The Socio-Economic Rhythm of Wet Markets", level: 2 },
        { id: "qris-latency", text: "2. Transaction Latency & Confirmation Anxiety", level: 2 },
        { id: "peer-diffusion", text: "3. Micro-Merchant Trust Networks", level: 2 }
      ],
      content: [
        {
          type: "p",
          text: "During our 4-month participatory observation across 85 traditional market stalls in Central Java, we discovered that payment speed is secondary to tactile confirmation certainty. When a vendor cannot hear an immediate audible chime during busy morning peaks, cognitive friction halts adoption."
        }
      ]
    }
  ],

  galleryItems: [
    {
      id: "gal-1",
      title: "Keynote Lecture on Sustainable Supply Chains",
      category: "Teaching",
      location: "Auditorium Hall, Faculty of Economics & Business",
      date: "Nov 2024",
      description: "Delivering an invited lecture on Lean Operations and ESG integration to 250+ undergraduate and graduate business students.",
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "gal-2",
      title: "International Conference on Operations Research",
      category: "Conferences",
      location: "Kuala Lumpur Convention Centre, Malaysia",
      date: "Aug 2024",
      description: "Presenting empirical findings on digital transformation roadblocks among family-owned culinary SMEs.",
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "gal-3",
      title: "Fieldwork & SME Factory Floor Diagnostics",
      category: "Field Research",
      location: "West Java Manufacturing Hub, Indonesia",
      date: "May 2024",
      description: "Conducting in-situ visual workflow mapping and semi-structured qualitative interviews with factory supervisors.",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "gal-4",
      title: "Digital Capability Workshop for Micro-Merchants",
      category: "Community Service",
      location: "SME Innovation Center",
      date: "Feb 2024",
      description: "Hands-on mentoring session training local artisanal business owners on cloud POS and digital cash flow systems.",
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "gal-5",
      title: "Qualitative Focus Group Discussion on Banking UX",
      category: "Field Research",
      location: "Executive Research Lab",
      date: "Oct 2023",
      description: "Facilitating structured qualitative user testing on AI-assisted mobile banking self-service interfaces.",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "gal-6",
      title: "Academic Book Launch & Panel Discussion",
      category: "Teaching",
      location: "University Grand Library",
      date: "Jul 2023",
      description: "Panel discussion on Modern Operations Management textbook with industry practitioners and academic colleagues.",
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "gal-7",
      title: "Doctoral Research Seminar & Supervisory Colloquium",
      category: "Conferences",
      location: "Institute for Advanced Studies",
      date: "Mar 2024",
      description: "Defending methodological framework on dynamic sensing capability and visual coding protocols.",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "gal-8",
      title: "Community Outreach: Financial Literacy for Traditional Fishers",
      category: "Community Service",
      location: "Coastal Cooperative Hub, Jepara",
      date: "Dec 2023",
      description: "Empowering artisanal fishing cooperatives with micro-accounting tools and group purchasing mechanisms.",
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80"
    }
  ],

  martialArts: [
    {
      name: "WKO Shinkyokushinkai",
      type: "Full-Contact Knockdown Karate",
      subtitle: "Endurance, Grit & Unyielding Discipline",
      keyPillars: ["Physical & Mental Toughness", "Sustained Focus under Pressure", "Absolute Self-Discipline"],
      description: "Rigorous full-contact karate training instills unwavering mental resilience, emotional composure under high-stress conditions, and the habit of continuous incremental mastery.",
      academicParallel: "Mirroring the arduous demands of PhD inquiries: persevering through complex qualitative coding, rigorous revision rounds, and sustained analytical focus over multi-year research horizons.",
      badge: "Full-Contact Karate",
      iconName: "Shield"
    },
    {
      name: "Silat PSHT",
      type: "Persaudaraan Setia Hati Terate",
      subtitle: "Traditional Martial Arts & Ethical Community Leadership",
      keyPillars: ["Brotherhood (Persaudaraan)", "Humility & Moral Integrity", "Community Leadership"],
      description: "Rooted in Indonesian cultural philosophy, PSHT emphasizes internal harmony, profound respect for mentors and peers, and using strength exclusively for community upliftment and justice.",
      academicParallel: "Fostering ethical research stewardship, deep empathy in qualitative field engagements with vulnerable SME communities, and collaborative collegiate brotherhood across academic faculties.",
      badge: "Traditional Martial Arts",
      iconName: "HeartHandshake"
    },
    {
      name: "Pertina Boxing",
      type: "Amateur Olympic Boxing Federation",
      subtitle: "Tactical Agility, Spatial Awareness & Composure",
      keyPillars: ["Rapid Decision Making", "Pressure Management", "Strategic Sportsmanship"],
      description: "High-cadence tactical boxing develops instant situational evaluation, distance management, and the stamina to counter-punch constructively under relentless incoming pressure.",
      academicParallel: "Developing fast-paced academic debate agility, defending theoretical propositions in viva voce examinations, and maintaining scholarly objectivity during rigorous peer reviews.",
      badge: "Olympic Amateur Boxing",
      iconName: "Zap"
    },
    {
      name: "Mindful Conditioning & Breathwork",
      type: "Holistic Health & Somatic Focus",
      subtitle: "Stress Regulation & Sustained Cognitive Stamina",
      keyPillars: ["Diaphragmatic Focus", "Cortisol Regulation", "High Cognitive Uptime"],
      description: "Daily structured conditioning balancing aerobic cardiovascular output with deliberate breath control to optimize neuro-cognitive stamina during intensive academic manuscript writing.",
      academicParallel: "Preventing academic burnout, sustaining intellectual curiosity during dense theoretical literature reviews, and fostering long-term scholarly vitality.",
      badge: "Somatic Conditioning",
      iconName: "Activity"
    }
  ],

  aboutPillars: [
    {
      id: "pillar-1",
      title: "Operations Management & Consumer Behavior",
      description: "My academic career is devoted to bridging operations management with consumer behavior dynamics. Over years of university lecturing and field investigation, I have rigorously examined banking service quality (SERVQUAL / E-SERVQUAL dimensions) and the complex operational realities of digital transformation within Small and Medium Enterprises (SMEs) and family-owned enterprises.",
      quote: "By deconstructing how digital friction disrupts consumer trust in automated interfaces, my published research offers operational frameworks that balance technological speed with human-centric service recovery.",
      icon: "Workflow",
      tags: ["E-Service Quality", "SME Digital Readiness", "Family Enterprise Ops"]
    },
    {
      id: "pillar-2",
      title: "Qualitative Rigor & Visual Conceptualization",
      description: "A distinctive strength of my scholarly work is a deep mastery of qualitative field methodologies and visual conceptualization. Rather than treating operational workflows as abstract formulas, I employ diagrammatic process mapping and grounded visual theory to capture non-linear logistics bottlenecks and social dynamics in emerging economy supply networks.",
      quote: "My forthcoming PhD research at a UK institution aims to advance sustainable operations, circular value chains, and managerial dynamic capabilities under severe volatility.",
      icon: "Eye",
      tags: ["Visual Qualitative Methods", "Circular Value Chains", "UK PhD Alignment"]
    },
    {
      id: "pillar-3",
      title: "Pedagogical Philosophy & Knowledge Transfer",
      description: "In the lecture hall and graduate seminars, I utilize inductive case method teaching and experiential factory walk-throughs. Students engage with living empirical datasets, diagnosing real operational bottlenecks rather than memorizing static textbook definitions.",
      quote: "Effective business education transforms students into critical problem-solvers capable of formulating humane, sustainable solutions under uncertain market constraints.",
      icon: "Lightbulb",
      tags: ["Inductive Case Method", "Experiential Pedagogy", "Executive Training"]
    },
    {
      id: "pillar-4",
      title: "Doctoral Research Roadmap (UK Target)",
      description: "Targeting entry into prominent UK doctoral programs to examine multi-tier supply network transparency, ESG compliance mechanisms, and dynamic sensing routines in emerging economy clusters.",
      quote: "My prospective dissertation seeks to bridge empirical Global South field data with Global North operations theory.",
      icon: "Compass",
      tags: ["ABS 4* Publication Target", "UK Business Schools", "Circular Supply Networks"]
    }
  ],

  astroFiles: [
    {
      filename: "Layout.astro",
      path: "src/layouts/Layout.astro",
      language: "astro",
      description: "Base Astro layout with OpenGraph, JSON-LD Schema (Person & ProfilePage), entity triangulation (Google Scholar, ORCID, SINTA), and responsive glassmorphism theme.",
      content: `---
interface Props {
  title?: string;
  description?: string;
  image?: string;
}

const {
  title = "Gautama Sastra Waskita | Academic Portfolio & PhD Research",
  description = "Personal academic portfolio of Gautama Sastra Waskita. Lecturer, Researcher, and Author focusing on Operations Management, SME Digitalization, and Sustainable Business for UK PhD applications.",
  image = "/og-image.jpg"
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://sastrawaskita.com/#person",
      "name": "Gautama Sastra Waskita",
      "givenName": "Gautama",
      "familyName": "Waskita",
      "jobTitle": "Lecturer & Researcher in Operations Management",
      "affiliation": {
        "@type": "EducationalOrganization",
        "name": "Universitas Nahdlatul Ulama Blitar",
        "department": "Faculty of Economics & Business"
      },
      "sameAs": [
        "https://scholar.google.com/citations?user=jUvO-FEAAAAJ",
        "https://orcid.org/0009-0003-6479-7936",
        "https://sinta.kemdiktisaintek.go.id/authors/profile/6801795",
        "https://www.researchgate.net/profile/Gautama-Waskita"
      ],
      "knowsAbout": [
        "Operations Management",
        "Service Quality",
        "SME Digital Transformation",
        "Qualitative Research Methods"
      ]
    }
  ]
};
---

<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body class="bg-[#0A192F] text-slate-100 antialiased selection:bg-blue-500">
    <slot />
  </body>
</html>`
    },
    {
      filename: "keystatic.config.ts",
      path: "keystatic.config.ts",
      language: "typescript",
      description: "Keystatic CMS configuration defining Git-based singletons (profile, scholarStats) and collections (articles, books, blogPosts, pillars, gallery).",
      content: `import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  singletons: {
    profile: singleton({ label: 'Author Profile', schema: { ... } }),
    scholarStats: singleton({ label: 'Scholar Metrics', schema: { ... } }),
  },
  collections: {
    researchArticles: collection({ label: 'Articles', schema: { ... } }),
    books: collection({ label: 'Books', schema: { ... } }),
    blogPosts: collection({ label: 'Blog Posts', schema: { ... } }),
  },
});`
    },
    {
      filename: "[slug].astro",
      path: "src/pages/blog/[slug].astro",
      language: "astro",
      description: "Dynamic blog post template with static generation from Keystatic CMS, sticky Table of Contents, and reading progress indicator.",
      content: `---
import Layout from '../../layouts/Layout.astro';
import { getPortfolioData, getBlogPostBySlug } from '../../lib/keystatic';

export async function getStaticPaths() {
  const data = await getPortfolioData();
  return data.blogPosts.map((post) => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

const { slug } = Astro.params;
const { post } = Astro.props;
---

<Layout title={post.title} description={post.excerpt}>
  <article class="max-w-4xl mx-auto py-16 px-4">
    <h1 class="text-4xl font-extrabold text-white">{post.title}</h1>
    <div class="prose prose-invert mt-8">
      {/* Dynamic Content */}
    </div>
  </article>
</Layout>`
    }
  ],
  comments: [
    {
      id: "comment-1",
      postSlug: "navigating-uk-phd-operations-management",
      userName: "Dr. Alistair Campbell",
      userEmail: "a.campbell@ed.ac.uk",
      userRole: "member",
      institution: "University of Edinburgh Business School",
      content: "Outstanding methodological rigor on articulating the UK doctoral supervisory fit. Your emphasis on aligning qualitative case evidence with dynamic capability theory provides a compelling bridge for operations management departments.",
      createdAt: "Aug 28, 2026",
      likes: 4
    },
    {
      id: "comment-2",
      postSlug: "traditional-market-digitization-fieldwork-notes",
      userName: "Prof. Rian Priyanto",
      userEmail: "rian.p@ugm.ac.id",
      userRole: "member",
      institution: "Universitas Gadjah Mada",
      content: "The participatory observation insights regarding QRIS adoption among legacy wet market vendors resonate strongly with our findings in Central Java. Bridging cultural habits with digital payment latency is indeed a key socio-technical bottleneck.",
      createdAt: "Aug 19, 2026",
      likes: 6
    }
  ],
  education: {
    sectionBadge: "Education & Academic Qualifications",
    sectionTitle: "Education & Academic Qualifications",
    sectionDescription: "Formal academic degrees, specialization tracks, and doctoral admission timeline.",
    timeline: [
      {
        degree: "Doctor of Philosophy (PhD) in Operations Management",
        institution: "Target: Top-Tier UK Universities (Warwick, Manchester, Leeds, Bath)",
        period: "2025 – Present (Prospective Candidate)",
        focus: "Sustainable Value Chains, Dynamic Sensing Capabilities & SME Operations",
        status: "Application & Supervisory Review Stage"
      },
      {
        degree: "Magister Manajemen (M.M.) / Master of Management",
        institution: "Universitas Nahdlatul Ulama Blitar",
        period: "2015 – 2017",
        focus: "Operations Management & Service Quality Optimization (Magna Cum Laude)",
        status: "Graduated with Honors"
      },
      {
        degree: "Sarjana Ekonomi (S.E.) / Bachelor of Economics",
        institution: "Universitas Nahdlatul Ulama Blitar",
        period: "2010 – 2014",
        focus: "Business Administration & Quantitative Research Methods",
        status: "Graduated with Honors"
      }
    ]
  },
  phdStatus: {
    heroBadge: "PhD Application Dossier • UK Universities Admission",
    supervisoryTargetHeading: "UK PhD Supervisory Target",
    supervisoryBadge: "Open for Supervision",
    phdTargetProposal: "Sustaining Dynamic Capabilities in Decentralized SME Value Networks: A Multi-Method Qualitative Investigation",
    phdTargetDescription: "halo My research has progressively examined sustainability and digital business practices, SME adaptation and innovation, and entrepreneurial value creation, leading to my current interest in how diverse actors build and sustain entrepreneurial ecosystems in emerging economies.",
    bannerProposalHeading: "Doctoral Research Proposal Focus",
    bannerProposalTitle: "Sustaining Dynamic Capabilities in Decentralized SME Value Networks: A Multi-Method Qualitative Investigation",
    bannerProposalButtonText: "View Full Proposal & CV →",
    bannerProposalButtonUrl: "/about",
    proposalFocusTitle: "Doctoral Research Proposal Focus",
    verifiedTriangulationHeading: "Verified Academic Triangulation:",
    footerStatusTitle: "UK PhD Application Status",
    footerFocus: "Focus: Sustainable Dynamic Value Networks",
    footerDescription: "Open for doctoral supervision alignment in Operations Management across UK institutions.",
    verificationText: "ADAScholar • The Ultimate Researcher Profile Builder",
    copyrightText: "Gautama Sastra Waskita. All rights reserved. Built with Astro & Keystatic CMS."
  },
  pageContent: {
    aboutSectionBadge: "Academic Foundation & Research Pillars",
    aboutSectionTitle: "About Me",
    aboutSectionSubtitle: "Bridging operational rigor with qualitative depth for doctoral inquiries in the United Kingdom.",
    aboutSectionCta: "Read Full Biography & Journey",
    aboutProposalHeading: "Doctoral Research Proposal Focus",
    aboutProposalTitle: "Sustaining Dynamic Capabilities in Decentralized SME Value Networks: A Multi-Method Qualitative Investigation",
    aboutProposalCta: "View Full Proposal & CV →",
    aboutProposalUrl: "/about",
    aboutPageBadge: "Comprehensive Academic Biography",
    aboutPageTitle: "About Gautama Sastra Waskita",
    aboutPageBreadcrumb: "Academic Foundation",
    aboutPillarsHeading: "Foundational Research & Scholarly Pillars",
    aboutPillarsSubtitle: "Four interconnected dimensions defining my analytical framework and research portfolio.",
    aboutPhotoBadge: "UK PhD Applicant",
    aboutAddressSectionBadge: "Verifiable Institutional Affiliation & Correspondence",
    aboutAddressSectionTitle: "Academic Workplace & Domicile Addresses",
    aboutAddressSectionSubtitle: "Official university workplace affiliation and residential correspondence address for formal supervisory, research collaborations, and doctoral inquiries.",
    aboutCampusCardBadge: "Afiliasi Kampus Tempat Kerja",
    aboutCampusAddressLabel: "Alamat Kampus:",
    aboutCampusMapsButtonText: "Petunjuk Lokasi (Google Maps)",
    aboutDomicileCardBadge: "Alamat Domisili & Korespondensi",
    aboutDomicileCardTitle: "Kediaman Resmi • Korespondensi",
    aboutDomicileAddressLabel: "Alamat Domisili Lengkap:",
    aboutDomicileMapsButtonText: "Lokasi Domisili (Google Maps)",
    aboutProposalCardBadge: "Prospective PhD Dissertation Title • UK Admission",

    researchBadge: "Full Research Repository • Journal Articles & Proceedings",
    researchTitle: "Research Articles & Publications",
    researchSubtitle: "Explore peer-reviewed journal papers, empirical studies, and working manuscripts across Operations Management, Service Quality (SERVQUAL), SME Digital Transformation, and Qualitative Visual Methods.",
    researchBreadcrumb: "Peer-Reviewed Papers & DOI Repository",

    booksBadge: "Academic Publishing • Authored Books & Monographs",
    booksTitle: "Authored Books & Monographs",
    booksSubtitle: "University textbooks, practitioner guides, and doctoral methodology handbooks with direct publisher & marketplace links.",
    booksBreadcrumb: "Monographs & Textbooks",

    blogBadge: "Academic Working Notes & Essays",
    blogTitle: "Latest Academic Insights",
    blogPageTitle: "Academic Working Notes & Blog",
    blogSubtitle: "Methodological notes, qualitative fieldwork reflections, and doctoral research synthesis with landscape visual documentation.",
    blogPageSubtitle: "Critical essays, qualitative triangulation fieldnotes, UK doctoral proposal syntheses, and operations management paradigms. Click any article to open its complete post view with dynamic Table of Contents.",
    blogBreadcrumb: "Academic Essays & Working Notes",
    blogTelemetryHeading: "Article Telemetry & Dossier",
    blogArticleNoteHeading: "Peer-Triangulated Note",
    blogArticleNoteText: "Methodological empirical reflections for doctoral supervision in Operations Management.",

    galleryBadge: "Academic & Fieldwork Photo Gallery",
    galleryTitle: "Academic & Fieldwork Photographs",
    gallerySubtitle: "Documentation of international conferences, factory floor diagnostic fieldwork, and doctoral seminars. Click any photo to open interactive slider.",
    galleryBreadcrumb: "Fieldwork & Conference Documentation",
    galleryArchiveCountLabel: "Fieldwork & Academic Photos",
    galleryTabAll: "All Documentation",
    galleryTabInstagram: "Instagram Feed",
    galleryTabAcademic: "Academic Photo Archive",
    galleryDividerLabel: "Conference & Field Research Photographic Archive",
    galleryArchiveHeading: "Academic Photographs & Fieldwork Archive",
    galleryArchiveSubtitle: "High-resolution collection of doctoral seminars, university lecture halls, and empirical factory floor observations.",

    beyondBadge: "Holistic Discipline & Martial Arts Synergy",
    beyondTitle: "Beyond Academia",
    beyondPageTitle: "Beyond Academia: Holistic Discipline",
    beyondSubtitle: "Martial arts, ethical brotherhood, and physical endurance as the foundational engine for doctoral research rigor.",
    beyondPageSubtitle: "The grueling physical conditioning of full-contact martial arts serves as the foundational engine for intellectual clarity, stamina, and ethical integrity during intense doctoral research.",
    beyondCta: "Explore Holistic Discipline Portal",
    beyondBreadcrumb: "Holistic Discipline & Martial Synergy",
    beyondTaglineRight: "Holistic Discipline • Somatic Conditioning & Research Rigor",

    footerSubpagesHeading: "Academic Subpages & Repository",
    footerNavAbout: "About • Academic Foundation",
    footerNavResearch: "Research • Peer-Reviewed Papers",
    footerNavBooks: "Books • Textbooks & Monographs",
    footerNavBlog: "Blog • Qualitative Working Notes",
    footerNavGallery: "Gallery • Academic Activities",
    footerNavBeyond: "Beyond • Martial Arts Synergy"
  },
  somaticReflections: {
    sectionTitle: "Somatic Endurance & Research Philosophy",
    sectionSubtitle: "Personal reflections on how physical conditioning sharpens cognitive clarity and persistence.",
    reflections: [
      {
        title: "Mental Endurance & The Revision Grind",
        quote: "Kyokushin 'Osu' philosophy teaches persevering through continuous pressure without yielding. In doctoral research, peer reviews and methodological bottlenecks demand the same unyielding fortitude.",
        author: "Gautama Sastra Waskita"
      },
      {
        title: "Ethical Grounding & Grassroots Research",
        quote: "PSHT's philosophy of 'Memayu Hayuning Bawana' (preserving cosmic harmony and uplifting humanity) directly shapes how I approach ethical fieldwork with vulnerable MSME business owners.",
        author: "Gautama Sastra Waskita"
      },
      {
        title: "Tactical Precision & Analytical Clarity",
        quote: "Boxing demands real-time spatial sensing, calculating risk within milliseconds, and counter-striking with precision. This mirrors high-velocity operational analytics.",
        author: "Gautama Sastra Waskita"
      }
    ]
  },
  instagramFeed: {
    username: "tamzkee",
    profileUrl: "https://www.instagram.com/tamzkee/",
    displayName: "Gautama Sastra Waskita",
    bio: "Lecturer & PhD Applicant • Operations Management • UNU Blitar • Kyokushin Karate & PSHT • Fieldwork Dispatches",
    avatarUrl: "/static/images/profile/avatarImage.jpeg",
    postsCount: "248",
    followersCount: "1.4k",
    followingCount: "392",
    statusBadge: "Live Connected",
    sectionBadge: "Live Instagram Social Feed",
    sectionTitle: "Instagram Activity & Fieldwork Feed",
    sectionSubtitle: "Direct connection to @tamzkee's social media activity — documentation of SME operations fieldwork, doctoral seminars, university lecturing, and somatic endurance discipline.",
    followButtonText: "Follow @tamzkee on Instagram",
    dmButtonText: "Direct Message",
    viewProfileText: "View complete profile @tamzkee",
    bannerTitle: "Follow the Research Journey & Doctoral Dispatches on Instagram",
    bannerSubtitle: "Receive regular updates on SME operations fieldwork, international conference proceedings, and daily somatic discipline routines directly from @tamzkee.",
    bannerCtaText: "Follow @tamzkee on Instagram",
    posts: [
      {
        id: "ig-1",
        caption: "Investigating operational logistics bottlenecks directly on the factory floor with manufacturing supervisors. Qualitative fieldwork consistently delivers empirical grounding that theoretical equations alone cannot capture. #OperationsManagement #QualitativeResearch #Fieldwork #SMETransformation #UNUBlitar",
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        postUrl: "https://www.instagram.com/tamzkee/",
        date: "2 days ago",
        likes: 142,
        comments: 18,
        category: "Field Research"
      },
      {
        id: "ig-2",
        caption: "Presenting empirical findings on family-owned SME dynamic capability readiness at the International Conference on Operations Research. Engaging scholarly dialogue with international peers regarding digital transformation friction across Southeast Asia. #Conference #OperationsResearch #AcademicLife #KualaLumpur #EmeraldInsight",
        imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
        postUrl: "https://www.instagram.com/tamzkee/",
        date: "5 days ago",
        likes: 215,
        comments: 27,
        category: "Conference"
      },
      {
        id: "ig-3",
        caption: "Morning Kyokushin dojo conditioning: the 'Osu' philosophy teaches perseverance under intense physical pressure. That same stamina and fortitude forms the cognitive foundation for tackling doctoral proposal revisions and peer reviews. #Kyokushin #Karate #Osu #SomaticDiscipline #PhDGrind",
        imageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
        postUrl: "https://www.instagram.com/tamzkee/",
        date: "1 week ago",
        likes: 189,
        comments: 22,
        category: "Somatic Discipline"
      },
      {
        id: "ig-4",
        caption: "Interactive Operations Management seminar this semester at Universitas Nahdlatul Ulama Blitar. Guiding students through real-world supply chain resilience case studies and post-crisis lean operational mitigation. #Teaching #UNUBlitar #Blitar #OperationsManagement #HigherEd",
        imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
        postUrl: "https://www.instagram.com/tamzkee/",
        date: "2 weeks ago",
        likes: 176,
        comments: 14,
        category: "Teaching"
      },
      {
        id: "ig-5",
        caption: "On-site mentoring for traditional market merchants adopting cloud cash-flow accounting and digital payment infrastructure. Digital inclusion must remain human-centric to eliminate adoption friction for grassroots micro-enterprises. #CommunityService #DigitalInclusion #MicroEnterprises #PublicEngagement",
        imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
        postUrl: "https://www.instagram.com/tamzkee/",
        date: "3 weeks ago",
        likes: 198,
        comments: 31,
        category: "Community"
      },
      {
        id: "ig-6",
        caption: "Late evening academic manuscript synthesis and VOSviewer bibliometric term co-occurrence mapping for the UK PhD Application Dossier. Methodical progression, step by step. #PhDApplication #UKUniversities #LiteratureReview #VOSviewer #ResearchRoadmap",
        imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
        postUrl: "https://www.instagram.com/tamzkee/",
        date: "1 month ago",
        likes: 234,
        comments: 36,
        category: "Doctoral Journey"
      },
      {
        id: "ig-7",
        caption: "Tactical boxing sparring drill: calibrating timing, distance, and situational awareness under constant incoming pressure. Mirrors defending theoretical propositions during intense academic viva examinations. #Boxing #Pertina #TacticalAgility #SpatialAwareness #Discipline",
        imageUrl: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
        postUrl: "https://www.instagram.com/tamzkee/",
        date: "1 month ago",
        likes: 164,
        comments: 19,
        category: "Somatic Discipline"
      },
      {
        id: "ig-8",
        caption: "Facilitating an executive focus group discussion with commercial retail banking practitioners on E-SERVQUAL dimensions and consumer adoption resistance against AI self-service technologies. Rich qualitative empirical material. #FocusGroupDiscussion #SERVQUAL #DigitalBanking #ScopusResearch",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        postUrl: "https://www.instagram.com/tamzkee/",
        date: "2 months ago",
        likes: 208,
        comments: 25,
        category: "Field Research"
      }
    ]
  }
};

const STORAGE_KEY = 'gautama_portfolio_cms_data_v2';

export function loadPortfolioData(): PortfolioDataState {
  if (typeof window === 'undefined') {
    return INITIAL_PORTFOLIO_DATA;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge blog posts with default rich visual attributes
      const mergedBlogPosts = INITIAL_PORTFOLIO_DATA.blogPosts.map(initialPost => {
        const savedPost = (parsed.blogPosts || []).find((p: any) => p.slug === initialPost.slug);
        if (!savedPost) return initialPost;
        return {
          ...initialPost,
          ...savedPost,
          coverImage: savedPost.coverImage || initialPost.coverImage,
          imageCaption: savedPost.imageCaption || initialPost.imageCaption,
          illustrationType: savedPost.illustrationType || initialPost.illustrationType
        };
      });

      // Also append any custom added posts
      if (Array.isArray(parsed.blogPosts)) {
        parsed.blogPosts.forEach((sp: any) => {
          if (!mergedBlogPosts.some(p => p.slug === sp.slug)) {
            mergedBlogPosts.push(sp);
          }
        });
      }

      return {
        ...INITIAL_PORTFOLIO_DATA,
        ...parsed,
        profile: { ...INITIAL_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) },
        scholarStats: { ...INITIAL_PORTFOLIO_DATA.scholarStats, ...(parsed.scholarStats || {}) },
        blogPosts: mergedBlogPosts,
        comments: parsed.comments && Array.isArray(parsed.comments) ? parsed.comments : INITIAL_PORTFOLIO_DATA.comments
      };
    }
  } catch (err) {
    console.error('Failed to load portfolio data from storage, using defaults:', err);
  }
  return INITIAL_PORTFOLIO_DATA;
}

export function savePortfolioData(data: PortfolioDataState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save portfolio data to storage:', err);
  }
}

export function resetPortfolioData(): PortfolioDataState {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return INITIAL_PORTFOLIO_DATA;
}

export const loadSavedPortfolioData = loadPortfolioData;

export const ASTRO_COMPONENTS_CODE: Record<string, string> = INITIAL_PORTFOLIO_DATA.astroFiles.reduce((acc, file) => {
  acc[file.filename] = file.content;
  return acc;
}, {} as Record<string, string>);

export const BLOG_POSTS = INITIAL_PORTFOLIO_DATA.blogPosts;
export const SCHOLAR_DATA = INITIAL_PORTFOLIO_DATA.scholarStats;
export const ASTRO_PROJECT_FILES = INITIAL_PORTFOLIO_DATA.astroFiles;

export function generateJsonLdSchema(data: PortfolioDataState): object {
  const articlesList = data.articles || data.researchArticles;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://sastrawaskita.com/#person",
        "name": data.profile.name,
        "givenName": data.profile.name.split(" ")[0] || "Gautama",
        "familyName": data.profile.lastName || "Waskita",
        "jobTitle": data.profile.role,
        "description": data.profile.bioQuote,
        "email": data.profile.email,
        "image": data.profile.avatarUrl,
        "affiliation": {
          "@type": "EducationalOrganization",
          "name": data.profile.institution,
          "department": data.profile.faculty
        },
        "sameAs": [
          data.profile.scholarUrl || `https://scholar.google.com/citations?user=${data.profile.scholarId}`,
          data.profile.orcidUrl || `https://orcid.org/${data.profile.orcidId}`,
          data.profile.sintaUrl || `https://sinta.kemdiktisaintek.go.id/authors/profile/${data.profile.sintaId}`,
          ...(data.profile.researchGateUrl ? [data.profile.researchGateUrl] : []),
          ...(data.profile.scopusId ? [`https://www.scopus.com/authid/detail.uri?authorId=${data.profile.scopusId}`] : [])
        ],
        "knowsAbout": [
          "Operations Management",
          "Service Quality (SERVQUAL)",
          "SME Digital Transformation",
          "Hospitality Operations",
          "Qualitative Visual Methodologies"
        ]
      },
      {
        "@type": "ProfilePage",
        "@id": "https://sastrawaskita.com/#profilepage",
        "url": "https://sastrawaskita.com",
        "name": `${data.profile.name} - Academic Portfolio & PhD Research`,
        "mainEntity": { "@id": "https://sastrawaskita.com/#person" }
      },
      {
        "@type": "ItemList",
        "name": "Authored Books & Monographs",
        "itemListElement": data.books.map((b, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "Book",
            "name": b.title,
            "headline": b.subtitle,
            "author": { "@id": "https://sastrawaskita.com/#person" },
            "publisher": b.publisher,
            "isbn": b.isbn,
            "datePublished": b.year.toString()
          }
        }))
      },
      {
        "@type": "ItemList",
        "name": "Published Scholarly Articles",
        "itemListElement": articlesList.map((a, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "ScholarlyArticle",
            "headline": a.title,
            "author": { "@id": "https://sastrawaskita.com/#person" },
            "publisher": a.journal,
            "datePublished": a.year.toString(),
            "identifier": a.doi,
            "url": a.url
          }
        }))
      }
    ]
  };
}

export function generateJsonLdSchemaString(data: PortfolioDataState): string {
  return JSON.stringify(generateJsonLdSchema(data), null, 2);
}
