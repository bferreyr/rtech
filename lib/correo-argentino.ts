// Correo Argentino API Client Service
// Documentation: https://developers.correoargentino.com.ar

interface ShippingQuoteRequest {
    destinationZip: string;
    weight: number; // in kg
    dimensions?: {
        width: number;  // in cm
        height: number; // in cm
        depth: number;  // in cm
    };
}

interface ShippingQuoteResponse {
    service: string;
    cost: number;
    estimatedDelivery: string;
    serviceCode: string;
}

interface CreateShipmentRequest {
    orderId: string;
    service: string;
    destinationAddress: string;
    destinationZip: string;
    destinationCity: string;
    destinationProvince: string;
    recipientName: string;
    recipientEmail?: string;
    recipientPhone?: string;
    weight: number;
    dimensions?: {
        width: number;
        height: number;
        depth: number;
    };
    declaredValue: number;
}

interface CreateShipmentResponse {
    trackingNumber: string;
    labelUrl: string;
    estimatedDelivery: string;
    cost: number;
}

interface TrackingEvent {
    status: string;
    description: string;
    location: string;
    timestamp: string;
}

interface TrackingResponse {
    trackingNumber: string;
    status: string;
    events: TrackingEvent[];
    estimatedDelivery?: string;
}

class CorreoArgentinoService {
    private baseUrl: string;
    private username: string;
    private password: string;
    private token: string | null = null;
    private tokenExpiry: number | null = null;

    constructor() {
        this.baseUrl = process.env.CORREO_ARGENTINO_BASE_URL || '';
        this.username = process.env.CORREO_ARGENTINO_USERNAME || '';
        this.password = process.env.CORREO_ARGENTINO_PASSWORD || '';

        if (!this.baseUrl || !this.username || !this.password) {
            console.warn('Correo Argentino credentials not configured. Set CORREO_ARGENTINO_* environment variables.');
        }
    }

    /**
     * Authenticate with Correo Argentino API and get JWT token
     */
    private async authenticate(): Promise<string> {
        // Return cached token if still valid
        if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.token;
        }

        try {
            const response = await fetch(`${this.baseUrl}/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Authentication failed: ${response.statusText}`);
            }

            const data = await response.json();
            this.token = data.token;
            // Token typically expires in 1 hour, cache for 50 minutes to be safe
            this.tokenExpiry = Date.now() + (50 * 60 * 1000);

            if (!this.token) {
                throw new Error('Token not received from authentication response');
            }

            return this.token;
        } catch (error) {
            console.error('Correo Argentino authentication error:', error);
            throw new Error('Failed to authenticate with Correo Argentino');
        }
    }

    /**
     * Calculate shipping cost and delivery time
     */
    async quoteShipment(request: ShippingQuoteRequest): Promise<ShippingQuoteResponse[]> {
        const token = await this.authenticate();

        const originZip = process.env.CORREO_ARGENTINO_ORIGIN_ZIP || '';

        try {
            const response = await fetch(`${this.baseUrl}/cotizacion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    codigoPostalOrigen: originZip,
                    codigoPostalDestino: request.destinationZip,
                    peso: request.weight,
                    alto: request.dimensions?.height || 10,
                    ancho: request.dimensions?.width || 10,
                    largo: request.dimensions?.depth || 10
                })
            });

            if (!response.ok) {
                throw new Error(`Quote request failed: ${response.statusText}`);
            }

            const data = await response.json();

            // Transform API response to our format
            return data.servicios?.map((service: any) => ({
                service: service.nombre,
                cost: parseFloat(service.precio),
                estimatedDelivery: service.tiempoEntrega,
                serviceCode: service.codigo
            })) || [];
        } catch (error) {
            console.error('Correo Argentino quote error:', error);
            throw new Error('Failed to get shipping quote');
        }
    }

    /**
     * Create a shipment and get tracking number
     */
    async createShipment(request: CreateShipmentRequest): Promise<CreateShipmentResponse> {
        const token = await this.authenticate();

        const originAddress = process.env.CORREO_ARGENTINO_ORIGIN_ADDRESS || '';
        const originZip = process.env.CORREO_ARGENTINO_ORIGIN_ZIP || '';
        const originCity = process.env.CORREO_ARGENTINO_ORIGIN_CITY || '';
        const originProvince = process.env.CORREO_ARGENTINO_ORIGIN_PROVINCE || '';

        try {
            const response = await fetch(`${this.baseUrl}/envios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    origen: {
                        direccion: originAddress,
                        codigoPostal: originZip,
                        ciudad: originCity,
                        provincia: originProvince
                    },
                    destino: {
                        direccion: request.destinationAddress,
                        codigoPostal: request.destinationZip,
                        ciudad: request.destinationCity,
                        provincia: request.destinationProvince,
                        nombreDestinatario: request.recipientName,
                        email: request.recipientEmail,
                        telefono: request.recipientPhone
                    },
                    paquete: {
                        peso: request.weight,
                        alto: request.dimensions?.height || 10,
                        ancho: request.dimensions?.width || 10,
                        largo: request.dimensions?.depth || 10,
                        valorDeclarado: request.declaredValue
                    },
                    servicio: request.service,
                    referencia: request.orderId
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Shipment creation failed: ${errorData.message || response.statusText}`);
            }

            const data = await response.json();

            return {
                trackingNumber: data.numeroSeguimiento,
                labelUrl: data.urlEtiqueta,
                estimatedDelivery: data.fechaEntregaEstimada,
                cost: parseFloat(data.costo)
            };
        } catch (error) {
            console.error('Correo Argentino create shipment error:', error);
            throw error;
        }
    }

    /**
     * Get tracking information for a shipment
     */
    async getTracking(trackingNumber: string): Promise<TrackingResponse> {
        const token = await this.authenticate();

        try {
            const response = await fetch(`${this.baseUrl}/seguimiento/${trackingNumber}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Tracking request failed: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                trackingNumber: data.numeroSeguimiento,
                status: data.estado,
                events: data.eventos?.map((event: any) => ({
                    status: event.estado,
                    description: event.descripcion,
                    location: event.ubicacion,
                    timestamp: event.fecha
                })) || [],
                estimatedDelivery: data.fechaEntregaEstimada
            };
        } catch (error) {
            console.error('Correo Argentino tracking error:', error);
            throw new Error('Failed to get tracking information');
        }
    }

    /**
     * Get available pickup branches/locations
     */
    async getBranches(zip?: string): Promise<any[]> {
        const token = await this.authenticate();

        try {
            const url = zip
                ? `${this.baseUrl}/sucursales?codigoPostal=${zip}`
                : `${this.baseUrl}/sucursales`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Branches request failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.sucursales || [];
        } catch (error) {
            console.error('Correo Argentino branches error:', error);
            throw new Error('Failed to get branches');
        }
    }

    /**
     * Download shipping label as PDF
     */
    async getLabel(trackingNumber: string): Promise<Buffer> {
        const token = await this.authenticate();

        try {
            const response = await fetch(`${this.baseUrl}/etiquetas/${trackingNumber}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Label download failed: ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer);
        } catch (error) {
            console.error('Correo Argentino label download error:', error);
            throw new Error('Failed to download label');
        }
    }
}

// Export singleton instance
export const correoArgentinoService = new CorreoArgentinoService();

// Export types
export type {
    ShippingQuoteRequest,
    ShippingQuoteResponse,
    CreateShipmentRequest,
    CreateShipmentResponse,
    TrackingResponse,
    TrackingEvent
};
