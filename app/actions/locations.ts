'use server';

import { LOCATIONS_DATA } from "@/lib/locations-data";

export async function getProvinces() {
    return Object.keys(LOCATIONS_DATA).sort();
}

export async function getCities(province: string) {
    if (!province) return [];
    return LOCATIONS_DATA[province] || [];
}
