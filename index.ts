import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Crea un'istanza di PrismaClient
const prisma = new PrismaClient();

function naturalSort(a: string, b: string): number {
  const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
  const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
  return numA - numB;
}

// Funzione principale per elaborare i file JSON e inserirli nel database
async function main() {
  // Percorso della directory che contiene i file JSON
  const directoryPath = path.join(__dirname, 'dati');

  try {
    // Leggi tutti i file nella directory
    const files = fs.readdirSync(directoryPath).sort(naturalSort);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      
      // Leggi e analizza il contenuto del file JSON
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);

      // Inserisci i dati nella tabella Dati
      await prisma.dati.create({
        data: {
          ram_total: data.RAM.total,
          ram_free: data.RAM.free,
          ram_used: data.RAM.used,
          ram_usage: data.RAM.usage,
          cpu_usage: data.CPU.usage,
          disk_total: data.Disk.total,
          disk_free: data.Disk.free,
          disk_used: data.Disk.used,
          disk_usage: data.Disk.usage,
          ram_stressed: data.RAM.stressed || false,
          cpu_stressed: data.CPU.stressed || false,
          disk_stressed: data.Disk.stressed || false,
        },
      });

      // Controlla se ci sono più di 10 record nella tabella
      const count = await prisma.dati.count();

      // Se ci sono più di 10 record, elimina i più vecchi
      if (count > 10) {
        const recordsToDelete = count - 10;

        // Elimina i record più vecchi
        const recordsToDeleteList = await prisma.dati.findMany({
          orderBy: {
            id: 'asc',
          },
          take: recordsToDelete,
        });

        const deletePromises = recordsToDeleteList.map(record => 
          prisma.dati.delete({
            where: { id: record.id },
          })
        );

        await Promise.all(deletePromises);
        console.log(`Eliminati ${recordsToDelete} record più vecchi.`);
      }

      console.log(`Dati salvati da ${file}`);
    }
  } catch (error) {
    console.error('Errore durante l\'elaborazione dei file JSON:', error);
  }

  // Pianifica il prossimo ciclo di elaborazione dopo 5 minuti
  setTimeout(main, 300000); // 5 minuti in millisecondi
}

// Esegui la funzione principale e gestisci la disconnessione da Prisma
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
