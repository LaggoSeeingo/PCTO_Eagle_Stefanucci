
# Descrizione del progetto

## 1. `server.js`
**Descrizione**: File che contiene il primo programma costantemente in esecuzione tramite pm2, contenuto nella cartella `progetto1`. Si occupa di leggere i dati di telemetria del raspberry e salvarli in una cartella "Dati" sotto forma di file json.


## 2. `index.ts`
**Descrizione**: File che contiene il secondo programma costantemente in esecuzione tramite pm2, contenuto nella cartella `progetto1`. Si occupa di leggere i file json contenuti nella cartella "Dati" e trasformarli secondo lo schema prisma fornito, in modo da renderli oggetti allocabili in un database postgreSQL in una tabella "Dati" dedicata.


<hr>
