export interface LocationProfile {
    timezone: string;
    country: string
    countryCode: string
    city: string
    region: string
    regionName: string
    zip?: string
    locale: string;
    latitude: number;
    longitude: number;
    proxy: boolean
    webrtcMode: 'default' | 'disabled';
  }
  