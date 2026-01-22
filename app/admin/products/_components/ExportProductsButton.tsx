'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

export function ExportProductsButton({ products }: { products: any[] }) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        try {
            // Prepare data with all comprehensive fields
            const exportData = products.map(p => ({
                id: p.id,
                codigo_alfa: p.codigoAlfa || '',
                codigo_producto: p.codigoProducto || p.sku,
                nombre: p.name,
                categoria: p.categoria || p.category?.name || '',
                sub_categoria: p.subCategoria || '',
                marca: p.marca || '',
                precio: Number(p.precio || p.price),
                impuesto_interno: Number(p.impuestoInterno || 0),
                iva: Number(p.iva || 0),
                moneda: p.moneda || 'USD',
                markup: Number(p.markup || 0),
                cotizacion: Number(p.cotizacion || 0),
                pvp_usd: Number(p.pvpUsd || 0),
                pvp_ars: Number(p.pvpArs || 0),
                peso: Number(p.peso || p.weight || 0),
                ean: p.ean || '',
                nivel_stock: p.nivelStock || '',
                stock_total: p.stockTotal || p.stock,
                stock_deposito_cliente: p.stockDepositoCliente || 0,
                stock_deposito_cd: p.stockDepositoCd || 0,
                garantia: p.garantia || '',
                link: p.link || '',
                imagen: p.imagen || p.imageUrl || '',
                miniatura: p.miniatura || '',
                atributos: p.atributos || '',
                gamer: p.gamer || false,
                creado: p.createdAt,
                actualizado: p.updatedAt
            }));

            // Create worksheet and workbook
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

            // Set column widths for better readability
            const wscols = [
                { wch: 25 }, // id
                { wch: 15 }, // codigo_alfa
                { wch: 20 }, // codigo_producto
                { wch: 35 }, // nombre
                { wch: 20 }, // categoria
                { wch: 20 }, // sub_categoria
                { wch: 15 }, // marca
                { wch: 12 }, // precio
                { wch: 15 }, // impuesto_interno
                { wch: 10 }, // iva
                { wch: 10 }, // moneda
                { wch: 10 }, // markup
                { wch: 12 }, // cotizacion
                { wch: 12 }, // pvp_usd
                { wch: 12 }, // pvp_ars
                { wch: 10 }, // peso
                { wch: 15 }, // ean
                { wch: 15 }, // nivel_stock
                { wch: 12 }, // stock_total
                { wch: 20 }, // stock_deposito_cliente
                { wch: 18 }, // stock_deposito_cd
                { wch: 25 }, // garantia
                { wch: 50 }, // link
                { wch: 50 }, // imagen
                { wch: 50 }, // miniatura
                { wch: 50 }, // atributos
                { wch: 10 }, // gamer
                { wch: 20 }, // creado
                { wch: 20 }  // actualizado
            ];
            worksheet['!cols'] = wscols;

            // Generate filename with date
            const date = new Date().toISOString().split('T')[0];
            const fileName = `RTECH_Export_Productos_${date}.xlsx`;

            // Trigger download
            XLSX.writeFile(workbook, fileName);

        } catch (error) {
            console.error('Error exporting products:', error);
            alert('Error al exportar productos');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn btn-outline flex items-center gap-2"
            title="Exportar a Excel"
        >
            {isExporting ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <Download size={20} />
            )}
            Exportar
        </button>
    );
}
