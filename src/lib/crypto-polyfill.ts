/**
 * Polyfill for window.crypto.subtle in non-secure contexts (e.g. mobile testing over HTTP via LAN IP).
 * Browsers only expose window.crypto.subtle in Secure Contexts (HTTPS, localhost, 127.0.0.1).
 * When accessed via local IP (e.g. http://192.168.1.x:3000), crypto.subtle is undefined,
 * causing Keystatic and client-side hashing to fail with:
 * "TypeError: Cannot read properties of undefined (reading 'digest')".
 */

function sha1(buffer: ArrayBuffer | ArrayBufferView): ArrayBuffer {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array('buffer' in buffer ? buffer.buffer : buffer);
  const bitLen = bytes.length * 8;
  const wordLen = (((bitLen + 64) >>> 9) << 4) + 16;
  const words = new Uint32Array(wordLen);
  for (let i = 0; i < bytes.length; i++) {
    words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
  }
  words[bitLen >>> 5] |= 0x80 << (24 - (bitLen % 32));
  words[wordLen - 2] = Math.floor(bitLen / 0x100000000);
  words[wordLen - 1] = bitLen & 0xffffffff;

  let H0 = 0x67452301, H1 = 0xefcdab89, H2 = 0x98badcfe, H3 = 0x10325476, H4 = 0xc3d2e1f0;
  const W = new Uint32Array(80);

  for (let i = 0; i < words.length; i += 16) {
    let a = H0, b = H1, c = H2, d = H3, e = H4;
    for (let t = 0; t < 80; t++) {
      if (t < 16) {
        W[t] = words[i + t];
      } else {
        const temp = W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16];
        W[t] = (temp << 1) | (temp >>> 31);
      }
      let f: number, k: number;
      if (t < 20) {
        f = (b & c) | ((~b) & d);
        k = 0x5a827999;
      } else if (t < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (t < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const temp = (((a << 5) | (a >>> 27)) + f + e + k + W[t]) | 0;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = temp;
    }
    H0 = (H0 + a) | 0;
    H1 = (H1 + b) | 0;
    H2 = (H2 + c) | 0;
    H3 = (H3 + d) | 0;
    H4 = (H4 + e) | 0;
  }

  const out = new Uint8Array(20);
  const view = new DataView(out.buffer);
  view.setUint32(0, H0);
  view.setUint32(4, H1);
  view.setUint32(8, H2);
  view.setUint32(12, H3);
  view.setUint32(16, H4);
  return out.buffer;
}

function sha256(buffer: ArrayBuffer | ArrayBufferView): ArrayBuffer {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array('buffer' in buffer ? buffer.buffer : buffer);
  const bitLen = bytes.length * 8;
  const wordLen = (((bitLen + 64) >>> 9) << 4) + 16;
  const words = new Uint32Array(wordLen);
  for (let i = 0; i < bytes.length; i++) {
    words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
  }
  words[bitLen >>> 5] |= 0x80 << (24 - (bitLen % 32));
  words[wordLen - 2] = Math.floor(bitLen / 0x100000000);
  words[wordLen - 1] = bitLen & 0xffffffff;

  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  const w = new Uint32Array(64);
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));

  for (let i = 0; i < words.length; i += 16) {
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (let t = 0; t < 64; t++) {
      if (t < 16) {
        w[t] = words[i + t];
      } else {
        const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (((w[t - 16] + s0) | 0) + ((w[t - 7] + s1) | 0)) | 0;
      }
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ ((~e) & g);
      const temp1 = (((((h + S1) | 0) + ch) | 0) + ((K[t] + w[t]) | 0)) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }

  const out = new Uint8Array(32);
  const view = new DataView(out.buffer);
  view.setUint32(0, h0);
  view.setUint32(4, h1);
  view.setUint32(8, h2);
  view.setUint32(12, h3);
  view.setUint32(16, h4);
  view.setUint32(20, h5);
  view.setUint32(24, h6);
  view.setUint32(28, h7);
  return out.buffer;
}

export function installCryptoSubtlePolyfill() {
  if (typeof window === 'undefined') return;

  try {
    if (!window.crypto) {
      (window as any).crypto = {};
    }

    const cryptoObj = window.crypto as any;
    if (!cryptoObj.subtle) {
      cryptoObj.subtle = {};
    }

    if (!cryptoObj.subtle.digest) {
      cryptoObj.subtle.digest = async function(
        algorithm: string | { name: string },
        data: BufferSource
      ): Promise<ArrayBuffer> {
        const algoName = (typeof algorithm === 'string' ? algorithm : algorithm?.name || '').toUpperCase().replace(/-/g, '');
        
        let buffer: ArrayBuffer | Uint8Array;
        if (data instanceof ArrayBuffer) {
          buffer = data;
        } else if (ArrayBuffer.isView(data)) {
          buffer = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        } else {
          buffer = new Uint8Array();
        }

        if (algoName === 'SHA1') {
          return sha1(buffer);
        } else if (algoName === 'SHA256') {
          return sha256(buffer);
        } else {
          // Fallback or attempt native if supported
          return sha256(buffer);
        }
      };
    }

    if (!cryptoObj.getRandomValues) {
      cryptoObj.getRandomValues = function<T extends ArrayBufferView | null>(array: T): T {
        if (array && 'byteLength' in array) {
          const u8 = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
          for (let i = 0; i < u8.length; i++) {
            u8[i] = Math.floor(Math.random() * 256);
          }
        }
        return array;
      };
    }

    if (!cryptoObj.randomUUID) {
      cryptoObj.randomUUID = function(): string {
        return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
          (c ^ (Math.floor(Math.random() * 16) & (15 >> (c / 4)))).toString(16)
        );
      };
    }
  } catch (err) {
    console.warn('[crypto-polyfill] Could not install polyfill:', err);
  }
}

// Automatically install polyfill in browser
installCryptoSubtlePolyfill();
