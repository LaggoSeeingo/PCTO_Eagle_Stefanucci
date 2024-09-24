const express = require('express');
const os = require('os');
const readline = require('readline');

const app = express();
const port = 3000;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Funzione per ottenere l'utilizzo della CPU
function getCPUUsage() {
  const cpus = os.cpus();
  let totalIdle = 0, totalTick = 0;

  cpus.forEach((cpu) => {
    for (type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const usage = (1 - idle / total) * 100;

  return usage.toFixed(2); // Percentuale di utilizzo della CPU
}

// Funzione per ottenere l'utilizzo della RAM
function getRAMUsage() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const usage = (usedMem / totalMem) * 100;

  return {
    total: (totalMem / 1024 / 1024).toFixed(2), // in MB
    free: (freeMem / 1024 / 1024).toFixed(2),   // in MB
    used: (usedMem / 1024 / 1024).toFixed(2),   // in MB
    usage: usage.toFixed(2)                     // Percentuale di utilizzo della RAM
  };
}

// REST API: Endpoint per ottenere l'uso della RAM
app.get('/api', (req, res) => {
  const ramUsage = getRAMUsage();
  const cpuUsage = getCPUUsage();
  res.json({
    RAM total: `${ramUsage.total} MB`,
    RAM free: `${ramUsage.free} MB`,
    RAM used: `${ramUsage.used} MB`,
    RAM usage: `${ramUsage.usage}%`,
    CPU usage: `${cpuUsage}%` 
  });
});

// Avvia il server web per la REST API
app.listen(port, () => {
  console.log(`REST API server avviato su http://localhost:${port}`);
  showMenu(); // Avvia il menu console dopo aver avviato il server
});

// Funzione per mostrare il menu principale nel terminale
function showMenu() {
  console.log('\n--- Menu ---');
  console.log('1. Visualizza uso CPU');
  console.log('2. Visualizza uso RAM');
  console.log('3. Esci');
  rl.question('Seleziona un\'opzione: ', handleMenuSelection);
}

// Gestisce la selezione del menu
function handleMenuSelection(option) {
  switch(option) {
    case '1':
      showCPUUsage();
      break;
    case '2':
      showRAMUsage();
      break;
    case '3':
      console.log('Uscita...');
      rl.close();
      break;
    default:
      console.log('Opzione non valida, riprova.');
      showMenu();
  }
}

// Mostra l'uso della CPU e ritorna al menu
function showCPUUsage() {
  const cpuUsage = getCPUUsage();
  console.log(`\nUso CPU: ${cpuUsage}%`);
  rl.question('\nPremi Enter per tornare al menu...', () => showMenu());
}

// Mostra l'uso della RAM e ritorna al menu
function showRAMUsage() {
  const ramUsage = getRAMUsage();
  console.log(`\nUso RAM:
  - Totale: ${ramUsage.total} MB
  - Libero: ${ramUsage.free} MB
  - Usato: ${ramUsage.used} MB
  - Percentuale di utilizzo: ${ramUsage.usage}%`);
  rl.question('\nPremi Enter per tornare al menu...', () => showMenu());
}
