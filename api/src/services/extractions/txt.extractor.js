export function extractTxtText(buffer) {
  return buffer.toString('utf8').replace(/^\uFEFF/, ''); // strip BOM
}