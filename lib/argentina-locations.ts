export const PROVINCIAS_ARGENTINA = [
    { id: 'buenos-aires', nombre: 'Buenos Aires' },
    { id: 'caba', nombre: 'Ciudad Autónoma de Buenos Aires' },
    { id: 'catamarca', nombre: 'Catamarca' },
    { id: 'chaco', nombre: 'Chaco' },
    { id: 'chubut', nombre: 'Chubut' },
    { id: 'cordoba', nombre: 'Córdoba' },
    { id: 'corrientes', nombre: 'Corrientes' },
    { id: 'entre-rios', nombre: 'Entre Ríos' },
    { id: 'formosa', nombre: 'Formosa' },
    { id: 'jujuy', nombre: 'Jujuy' },
    { id: 'la-pampa', nombre: 'La Pampa' },
    { id: 'la-rioja', nombre: 'La Rioja' },
    { id: 'mendoza', nombre: 'Mendoza' },
    { id: 'misiones', nombre: 'Misiones' },
    { id: 'neuquen', nombre: 'Neuquén' },
    { id: 'rio-negro', nombre: 'Río Negro' },
    { id: 'salta', nombre: 'Salta' },
    { id: 'san-juan', nombre: 'San Juan' },
    { id: 'san-luis', nombre: 'San Luis' },
    { id: 'santa-cruz', nombre: 'Santa Cruz' },
    { id: 'santa-fe', nombre: 'Santa Fe' },
    { id: 'santiago-del-estero', nombre: 'Santiago del Estero' },
    { id: 'tierra-del-fuego', nombre: 'Tierra del Fuego' },
    { id: 'tucuman', nombre: 'Tucumán' },
];

export const CIUDADES_POR_PROVINCIA: Record<string, string[]> = {
    'buenos-aires': [
        'La Plata', 'Mar del Plata', 'Bahía Blanca', 'Tandil', 'Olavarría',
        'Pergamino', 'Azul', 'Junín', 'Necochea', 'Chivilcoy', 'Mercedes',
        'San Nicolás', 'Luján', 'Campana', 'San Pedro', 'Zárate', 'Quilmes',
        'Avellaneda', 'Lomas de Zamora', 'Lanús', 'San Isidro', 'Vicente López',
        'San Martín', 'Tres de Febrero', 'Morón', 'La Matanza', 'Tigre',
    ],
    'caba': ['Ciudad Autónoma de Buenos Aires'],
    'catamarca': [
        'San Fernando del Valle de Catamarca', 'Andalgalá', 'Belén', 'Santa María',
        'Tinogasta', 'Fiambalá',
    ],
    'chaco': [
        'Resistencia', 'Presidencia Roque Sáenz Peña', 'Villa Ángela', 'Charata',
        'General José de San Martín', 'Quitilipi', 'Barranqueras',
    ],
    'chubut': [
        'Rawson', 'Comodoro Rivadavia', 'Trelew', 'Puerto Madryn', 'Esquel',
        'Sarmiento', 'Gaiman',
    ],
    'cordoba': [
        'Córdoba', 'Villa María', 'Río Cuarto', 'San Francisco', 'Villa Carlos Paz',
        'Alta Gracia', 'Bell Ville', 'Río Tercero', 'Jesús María', 'Cruz del Eje',
        'La Falda', 'Cosquín', 'Deán Funes', 'Laboulaye',
    ],
    'corrientes': [
        'Corrientes', 'Goya', 'Paso de los Libres', 'Mercedes', 'Curuzú Cuatiá',
        'Esquina', 'Santo Tomé', 'Monte Caseros',
    ],
    'entre-rios': [
        'Paraná', 'Concordia', 'Gualeguaychú', 'Concepción del Uruguay',
        'Victoria', 'Gualeguay', 'Villaguay', 'Chajarí', 'La Paz', 'Colón',
    ],
    'formosa': [
        'Formosa', 'Clorinda', 'Pirané', 'El Colorado', 'Ingeniero Juárez',
        'Las Lomitas',
    ],
    'jujuy': [
        'San Salvador de Jujuy', 'San Pedro', 'Libertador General San Martín',
        'Palpalá', 'La Quiaca', 'Humahuaca', 'Tilcara',
    ],
    'la-pampa': [
        'Santa Rosa', 'General Pico', 'General Acha', 'Realicó', 'Eduardo Castex',
        'Macachín', 'Victorica',
    ],
    'la-rioja': [
        'La Rioja', 'Chilecito', 'Aimogasta', 'Chamical', 'Villa Unión',
    ],
    'mendoza': [
        'Mendoza', 'San Rafael', 'Godoy Cruz', 'Guaymallén', 'Las Heras',
        'Maipú', 'Luján de Cuyo', 'San Martín', 'Tunuyán', 'Malargüe',
        'General Alvear',
    ],
    'misiones': [
        'Posadas', 'Oberá', 'Eldorado', 'Puerto Iguazú', 'Apóstoles',
        'Leandro N. Alem', 'Jardín América', 'Montecarlo',
    ],
    'neuquen': [
        'Neuquén', 'San Martín de los Andes', 'Villa La Angostura', 'Zapala',
        'Cutral Có', 'Centenario', 'Plottier', 'Junín de los Andes',
    ],
    'rio-negro': [
        'Viedma', 'San Carlos de Bariloche', 'General Roca', 'Cipolletti',
        'Villa Regina', 'Cinco Saltos', 'El Bolsón', 'Ingeniero Jacobacci',
    ],
    'salta': [
        'Salta', 'San Ramón de la Nueva Orán', 'Tartagal', 'Metán',
        'General Güemes', 'Cafayate', 'Rosario de la Frontera', 'Joaquín V. González',
    ],
    'san-juan': [
        'San Juan', 'Rawson', 'Chimbas', 'Rivadavia', 'Santa Lucía',
        'Pocito', 'Caucete', 'Jáchal',
    ],
    'san-luis': [
        'San Luis', 'Villa Mercedes', 'La Punta', 'Merlo', 'Justo Daract',
        'Tilisarao',
    ],
    'santa-cruz': [
        'Río Gallegos', 'Caleta Olivia', 'Pico Truncado', 'Puerto Deseado',
        'Puerto San Julián', 'El Calafate', 'Río Turbio',
    ],
    'santa-fe': [
        'Santa Fe', 'Rosario', 'Rafaela', 'Reconquista', 'Venado Tuerto',
        'Villa Gobernador Gálvez', 'Casilda', 'Esperanza', 'San Lorenzo',
        'Cañada de Gómez', 'Firmat', 'Vera',
    ],
    'santiago-del-estero': [
        'Santiago del Estero', 'La Banda', 'Termas de Río Hondo', 'Frías',
        'Añatuya', 'Fernández', 'Monte Quemado',
    ],
    'tierra-del-fuego': [
        'Ushuaia', 'Río Grande', 'Tolhuin',
    ],
    'tucuman': [
        'San Miguel de Tucumán', 'Yerba Buena', 'Tafí Viejo', 'Concepción',
        'Aguilares', 'Monteros', 'Famaillá', 'Simoca',
    ],
};
