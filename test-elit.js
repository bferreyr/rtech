const userId = 15169;
const token = 'chmasqzn7a9';

async function main() {
    console.log("Searching for any product with >1 image in ELIT API...");
    let offset = 1;
    let limit = 100;
    let total = 0;
    let found = 0;

    do {
        const res = await fetch(`https://clientes.elit.com.ar/v1/api/productos?limit=${limit}&offset=${offset}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, token: token })
        });
        const data = await res.json();
        
        if (data.codigo !== 200) {
            console.error("API error", data);
            break;
        }

        total = data.paginador.total;
        const items = data.resultado;
        
        const withMultiple = items.filter(item => item.imagenes && item.imagenes.length > 1);
        found += withMultiple.length;

        if (withMultiple.length > 0) {
            console.log(`Found ${withMultiple.length} in offset ${offset}! Example:`, withMultiple[0].nombre);
            console.log("Imagenes:", withMultiple[0].imagenes);
            break; // Stop after finding one batch with multiple images
        }
        
        offset += limit;
        process.stdout.write(`Checked up to ${offset-1} of ${total}...\r`);
    } while (offset <= total && found === 0);

    console.log(`\nFinished search. Found ${found} products with >1 image.`);
}

main();
