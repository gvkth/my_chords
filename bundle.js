const fs = require('fs');
const path = require('path');

const dir = 'f:/MUSIC/GUITARE/Chords/ag_gen';

const htmlTemplate = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const cssOriginal = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');
const imgBase64 = fs.readFileSync(path.join(dir, 'background.png')).toString('base64');

// Replace background image in CSS with data URI
const css = cssOriginal.replace(/url\(['"]?background\.png['"]?\)/g, `url(data:image/png;base64,${imgBase64})`);

// Bundle it
let portableHtml = htmlTemplate;

// Remove script/link tags
portableHtml = portableHtml.replace(/<link rel="stylesheet".*?>/g, `<style>${css}</style>`);
portableHtml = portableHtml.replace(/<script src="app.js"><\/script>/g, `<script>${js}</script>`);

fs.writeFileSync(path.join(dir, 'portable_viewer.html'), portableHtml);
console.log('Portable viewer created: portable_viewer.html');
