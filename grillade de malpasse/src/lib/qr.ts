/**
 * Générateur de QR Code SVG autonome côté serveur (aucune dépendance externe, aucun appel réseau).
 * Implémente l'encodage Byte (ISO-8859-1 / UTF-8), correction d'erreur niveau L (versions 1 à 10).
 */

// Paramètres pour le niveau de correction L, versions 1 à 10 :
// [totalDataCodewords, ecCodewordsPerBlock, numBlocksGroup1, dataCodewordsGroup1, numBlocksGroup2, dataCodewordsGroup2]
const VERSION_L_TABLE: [number, number, number, number, number, number][] = [
  [0, 0, 0, 0, 0, 0],
  [19, 7, 1, 19, 0, 0], // v1
  [34, 10, 1, 34, 0, 0], // v2
  [55, 15, 1, 55, 0, 0], // v3
  [80, 20, 1, 80, 0, 0], // v4
  [108, 26, 1, 108, 0, 0], // v5
  [136, 18, 2, 68, 0, 0], // v6
  [156, 20, 2, 78, 0, 0], // v7
  [194, 24, 2, 97, 0, 0], // v8
  [232, 30, 2, 116, 0, 0], // v9
  [274, 18, 2, 68, 2, 69], // v10
];

const ALIGNMENT_POSITIONS: number[][] = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

// Corps de Galois GF(256) avec polynôme primitif 0x11d
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number) {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], GF_EXP[i]);
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data: Uint8Array, ecLen: number): Uint8Array {
  const gen = rsGeneratorPoly(ecLen);
  const msg = new Uint8Array(data.length + ecLen);
  msg.set(data, 0);
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 1; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return msg.slice(data.length);
}

function chooseVersion(byteLen: number): number {
  for (let v = 1; v <= 10; v++) {
    const cap = VERSION_L_TABLE[v][0];
    const headerBits = v <= 9 ? 4 + 8 : 4 + 16;
    const maxBytes = Math.floor((cap * 8 - headerBits) / 8);
    if (byteLen <= maxBytes) return v;
  }
  return 10;
}

function buildCodewords(text: string, version: number): Uint8Array {
  const utf8 = new TextEncoder().encode(text);
  const [totalData, ecPerBlock, g1Blocks, g1Len, g2Blocks, g2Len] = VERSION_L_TABLE[version];
  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
  };

  // Mode Byte = 0100
  pushBits(0b0100, 4);
  pushBits(utf8.length, version <= 9 ? 8 : 16);
  for (const b of utf8) pushBits(b, 8);

  // Terminateur jusqu'à 4 zéros
  const maxBits = totalData * 8;
  for (let i = 0; i < 4 && bits.length < maxBits; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const dataBytes = new Uint8Array(totalData);
  for (let i = 0; i < bits.length / 8; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i * 8 + j];
    dataBytes[i] = b;
  }
  const pad = [0xec, 0x11];
  for (let i = bits.length / 8, p = 0; i < totalData; i++, p ^= 1) {
    dataBytes[i] = pad[p];
  }

  // Découpage en blocs et calcul Reed-Solomon
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  let offset = 0;
  for (let b = 0; b < g1Blocks; b++) {
    const slice = dataBytes.slice(offset, offset + g1Len);
    offset += g1Len;
    dataBlocks.push(slice);
    ecBlocks.push(rsEncode(slice, ecPerBlock));
  }
  for (let b = 0; b < g2Blocks; b++) {
    const slice = dataBytes.slice(offset, offset + g2Len);
    offset += g2Len;
    dataBlocks.push(slice);
    ecBlocks.push(rsEncode(slice, ecPerBlock));
  }

  const out: number[] = [];
  const maxBlockLen = Math.max(g1Len, g2Len);
  for (let i = 0; i < maxBlockLen; i++) {
    for (const blk of dataBlocks) if (i < blk.length) out.push(blk[i]);
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (const blk of ecBlocks) out.push(blk[i]);
  }
  return new Uint8Array(out);
}

export function generateQrMatrix(rawText: string): boolean[][] {
  const text = rawText.slice(0, 220);
  const utf8Len = new TextEncoder().encode(text).length;
  const version = chooseVersion(utf8Len);
  const size = version * 4 + 17;

  const modules: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunc: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setFunc = (r: number, c: number, val: boolean) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    modules[r][c] = val;
    isFunc[r][c] = true;
  };

  // Motifs de détection (Finder patterns) + séparateurs
  const drawFinder = (r0: number, c0: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = r0 + dr;
        const c = c0 + dc;
        const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        setFunc(r, c, inOuter && (onBorder || inInner));
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Motifs de synchronisation (Timing patterns)
  for (let i = 8; i < size - 8; i++) {
    setFunc(6, i, i % 2 === 0);
    setFunc(i, 6, i % 2 === 0);
  }

  // Motifs d'alignement
  const align = ALIGNMENT_POSITIONS[version];
  for (const ar of align) {
    for (const ac of align) {
      if (
        (ar === 6 && ac === 6) ||
        (ar === 6 && ac === size - 7) ||
        (ar === size - 7 && ac === 6)
      ) {
        continue;
      }
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const val = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
          setFunc(ar + dr, ac + dc, val);
        }
      }
    }
  }

  // Réservation des zones d'information de format + module sombre
  for (let i = 0; i <= 8; i++) {
    if (!isFunc[8][i]) setFunc(8, i, false);
    if (!isFunc[i][8]) setFunc(i, 8, false);
  }
  for (let i = 0; i < 8; i++) {
    if (!isFunc[8][size - 1 - i]) setFunc(8, size - 1 - i, false);
    if (!isFunc[size - 1 - i][8]) setFunc(size - 1 - i, 8, false);
  }
  setFunc(size - 8, 8, true);

  // Placement des bits de données en zigzag
  const codewords = buildCodewords(text, version);
  const allBits: number[] = [];
  for (const cw of codewords) {
    for (let b = 7; b >= 0; b--) allBits.push((cw >>> b) & 1);
  }

  let bitIdx = 0;
  let upward = true;
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col--; // Sauter la colonne de synchronisation
    for (let step = 0; step < size; step++) {
      const r = upward ? size - 1 - step : step;
      for (let dc = 0; dc < 2; dc++) {
        const c = col - dc;
        if (!isFunc[r][c]) {
          const bit = bitIdx < allBits.length ? allBits[bitIdx++] === 1 : false;
          // Masque 0 : (r + c) % 2 === 0
          const masked = (r + c) % 2 === 0 ? !bit : bit;
          modules[r][c] = masked;
        }
      }
    }
    upward = !upward;
  }

  // Informations de format pour Niveau L (01) + Masque 0 (000) -> 0x77c4
  const formatBits = 0x77c4;
  const fBit = (i: number) => ((formatBits >>> i) & 1) === 1;

  // Autour du finder haut-gauche
  for (let i = 0; i <= 5; i++) modules[8][i] = fBit(14 - i);
  modules[8][7] = fBit(8);
  modules[8][8] = fBit(7);
  modules[7][8] = fBit(6);
  for (let i = 0; i <= 5; i++) modules[5 - i][8] = fBit(i);

  // Bas-gauche et haut-droite
  for (let i = 0; i < 7; i++) modules[size - 1 - i][8] = fBit(14 - i);
  for (let i = 0; i < 8; i++) modules[8][size - 8 + i] = fBit(7 - i);

  return modules;
}

