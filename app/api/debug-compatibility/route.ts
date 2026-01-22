import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const SPECS_DB = {
    sockets: {
        '1700': ['1700', 'lga1700', 'z790', 'z690', 'b760', 'b660', 'h610'],
        '1200': ['1200', 'lga1200', 'z590', 'z490', 'b560', 'b460', 'h510', 'h410'],
        'am5': ['am5', 'x670', 'b650', 'a620', '7950x', '7900x', '7700x', '7600x', 'ryzen 7000', 'ryzen 9 7', 'ryzen 7 7', 'ryzen 5 7'],
        'am4': ['am4', 'x570', 'b550', 'a520', 'b450', 'x470', 'a320', 'ryzen 5000', 'ryzen 5 5', 'ryzen 7 5', 'ryzen 9 5', '5800x', '5600x', '5700x', '5900x', '5950x']
    },
    brands: {
        'intel': ['intel', 'core', 'pentium', 'celeron', 'i3', 'i5', 'i7', 'i9'],
        'amd': ['amd', 'ryzen', 'athlon', 'threadripper']
    },
    memory: {
        'ddr5': ['ddr5', 'd5'],
        'ddr4': ['ddr4', 'd4', '3200mhz', '3000mhz', '2666mhz', '2400mhz'], // High speeds usually DDR4 or DDR5, low generic checking
        'ddr3': ['ddr3', 'd3']
    }
};

const getProductSpecs = (name: string) => {
    const n = name.toLowerCase();

    // Detect Brand
    let brand = null;
    if (SPECS_DB.brands.intel.some(k => n.includes(k))) brand = 'intel';
    else if (SPECS_DB.brands.amd.some(k => n.includes(k))) brand = 'amd';

    // Detect Socket
    let socket = null;
    for (const [s, keywords] of Object.entries(SPECS_DB.sockets)) {
        if (keywords.some(k => n.includes(k))) {
            socket = s;
            break;
        }
    }
    // Infer brand from socket if missing
    if (!brand && socket) {
        if (['1700', '1200'].includes(socket)) brand = 'intel';
        if (['am5', 'am4'].includes(socket)) brand = 'amd';
    }

    // Detect Memory
    let memory = null;
    if (n.includes('ddr5')) memory = 'ddr5';
    else if (n.includes('ddr4') || n.includes(' d4 ')) memory = 'ddr4';
    else if (n.includes('ddr3')) memory = 'ddr3';

    // Infer memory from socket/chipset if missing (approximate rules)
    if (!memory) {
        if (socket === 'am5') memory = 'ddr5';
        if (socket === '1700') { /* Hybrid, can't assume */ }
        if (socket === 'am4' || socket === '1200') memory = 'ddr4'; // Mostly DDR4
    }

    return { brand, socket, memory };
};

export async function GET() {
    // @ts-ignore
    const mobos = await prisma.product.findMany({
        where: { category: { slug: 'motherboards' } },
        take: 20,
        select: { name: true, category: { select: { slug: true } } }
    });
    // @ts-ignore
    const cpus = await prisma.product.findMany({
        where: { category: { slug: 'procesadores' } },
        take: 20,
        select: { name: true, category: { select: { slug: true } } }
    });

    const products = [...mobos, ...cpus];

    const results = products.map((p: any) => ({
        name: p.name,
        category: p.category.slug,
        parsed: getProductSpecs(p.name)
    }));

    return NextResponse.json(results);
}
