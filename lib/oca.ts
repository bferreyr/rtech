// OCA e-Pak API Client Service
// Documentación: F:\RTECH\docs\OCA-INTEGRACION.txt

import { prisma } from './prisma';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface OCAConfig {
    environment: 'testing' | 'production';
    username: string;
    password: string;
    cuit: string;
    accountNumber: string;
    operativas: {
        puertaPuerta: string;
        puertaSucursal: string;
    };
    origin: {
        address: string;
        number: string;
        floor?: string;
        apartment?: string;
        zip: string;
        city: string;
        province: string;
        email: string;
        observations?: string;
    };
    defaultDimensions: {
        width: number;
        height: number;
        depth: number;
    };
    defaultTimeframe: string;
}

export interface QuoteShipmentRequest {
    destinationZip: string;
    weight: number;
    volume: number;
    declaredValue: number;
    serviceType: 'puerta-puerta' | 'puerta-sucursal';
}

export interface QuoteShipmentResponse {
    service: string;
    cost: number;
    estimatedDelivery: string;
    operativa: string;
}

export interface OCABranch {
    id: string;
    name: string;
    address: string;
    zip: string;
    city: string;
    province: string;
    services: string[]; // 'ADMISION' | 'ENTREGA'
}

export interface CreateShipmentRequest {
    orderId: string;
    serviceType: 'puerta-puerta' | 'puerta-sucursal';
    recipient: {
        firstName: string;
        lastName: string;
        address: string;
        number: string;
        floor?: string;
        apartment?: string;
        city: string;
        province: string;
        zip: string;
        phone?: string;
        email?: string;
        observations?: string;
    };
    package: {
        weight: number;
        width: number;
        height: number;
        depth: number;
        declaredValue: number;
        quantity: number;
    };
    branchId?: string; // Para Puerta a Sucursal
    pickupDate?: string; // Formato YYYYMMDD
}

export interface CreateShipmentResponse {
    success: boolean;
    trackingNumber?: string;
    ocaOrderId?: string;
    remito?: string;
    error?: string;
}

export interface TrackingResponse {
    trackingNumber: string;
    status: string;
    events: Array<{
        status: string;
        description: string;
        location: string;
        timestamp: string;
    }>;
}

// ============================================================================
// OCA SERVICE CLASS
// ============================================================================

class OCAService {
    private config: OCAConfig | null = null;

    /**
     * Get OCA configuration from database
     */
    private async getConfig(): Promise<OCAConfig> {
        if (this.config) {
            return this.config;
        }

        const settings = await prisma.setting.findMany({
            where: {
                key: {
                    startsWith: 'oca_'
                }
            }
        });

        const getValue = (key: string, defaultValue: string = ''): string => {
            const setting = settings.find(s => s.key === key);
            return setting?.value || defaultValue;
        };

        const dimensions = JSON.parse(getValue('oca_default_dimensions', '{"width":10,"height":10,"depth":10}'));

        this.config = {
            environment: getValue('oca_environment', 'testing') as 'testing' | 'production',
            username: getValue('oca_username'),
            password: getValue('oca_password'),
            cuit: getValue('oca_cuit'),
            accountNumber: getValue('oca_account'),
            operativas: {
                puertaPuerta: getValue('oca_operativa_pp'),
                puertaSucursal: getValue('oca_operativa_ps'),
            },
            origin: {
                address: getValue('oca_origin_address'),
                number: getValue('oca_origin_number'),
                floor: getValue('oca_origin_floor'),
                apartment: getValue('oca_origin_apartment'),
                zip: getValue('oca_origin_zip'),
                city: getValue('oca_origin_city'),
                province: getValue('oca_origin_province'),
                email: getValue('oca_origin_email'),
                observations: getValue('oca_origin_observations'),
            },
            defaultDimensions: dimensions,
            defaultTimeframe: getValue('oca_default_timeframe', '1'),
        };

        return this.config;
    }

