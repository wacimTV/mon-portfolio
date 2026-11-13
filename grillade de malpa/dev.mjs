// Lance le serveur PHP local : npm run dev
// Trouve php même quand le terminal a été ouvert avant l'installation de PHP.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const port = process.env.PORT || 8000;

function findPhp() {
  if (spawnSync('php', ['-v'], { shell: true }).status === 0) return 'php';
  const pkgs = join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
  if (existsSync(pkgs)) {
    const dir = readdirSync(pkgs).filter(d => /^PHP\.PHP\./.test(d)).sort().reverse()[0];
    if (dir && existsSync(join(pkgs, dir, 'php.exe'))) return join(pkgs, dir, 'php.exe');
  }
  for (const p of ['C:\\php\\php.exe', 'C:\\xampp\\php\\php.exe', 'C:\\wamp64\\bin\\php\\php.exe']) {
    if (existsSync(p)) return p;
  }
  return null;
}

const php = findPhp();
if (!php) {
  console.error('PHP introuvable. Installez-le avec : winget install PHP.PHP.8.4');
  process.exit(1);
}

console.log(`Site : http://localhost:${port}   Admin : http://localhost:${port}/admin/   (Ctrl+C pour arrêter)`);
const child = spawn(php, ['-S', `localhost:${port}`], { stdio: 'inherit' });
child.on('exit', code => process.exit(code ?? 0));
