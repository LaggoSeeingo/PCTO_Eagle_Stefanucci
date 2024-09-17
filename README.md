
# Descrizione dei file

## 1. `server.js`
**Descrizione**: File che contiene il programma da eseguire, contenuto nella cartella `progetto1`.

## 2. `progetto1.service`
**Descrizione**: File di setup necessario all'esecuzione di `server.js` all'avvio del SO. Si trova nel percorso assoluto `/etc/systemd/system/progetto1.service`.

**Comandi usati dopo la creazione del file di setup per avviarlo e controllarne lo stato**: <br>
`sudo systemctl daemon-reload` <br>
`sudo systemctl enable progetto1.service`<br>
`sudo systemctl start progetto1.service`<br>
`sudo systemctl status progetto1.service`<br>

<hr>


I dati sono accessibili all'url http://localhost:3000/api/usage