    /**
     * Get base URL based on environment
     */
    private async getBaseUrl(): Promise<string> {
        const config = await this.getConfig();
        return config.environment === 'testing'
            ? 'http://webservice.oca.com.ar/ePak_tracking_TEST'
            : 'http://webservice.oca.com.ar/ePak_tracking';
    }

    /**
     * Parse XML response from OCA
     */
    private parseXMLResponse(xmlString: string): any {
        // Simple XML parser for OCA responses
        // In production, consider using a proper XML parser library
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            return xmlDoc;
        } catch (error) {
            console.error('Error parsing XML:', error);
            return null;
        }
    }

    /**
     * Build XML for shipment creation
     */
    private buildShipmentXML(request: CreateShipmentRequest, config: OCAConfig): string {
        const { recipient, package: pkg, serviceType, branchId, pickupDate } = request;
        const { origin, accountNumber, operativas, defaultTimeframe } = config;

        const operativa = serviceType === 'puerta-puerta'
            ? operativas.puertaPuerta
            : operativas.puertaSucursal;

        const date = pickupDate || new Date().toISOString().split('T')[0].replace(/-/g, '');
        const idci = serviceType === 'puerta-sucursal' && branchId ? branchId : '0';

        const xml = `<?xml version="1.0" encoding="iso-8859-1" standalone="yes"?>
<ROWS>
  <cabecera ver="2.0" nrocuenta="${accountNumber}" />
  <origenes>
    <origen 
      calle="${origin.address}" 
      nro="${origin.number}" 
      piso="${origin.floor || ''}" 
      depto="${origin.apartment || ''}" 
      cp="${origin.zip}" 
      localidad="${origin.city}" 
      provincia="${origin.province}" 
      contacto="" 
      email="${origin.email}" 
      solicitante="" 
      observaciones="${origin.observations || ''}" 
      centrocosto="0" 
      idfranjahoraria="${defaultTimeframe}" 
      idcentroimposicionorigen="0" 
      fecha="${date}">
      <envios>
        <envio idoperativa="${operativa}" nroremito="${request.orderId}">
          <destinatario 
            apellido="${recipient.lastName}" 
            nombre="${recipient.firstName}" 
            calle="${recipient.address}" 
            nro="${recipient.number}" 
            piso="${recipient.floor || ''}" 
            depto="${recipient.apartment || ''}" 
            localidad="${recipient.city}" 
            provincia="${recipient.province}" 
            cp="${recipient.zip}" 
            telefono="${recipient.phone || ''}" 
            email="${recipient.email || ''}" 
            idci="${idci}" 
            celular="${recipient.phone || ''}" 
            observaciones="${recipient.observations || ''}" />
          <paquetes>
            <paquete 
              alto="${pkg.height}" 
              ancho="${pkg.width}" 
              largo="${pkg.depth}" 
              peso="${pkg.weight}" 
              valor="${pkg.declaredValue}" 
              cant="1" />
          </paquetes>
        </envio>
      </envios>
    </origen>
  </origenes>
</ROWS>`;

        return xml;
    }

    /**
     * Quote shipment cost and delivery time
     */
    async quoteShipment(request: QuoteShipmentRequest): Promise<QuoteShipmentResponse | null> {
        try {
            const config = await this.getConfig();
            const baseUrl = await this.getBaseUrl();

            const operativa = request.serviceType === 'puerta-puerta'
                ? config.operativas.puertaPuerta
                : config.operativas.puertaSucursal;

            const url = `${baseUrl}/Oep_TrackEPak.asmx/Tarifar_Envio_Corporativo`;

            const params = new URLSearchParams({
                Cuit: config.cuit,
                Operativa: operativa,
                PesoTotal: request.weight.toString(),
                VolumenTotal: request.volume.toString(),
                CodigoPostalOrigen: config.origin.zip,
                CodigoPostalDestino: request.destinationZip,
                CantidadPaquetes: '1',
                ValorDeclarado: request.declaredValue.toString(),
            });

            const response = await fetch(`${url}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (!response.ok) {
                throw new Error(`OCA API error: ${response.statusText}`);
            }

            const xmlText = await response.text();

            // Parse XML response (simplified - in production use proper XML parser)
            // Expected format: <Tarifador><Tarifador><Precio>XXX</Precio><PlazoEntrega>X dias</PlazoEntrega></Tarifador></Tarifador>
            const priceMatch = xmlText.match(/<Precio>([\d.]+)<\/Precio>/);
            const deliveryMatch = xmlText.match(/<PlazoEntrega>([^<]+)<\/PlazoEntrega>/);

            if (priceMatch && deliveryMatch) {
                return {
                    service: request.serviceType === 'puerta-puerta' ? 'Puerta a Puerta' : 'Puerta a Sucursal',
                    cost: parseFloat(priceMatch[1]),
                    estimatedDelivery: deliveryMatch[1],
                    operativa: operativa,
                };
            }

            return null;
        } catch (error) {
            console.error('Error quoting OCA shipment:', error);
            return null;
        }
    }

    /**
     * Get OCA branches by postal code
     */
    async getBranches(zip: string): Promise<OCABranch[]> {
        try {
            const baseUrl = await this.getBaseUrl();
            const url = `${baseUrl}/Oep_TrackEPak.asmx/GetCentrosImposicionConServiciosByCP`;

            const params = new URLSearchParams({
                CodigoPostal: zip,
            });

            const response = await fetch(`${url}?${params.toString()}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`OCA API error: ${response.statusText}`);
            }

            const xmlText = await response.text();

            // Parse XML and extract branches
            // This is a simplified parser - in production use proper XML parsing
            const branches: OCABranch[] = [];

            // Extract branch data from XML
            const branchMatches = xmlText.matchAll(/<Centro>[\s\S]*?<\/Centro>/g);

            for (const match of branchMatches) {
                const branchXml = match[0];
                const idMatch = branchXml.match(/<IdCentroImposicion>(\d+)<\/IdCentroImposicion>/);
                const nameMatch = branchXml.match(/<Descripcion>([^<]+)<\/Descripcion>/);
                const addressMatch = branchXml.match(/<Calle>([^<]+)<\/Calle>/);
                const servicesMatch = branchXml.match(/<Servicios>([^<]+)<\/Servicios>/);

                if (idMatch && nameMatch) {
                    branches.push({
                        id: idMatch[1],
                        name: nameMatch[1],
                        address: addressMatch ? addressMatch[1] : '',
                        zip: zip,
                        city: '',
                        province: '',
                        services: servicesMatch ? servicesMatch[1].split(',') : [],
                    });
                }
            }

            return branches;
        } catch (error) {
            console.error('Error getting OCA branches:', error);
            return [];
        }
    }

    /**
     * Create shipment in OCA
     */
    async createShipment(request: CreateShipmentRequest): Promise<CreateShipmentResponse> {
        try {
            const config = await this.getConfig();
            const baseUrl = await this.getBaseUrl();
            const url = `${baseUrl}/Oep_TrackEPak.asmx/IngresoORMultiplesRetiros`;

            const xmlData = this.buildShipmentXML(request, config);

            const params = new URLSearchParams({
                usr: config.username,
                psw: config.password,
                xml_Datos: xmlData,
                ConfirmarRetiro: 'true',
                ArchivoCliente: '',
                ArchivoProceso: '',
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });

            if (!response.ok) {
                throw new Error(`OCA API error: ${response.statusText}`);
            }

            const xmlText = await response.text();

            // Parse response for success/error
            const errorMatch = xmlText.match(/<Error>([^<]+)<\/Error>/);
            if (errorMatch) {
                return {
                    success: false,
                    error: errorMatch[1],
                };
            }

            // Extract tracking number and order ID
            const trackingMatch = xmlText.match(/<NumeroEnvio>(\d+)<\/NumeroEnvio>/);
            const orderIdMatch = xmlText.match(/<IdOrdenRetiro>(\d+)<\/IdOrdenRetiro>/);

            if (trackingMatch && orderIdMatch) {
                return {
                    success: true,
                    trackingNumber: trackingMatch[1],
                    ocaOrderId: orderIdMatch[1],
                    remito: request.orderId,
                };
            }

            return {
                success: false,
                error: 'No se pudo obtener el número de seguimiento',
            };
        } catch (error) {
            console.error('Error creating OCA shipment:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }

    /**
     * Get shipping label (PDF)
     */
    async getLabel(ocaOrderId: string, format: 'html' | 'pdf' = 'pdf'): Promise<string | null> {
        try {
            const baseUrl = await this.getBaseUrl();

            const endpoint = format === 'pdf'
                ? '/Oep_TrackEPak.asmx/GetPdfDeEtiquetasPorOrdenOrNumeroEnvio'
                : '/Oep_TrackEPak.asmx/GetHtmlDeEtiquetasPorOrdenOrNumeroEnvio';

            const url = `${baseUrl}${endpoint}`;

            const params = new URLSearchParams({
                idOrdenRetiro: ocaOrderId,
                nroEnvio: '',
            });

            const response = await fetch(`${url}?${params.toString()}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`OCA API error: ${response.statusText}`);
            }

            const xmlText = await response.text();

            if (format === 'pdf') {
                // Extract base64 PDF
                const pdfMatch = xmlText.match(/<string[^>]*>([A-Za-z0-9+/=]+)<\/string>/);
                if (pdfMatch) {
                    return pdfMatch[1]; // Return base64 string
                }
            } else {
                // Extract HTML
                const htmlMatch = xmlText.match(/<string[^>]*>([\s\S]*?)<\/string>/);
                if (htmlMatch) {
                    return htmlMatch[1];
                }
            }

            return null;
        } catch (error) {
            console.error('Error getting OCA label:', error);
            return null;
        }
    }

    /**
     * Get tracking information
     */
    async getTracking(trackingNumber: string): Promise<TrackingResponse | null> {
        try {
            const baseUrl = await this.getBaseUrl();
            const url = `${baseUrl}/Oep_TrackEPak.asmx/GetEnvioEstadoActual`;

            const params = new URLSearchParams({
                numeroEnvio: trackingNumber,
                ordenRetiro: '',
            });

            const response = await fetch(`${url}?${params.toString()}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`OCA API error: ${response.statusText}`);
            }

            const xmlText = await response.text();

            // Parse tracking info
            const statusMatch = xmlText.match(/<Estado>([^<]+)<\/Estado>/);
            const descMatch = xmlText.match(/<Descripcion>([^<]+)<\/Descripcion>/);

            if (statusMatch) {
                return {
                    trackingNumber,
                    status: statusMatch[1],
                    events: [{
                        status: statusMatch[1],
                        description: descMatch ? descMatch[1] : '',
                        location: '',
                        timestamp: new Date().toISOString(),
                    }],
                };
            }

            return null;
        } catch (error) {
            console.error('Error getting OCA tracking:', error);
            return null;
        }
    }

    /**
     * Cancel shipment
     */
    async cancelShipment(ocaOrderId: string): Promise<{ success: boolean; message: string }> {
        try {
            const config = await this.getConfig();
            const baseUrl = await this.getBaseUrl();
            const url = `${baseUrl}/Oep_TrackEPak.asmx/AnularOrdenGenerada`;

            const params = new URLSearchParams({
                usr: config.username,
                psw: config.password,
                idOrdenRetiro: ocaOrderId,
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });

            if (!response.ok) {
                throw new Error(`OCA API error: ${response.statusText}`);
            }

            const xmlText = await response.text();

            // Check for success (code 100)
            if (xmlText.includes('100') || xmlText.includes('Anulación exitosa')) {
                return {
                    success: true,
                    message: 'Envío anulado exitosamente',
                };
            }

            return {
                success: false,
                message: 'No se pudo anular el envío',
            };
        } catch (error) {
            console.error('Error canceling OCA shipment:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }

    /**
     * Clear cached configuration
     */
    clearCache() {
        this.config = null;
    }
}

// Export singleton instance
export const ocaService = new OCAService();
