const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../docs/provincias.txt');
const outputFile = path.join(__dirname, '../lib/locations-data.ts');

function parseLocations() {
    try {
        const content = fs.readFileSync(inputFile, 'utf8');
        const lines = content.split('\n');

        const locations = {}; // { provinceName: [{ name, zip }] }

        // Regex to match INSERT VALUES
        // (1, 1001, 'ALEM LEANDRO N. AVENIDA', 'CAPITAL FEDERAL'),
        const regex = /\(\d+,\s*(\d+),\s*'([^']+)',\s*'([^']+)'\)/g;

        console.log("Parsing file...");

        // We will process line by line or the whole content if it's one big insert
        // The file seems to have multiple INSERT statements or one big one.
        // Let's rely on the regex searching globally through the whole content for simplicity
        // as the file is not extremely huge (1MB).

        let match;
        let count = 0;

        while ((match = regex.exec(content)) !== null) {
            const zip = match[1];
            const name = match[2];
            const province = match[3];

            if (!locations[province]) {
                locations[province] = [];
            }

            locations[province].push({ name, zip });
            count++;
        }

        console.log(`Found ${count} locations.`);
        console.log(`Found ${Object.keys(locations).length} provinces.`);

        // Sort keys and values for consistency
        const sortedLocations = {};
        Object.keys(locations).sort().forEach(prov => {
            // Sort cities by name
            sortedLocations[prov] = locations[prov].sort((a, b) => a.name.localeCompare(b.name));
        });

        const outputContent = `export interface CityData {
    name: string;
    zip: string;
}

export const LOCATIONS_DATA: Record<string, CityData[]> = ${JSON.stringify(sortedLocations, null, 4)};
`;

        fs.writeFileSync(outputFile, outputContent);
        console.log(`Successfully wrote data to ${outputFile}`);

    } catch (err) {
        console.error("Error parsing locations:", err);
    }
}

parseLocations();
