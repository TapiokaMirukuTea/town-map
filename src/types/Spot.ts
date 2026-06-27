export type Spot = {
    id: number;
    name: string;
    lat: number;
    lng: number;

    category: string;
    icon: string;

    description: string;
    image: string;

    website?: string;
    address?: string;
};
