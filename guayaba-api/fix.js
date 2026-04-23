const fs = require('fs');
const path = require('path');

const target = path.join(process.cwd(), 'src');

function walk(dir) {
  let files = fs.readdirSync(dir);
  files.forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.ts')) {
      let txt = fs.readFileSync(p, 'utf8');
      
      let targetPart = p.replace(target, '');
      let parts = targetPart.split(path.sep);
      let depth = parts.length > 2 ? parts.length - 2 : 0;
      let rel = depth > 0 ? '../'.repeat(depth) : './';
      
      let newTxt = txt
        .replace(/from\s+['"]@\/(.*?)['"]/g, (m, g1) => `from '${rel}${g1}'`)
        .replace(/import\s+['"]@\/(.*?)['"]/g, (m, g1) => `import '${rel}${g1}'`);
      
      if (newTxt !== txt) {
        fs.writeFileSync(p, newTxt);
        console.log('Fixed:', p);
      }
    }
  });
}

walk(target);
