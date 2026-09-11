import type { AuthorProfile } from '../types';

export interface AcademicLinks {
  researchGateHref: string | null;
  scholarHref: string | null;
  sintaHref: string | null;
  orcidHref: string | null;
  scopusHref: string | null;
  activeCount: number;
}

/**
 * Resolves academic triangulation links.
 * For all 5 platforms (Scholar, ORCID, SINTA, ResearchGate, Scopus):
 * If the input in the dashboard is emptied/blank, the href is null and the logo is hidden.
 */
export function getAcademicLinks(profile?: Partial<AuthorProfile> | null): AcademicLinks {
  const p = profile || {};

  // 1. ResearchGate (hidden if blank)
  let researchGateHref: string | null = null;
  const rawRG = p.researchGateUrl?.trim() || '';
  if (rawRG) {
    researchGateHref = rawRG.startsWith('http') ? rawRG : `https://${rawRG}`;
  }

  // 2. Google Scholar (hidden if blank)
  let scholarHref: string | null = null;
  const rawScholar = p.scholarUrl?.trim() || p.scholarId?.trim() || '';
  if (rawScholar) {
    scholarHref = rawScholar.startsWith('http')
      ? rawScholar
      : `https://scholar.google.com/citations?user=${rawScholar}&hl=id`;
  }

  // 3. SINTA Kemdiktisaintek (hidden if blank)
  let sintaHref: string | null = null;
  let rawSinta = p.sintaUrl?.trim() || p.sintaId?.trim() || '';
  if (rawSinta) {
    if (rawSinta.includes('sinta.kemdikbud.go.id')) {
      rawSinta = rawSinta.replace('sinta.kemdikbud.go.id', 'sinta.kemdiktisaintek.go.id');
    }
    sintaHref = rawSinta.startsWith('http')
      ? rawSinta
      : `https://sinta.kemdiktisaintek.go.id/authors/profile/${rawSinta}`;
  }

  // 4. ORCID (hidden if blank)
  let orcidHref: string | null = null;
  const rawOrcid = p.orcidUrl?.trim() || p.orcidId?.trim() || '';
  if (rawOrcid) {
    orcidHref = rawOrcid.startsWith('http')
      ? rawOrcid
      : `https://orcid.org/${rawOrcid}`;
  }

  // 5. Scopus (hidden if blank)
  let scopusHref: string | null = null;
  const rawScopus = p.scopusUrl?.trim() || p.scopusId?.trim() || '';
  if (rawScopus) {
    scopusHref = rawScopus.startsWith('http')
      ? rawScopus
      : `https://www.scopus.com/authid/detail.uri?authorId=${rawScopus}`;
  }

  const activeCount = [
    researchGateHref,
    scholarHref,
    sintaHref,
    orcidHref,
    scopusHref
  ].filter(Boolean).length;

  return {
    researchGateHref,
    scholarHref,
    sintaHref,
    orcidHref,
    scopusHref,
    activeCount
  };
}
