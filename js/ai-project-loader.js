/**
 * Backward compatibility alias: mengarahkan ke ai-generator.js
 */
if (typeof window !== 'undefined' && !window._AI_GENERATOR_LOADED) {
  // Jika ai-generator.js belum di-load, script ini aman
  console.debug('AI Project Loader dimuat.');
}
