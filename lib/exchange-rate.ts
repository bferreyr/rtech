export interface DolarResponse {
    moneda: string;
    casa: string;
    nombre: string;
    compra: number;
    venta: number;
    fechaActualizacion: string;
}

const DOLAR_API_URL = "https://dolarapi.com/v1/dolares/blue";

export async function fetchLiveExchangeRate(): Promise<number | null> {
    try {
        const response = await fetch(DOLAR_API_URL, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rate: ${response.statusText}`);
        }

        const data: DolarResponse = await response.json();
        return data.venta;
    } catch (error) {
        console.error("Error fetching live exchange rate:", error);
        return null;
    }
}
