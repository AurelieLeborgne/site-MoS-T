/**
 * Fetch publications from the HAL API for the MoS-T ANR project.
 * Run: node scripts/fetch-hal.mjs
 * Output: src/data/publications.json
 */

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const HAL_API = 'https://api.archives-ouvertes.fr/search/';
const ANR_REF = 'ANR-21-CE23-0015';
const FIELDS = [
  'title_s',
  'authFullName_s',
  'producedDate_s',
  'producedDateY_i',
  'doiId_s',
  'halId_s',
  'docType_s',
  'conferenceTitle_s',
  'journalTitle_s',
  'uri_s',
].join(',');

const url = `${HAL_API}?q=anrProjectReference_s:"${ANR_REF}"&fl=${FIELDS}&rows=200&sort=producedDate_s desc&wt=json`;

async function fetchPublications() {
  console.log(`Fetching publications from HAL for ${ANR_REF}...`);
  console.log(`URL: ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HAL API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const docs = data.response?.docs ?? [];
  console.log(`Found ${docs.length} publications.`);

  // Normalize the data
  const publications = docs.map((doc) => ({
    title: Array.isArray(doc.title_s) ? doc.title_s[0] : doc.title_s ?? '',
    authors: doc.authFullName_s ?? [],
    date: doc.producedDate_s ?? '',
    year: doc.producedDateY_i ?? 0,
    doi: doc.doiId_s ?? '',
    halId: doc.halId_s ?? '',
    type: normalizeDocType(doc.docType_s),
    venue: doc.conferenceTitle_s ?? doc.journalTitle_s ?? '',
    url: doc.uri_s ?? '',
  }));

  const outPath = resolve(__dirname, '..', 'src', 'data', 'publications.json');
  writeFileSync(outPath, JSON.stringify(publications, null, 2), 'utf-8');
  console.log(`Written to ${outPath}`);
}

function normalizeDocType(docType) {
  if (!docType) return 'other';
  const t = docType.toLowerCase();
  if (t === 'art' || t.includes('journal')) return 'journal';
  if (t === 'comm' || t.includes('conf')) return 'conf_int';
  if (t === 'poster') return 'conf_int';
  if (t === 'these' || t === 'hdr') return 'thesis';
  if (t === 'ouv' || t === 'couv') return 'book';
  return 'other';
}

fetchPublications().catch((err) => {
  console.error('Error fetching from HAL:', err.message);
  // Write an empty fallback so build doesn't break
  const outPath = resolve(__dirname, '..', 'src', 'data', 'publications.json');
  writeFileSync(outPath, '[]', 'utf-8');
  console.log('Written empty fallback to', outPath);
});
