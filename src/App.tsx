import React, { useState, useEffect } from 'react';
import { Search, Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Droplets, Eye, Gauge } from 'lucide-react';

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_mph: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
  };
}

interface LocationSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

function App() {
  const [query, setQuery] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);

  // Mock locations database
  const mockLocations: LocationSuggestion[] = [
    { id: 1, name: 'London', region: 'England', country: 'United Kingdom', lat: 51.52, lon: -0.11 },
    { id: 2, name: 'New York', region: 'New York', country: 'United States', lat: 40.71, lon: -74.01 },
    { id: 3, name: 'Tokyo', region: 'Tokyo', country: 'Japan', lat: 35.69, lon: 139.69 },
    { id: 4, name: 'Paris', region: 'Île-de-France', country: 'France', lat: 48.87, lon: 2.33 },
    { id: 5, name: 'Sydney', region: 'New South Wales', country: 'Australia', lat: -33.87, lon: 151.21 },
    { id: 6, name: 'Berlin', region: 'Berlin', country: 'Germany', lat: 52.52, lon: 13.41 },
    { id: 7, name: 'Madrid', region: 'Madrid', country: 'Spain', lat: 40.42, lon: -3.70 },
    { id: 8, name: 'Rome', region: 'Lazio', country: 'Italy', lat: 41.90, lon: 12.50 },
    { id: 9, name: 'Moscow', region: 'Moscow', country: 'Russia', lat: 55.76, lon: 37.62 },
    { id: 10, name: 'Beijing', region: 'Beijing', country: 'China', lat: 39.90, lon: 116.40 },
    { id: 11, name: 'Mumbai', region: 'Maharashtra', country: 'India', lat: 19.08, lon: 72.88 },
    { id: 12, name: 'São Paulo', region: 'São Paulo', country: 'Brazil', lat: -23.55, lon: -46.64 },
    { id: 13, name: 'Mexico City', region: 'Mexico City', country: 'Mexico', lat: 19.43, lon: -99.13 },
    { id: 14, name: 'Cairo', region: 'Cairo', country: 'Egypt', lat: 30.04, lon: 31.24 },
    { id: 15, name: 'Lagos', region: 'Lagos', country: 'Nigeria', lat: 6.52, lon: 3.38 },
    { id: 16, name: 'Buenos Aires', region: 'Buenos Aires', country: 'Argentina', lat: -34.61, lon: -58.38 },
    { id: 17, name: 'Toronto', region: 'Ontario', country: 'Canada', lat: 43.65, lon: -79.38 },
    { id: 18, name: 'Los Angeles', region: 'California', country: 'United States', lat: 34.05, lon: -118.24 },
    { id: 19, name: 'Bangkok', region: 'Bangkok', country: 'Thailand', lat: 13.76, lon: 100.50 },
    { id: 20, name: 'Seoul', region: 'Seoul', country: 'South Korea', lat: 37.57, lon: 126.98 },
    { id: 21, name: 'Chicago', region: 'Illinois', country: 'United States', lat: 41.88, lon: -87.63 },
{ id: 22, name: 'Barcelona', region: 'Catalonia', country: 'Spain', lat: 41.38, lon: 2.17 },
{ id: 23, name: 'Istanbul', region: 'Istanbul', country: 'Turkey', lat: 41.01, lon: 28.98 },
{ id: 24, name: 'Dubai', region: 'Dubai', country: 'United Arab Emirates', lat: 25.20, lon: 55.27 },
{ id: 25, name: 'Singapore', region: 'Central Singapore', country: 'Singapore', lat: 1.35, lon: 103.82 },
{ id: 26, name: 'Amsterdam', region: 'North Holland', country: 'Netherlands', lat: 52.37, lon: 4.89 },
{ id: 27, name: 'San Francisco', region: 'California', country: 'United States', lat: 37.77, lon: -122.42 },
{ id: 28, name: 'Lisbon', region: 'Lisbon', country: 'Portugal', lat: 38.72, lon: -9.14 },
{ id: 29, name: 'Hong Kong', region: 'Hong Kong', country: 'China', lat: 22.32, lon: 114.17 },
{ id: 30, name: 'Jakarta', region: 'Jakarta', country: 'Indonesia', lat: -6.21, lon: 106.85 },
{ id: 31, name: 'Lima', region: 'Lima', country: 'Peru', lat: -12.04, lon: -77.03 },
{ id: 32, name: 'Tehran', region: 'Tehran', country: 'Iran', lat: 35.69, lon: 51.39 },
{ id: 33, name: 'Karachi', region: 'Sindh', country: 'Pakistan', lat: 24.86, lon: 67.01 },
{ id: 34, name: 'Riyadh', region: 'Riyadh', country: 'Saudi Arabia', lat: 24.71, lon: 46.67 },
{ id: 35, name: 'Cape Town', region: 'Western Cape', country: 'South Africa', lat: -33.93, lon: 18.42 },
{ id: 36, name: 'Auckland', region: 'Auckland', country: 'New Zealand', lat: -36.85, lon: 174.76 },
{ id: 37, name: 'Hanoi', region: 'Hanoi', country: 'Vietnam', lat: 21.03, lon: 105.85 },
{ id: 38, name: 'Kuala Lumpur', region: 'Kuala Lumpur', country: 'Malaysia', lat: 3.14, lon: 101.69 },
{ id: 39, name: 'Athens', region: 'Attica', country: 'Greece', lat: 37.98, lon: 23.73 },
{ id: 40, name: 'Warsaw', region: 'Masovian', country: 'Poland', lat: 52.23, lon: 21.01 },
{ id: 41, name: 'Vienna', region: 'Vienna', country: 'Austria', lat: 48.21, lon: 16.37 },
{ id: 42, name: 'Brussels', region: 'Brussels-Capital', country: 'Belgium', lat: 50.85, lon: 4.35 },
{ id: 43, name: 'Zurich', region: 'Zurich', country: 'Switzerland', lat: 47.37, lon: 8.55 },
{ id: 44, name: 'Oslo', region: 'Oslo', country: 'Norway', lat: 59.91, lon: 10.75 },
{ id: 45, name: 'Stockholm', region: 'Stockholm', country: 'Sweden', lat: 59.33, lon: 18.06 },
{ id: 46, name: 'Copenhagen', region: 'Capital Region', country: 'Denmark', lat: 55.68, lon: 12.57 },
{ id: 47, name: 'Helsinki', region: 'Uusimaa', country: 'Finland', lat: 60.17, lon: 24.94 },
{ id: 48, name: 'Dublin', region: 'Leinster', country: 'Ireland', lat: 53.35, lon: -6.26 },
{ id: 49, name: 'Budapest', region: 'Central Hungary', country: 'Hungary', lat: 47.50, lon: 19.04 },
{ id: 50, name: 'Prague', region: 'Prague', country: 'Czech Republic', lat: 50.08, lon: 14.42 },
{ id: 51, name: 'Warsaw', region: 'Masovian', country: 'Poland', lat: 52.23, lon: 21.01 },
{ id: 52, name: 'Belgrade', region: 'Central Serbia', country: 'Serbia', lat: 44.82, lon: 20.46 },
{ id: 53, name: 'Sofia', region: 'Sofia City', country: 'Bulgaria', lat: 42.70, lon: 23.32 },
{ id: 54, name: 'Bucharest', region: 'Bucharest', country: 'Romania', lat: 44.43, lon: 26.10 },
{ id: 55, name: 'Kiev', region: 'Kyiv City', country: 'Ukraine', lat: 50.45, lon: 30.52 },
{ id: 56, name: 'Vilnius', region: 'Vilnius County', country: 'Lithuania', lat: 54.69, lon: 25.28 },
{ id: 57, name: 'Riga', region: 'Riga', country: 'Latvia', lat: 56.95, lon: 24.11 },
{ id: 58, name: 'Tallinn', region: 'Harju County', country: 'Estonia', lat: 59.44, lon: 24.75 },
{ id: 59, name: 'Casablanca', region: 'Casablanca-Settat', country: 'Morocco', lat: 33.57, lon: -7.59 },
{ id: 60, name: 'Algiers', region: 'Algiers', country: 'Algeria', lat: 36.75, lon: 3.04 },
{ id: 61, name: 'Nairobi', region: 'Nairobi', country: 'Kenya', lat: -1.29, lon: 36.82 },
{ id: 62, name: 'Accra', region: 'Greater Accra', country: 'Ghana', lat: 5.60, lon: -0.19 },
{ id: 63, name: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia', lat: 9.03, lon: 38.74 },
{ id: 64, name: 'Santiago', region: 'Santiago Metropolitan', country: 'Chile', lat: -33.45, lon: -70.66 },
{ id: 65, name: 'Bogotá', region: 'Bogotá', country: 'Colombia', lat: 4.71, lon: -74.07 },
{ id: 66, name: 'Caracas', region: 'Capital District', country: 'Venezuela', lat: 10.49, lon: -66.88 },
{ id: 67, name: 'Quito', region: 'Pichincha', country: 'Ecuador', lat: -0.23, lon: -78.52 },
{ id: 68, name: 'Guatemala City', region: 'Guatemala', country: 'Guatemala', lat: 14.63, lon: -90.52 },
{ id: 69, name: 'San José', region: 'San José', country: 'Costa Rica', lat: 9.93, lon: -84.08 },
{ id: 70, name: 'Panama City', region: 'Panamá', country: 'Panama', lat: 8.98, lon: -79.52 },
{ id: 71, name: 'Havana', region: 'Havana', country: 'Cuba', lat: 23.13, lon: -82.38 },
{ id: 72, name: 'Manila', region: 'Metro Manila', country: 'Philippines', lat: 14.60, lon: 120.98 },
{ id: 73, name: 'Taipei', region: 'Taipei City', country: 'Taiwan', lat: 25.03, lon: 121.56 },
{ id: 74, name: 'Ho Chi Minh City', region: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.82, lon: 106.63 },
{ id: 75, name: 'Baghdad', region: 'Baghdad', country: 'Iraq', lat: 33.32, lon: 44.36 },
{ id: 76, name: 'Damascus', region: 'Damascus', country: 'Syria', lat: 33.51, lon: 36.29 },
{ id: 77, name: 'Doha', region: 'Doha', country: 'Qatar', lat: 25.29, lon: 51.53 },
{ id: 78, name: 'Ankara', region: 'Ankara', country: 'Turkey', lat: 39.92, lon: 32.85 },
{ id: 79, name: 'Brasilia', region: 'Federal District', country: 'Brazil', lat: -15.79, lon: -47.88 },
{ id: 80, name: 'Montevideo', region: 'Montevideo', country: 'Uruguay', lat: -34.90, lon: -56.19 },
{ id: 81, name: 'Edinburgh', region: 'Scotland', country: 'United Kingdom', lat: 55.95, lon: -3.19 },
{ id: 82, name: 'Glasgow', region: 'Scotland', country: 'United Kingdom', lat: 55.86, lon: -4.25 },
{ id: 83, name: 'Manchester', region: 'England', country: 'United Kingdom', lat: 53.48, lon: -2.24 },
{ id: 84, name: 'Birmingham', region: 'England', country: 'United Kingdom', lat: 52.48, lon: -1.89 },
{ id: 85, name: 'Lyon', region: 'Auvergne-Rhône-Alpes', country: 'France', lat: 45.76, lon: 4.83 },
{ id: 86, name: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', country: 'France', lat: 43.30, lon: 5.38 },
{ id: 87, name: 'Naples', region: 'Campania', country: 'Italy', lat: 40.85, lon: 14.25 },
{ id: 88, name: 'Milan', region: 'Lombardy', country: 'Italy', lat: 45.46, lon: 9.19 },
{ id: 89, name: 'St. Petersburg', region: 'Saint Petersburg', country: 'Russia', lat: 59.93, lon: 30.36 },
{ id: 90, name: 'Novosibirsk', region: 'Novosibirsk Oblast', country: 'Russia', lat: 55.04, lon: 82.94 },
{ id: 91, name: 'Chengdu', region: 'Sichuan', country: 'China', lat: 30.67, lon: 104.07 },
{ id: 92, name: 'Shenzhen', region: 'Guangdong', country: 'China', lat: 22.54, lon: 114.06 },
{ id: 93, name: 'Guangzhou', region: 'Guangdong', country: 'China', lat: 23.13, lon: 113.26 },
{ id: 94, name: 'Ahmedabad', region: 'Gujarat', country: 'India', lat: 23.03, lon: 72.58 },
{ id: 95, name: 'Bangalore', region: 'Karnataka', country: 'India', lat: 12.97, lon: 77.59 },
{ id: 96, name: 'Chennai', region: 'Tamil Nadu', country: 'India', lat: 13.08, lon: 80.27 },
{ id: 97, name: 'Hyderabad', region: 'Telangana', country: 'India', lat: 17.39, lon: 78.49 },
{ id: 98, name: 'Rio de Janeiro', region: 'Rio de Janeiro', country: 'Brazil', lat: -22.91, lon: -43.17 },
{ id: 99, name: 'Salvador', region: 'Bahia', country: 'Brazil', lat: -12.97, lon: -38.51 },
{ id: 100, name: 'Medellín', region: 'Antioquia', country: 'Colombia', lat: 6.24, lon: -75.58 },
{ id: 101, name: 'Valencia', region: 'Valencian Community', country: 'Spain', lat: 39.47, lon: -0.38 },
{ id: 102, name: 'Seville', region: 'Andalusia', country: 'Spain', lat: 37.39, lon: -5.99 },
{ id: 103, name: 'Zaragoza', region: 'Aragon', country: 'Spain', lat: 41.65, lon: -0.89 },
{ id: 104, name: 'Bilbao', region: 'Basque Country', country: 'Spain', lat: 43.26, lon: -2.94 },
{ id: 105, name: 'Malaga', region: 'Andalusia', country: 'Spain', lat: 36.72, lon: -4.42 },
{ id: 106, name: 'Valparaiso', region: 'Valparaíso', country: 'Chile', lat: -33.05, lon: -71.62 },
{ id: 107, name: 'Castries', region: 'Castries', country: 'Saint Lucia', lat: 14.01, lon: -60.99 },
{ id: 108, name: 'Kingston', region: 'Kingston', country: 'Jamaica', lat: 18.00, lon: -76.79 },
{ id: 109, name: 'Port-au-Prince', region: 'Ouest', country: 'Haiti', lat: 18.54, lon: -72.34 },
{ id: 110, name: 'Brisbane', region: 'Queensland', country: 'Australia', lat: -27.47, lon: 153.03 },
{ id: 111, name: 'Melbourne', region: 'Victoria', country: 'Australia', lat: -37.81, lon: 144.96 },
{ id: 112, name: 'Perth', region: 'Western Australia', country: 'Australia', lat: -31.95, lon: 115.86 },
{ id: 113, name: 'Wellington', region: 'Wellington', country: 'New Zealand', lat: -41.29, lon: 174.78 },
{ id: 114, name: 'Montreal', region: 'Quebec', country: 'Canada', lat: 45.50, lon: -73.56 },
{ id: 115, name: 'Vancouver', region: 'British Columbia', country: 'Canada', lat: 49.28, lon: -123.12 },
{ id: 116, name: 'Calgary', region: 'Alberta', country: 'Canada', lat: 51.04, lon: -114.07 },
{ id: 117, name: 'Quebec City', region: 'Quebec', country: 'Canada', lat: 46.81, lon: -71.21 },
{ id: 118, name: 'Phoenix', region: 'Arizona', country: 'United States', lat: 33.45, lon: -112.07 },
{ id: 119, name: 'Houston', region: 'Texas', country: 'United States', lat: 29.76, lon: -95.37 },
{ id: 120, name: 'Philadelphia', region: 'Pennsylvania', country: 'United States', lat: 39.95, lon: -75.16 },
{ id: 121, name: 'Atlanta', region: 'Georgia', country: 'United States', lat: 33.75, lon: -84.39 },
{ id: 122, name: 'Detroit', region: 'Michigan', country: 'United States', lat: 42.33, lon: -83.05 },
{ id: 123, name: 'Minneapolis', region: 'Minnesota', country: 'United States', lat: 44.98, lon: -93.27 },
{ id: 124, name: 'Montpellier', region: 'Occitanie', country: 'France', lat: 43.61, lon: 3.88 },
{ id: 125, name: 'Toulouse', region: 'Occitanie', country: 'France', lat: 43.60, lon: 1.44 },
{ id: 126, name: 'Nagoya', region: 'Aichi', country: 'Japan', lat: 35.18, lon: 136.90 },
{ id: 127, name: 'Osaka', region: 'Osaka', country: 'Japan', lat: 34.69, lon: 135.50 },
{ id: 128, name: 'Fukuoka', region: 'Fukuoka', country: 'Japan', lat: 33.59, lon: 130.40 },
{ id: 129, name: 'Kuala Lumpur', region: 'Kuala Lumpur', country: 'Malaysia', lat: 3.14, lon: 101.69 },
{ id: 130, name: 'Medan', region: 'North Sumatra', country: 'Indonesia', lat: 3.58, lon: 98.67 },
{ id: 131, name: 'Surabaya', region: 'East Java', country: 'Indonesia', lat: -7.25, lon: 112.75 },
{ id: 132, name: 'Hiroshima', region: 'Hiroshima', country: 'Japan', lat: 34.39, lon: 132.45 },
{ id: 133, name: 'Sapporo', region: 'Hokkaido', country: 'Japan', lat: 43.07, lon: 141.34 },
{ id: 134, name: 'Lahore', region: 'Punjab', country: 'Pakistan', lat: 31.56, lon: 74.35 },
{ id: 135, name: 'Karachi', region: 'Sindh', country: 'Pakistan', lat: 24.86, lon: 67.01 },
{ id: 136, name: 'Islamabad', region: 'Islamabad Capital Territory', country: 'Pakistan', lat: 33.68, lon: 73.04 },
{ id: 137, name: 'Tehran', region: 'Tehran', country: 'Iran', lat: 35.69, lon: 51.42 },
{ id: 138, name: 'Baghdad', region: 'Baghdad', country: 'Iraq', lat: 33.31, lon: 44.36 },
{ id: 139, name: 'Riyadh', region: 'Riyadh', country: 'Saudi Arabia', lat: 24.71, lon: 46.68 },
{ id: 140, name: 'Dubai', region: 'Dubai', country: 'United Arab Emirates', lat: 25.27, lon: 55.30 },
{ id: 141, name: 'Abu Dhabi', region: 'Abu Dhabi', country: 'United Arab Emirates', lat: 24.47, lon: 54.37 },
{ id: 142, name: 'Jerusalem', region: 'Jerusalem', country: 'Israel', lat: 31.77, lon: 35.21 },
{ id: 143, name: 'Tel Aviv', region: 'Tel Aviv', country: 'Israel', lat: 32.08, lon: 34.78 },
{ id: 144, name: 'Istanbul', region: 'Istanbul', country: 'Turkey', lat: 41.01, lon: 28.96 },
{ id: 145, name: 'Ankara', region: 'Ankara', country: 'Turkey', lat: 39.93, lon: 32.85 },
{ id: 146, name: 'Buenos Aires', region: 'Buenos Aires', country: 'Argentina', lat: -34.61, lon: -58.38 },
{ id: 147, name: 'Santiago', region: 'Santiago Metropolitan', country: 'Chile', lat: -33.45, lon: -70.66 },
{ id: 148, name: 'Bogotá', region: 'Bogotá', country: 'Colombia', lat: 4.61, lon: -74.08 },
{ id: 149, name: 'Lima', region: 'Lima', country: 'Peru', lat: -12.04, lon: -77.03 },
{ id: 150, name: 'Quito', region: 'Pichincha', country: 'Ecuador', lat: -0.22, lon: -78.50 },
{ id: 151, name: 'Guayaquil', region: 'Guayas', country: 'Ecuador', lat: -2.18, lon: -79.90 },
{ id: 152, name: 'Montevideo', region: 'Montevideo', country: 'Uruguay', lat: -34.90, lon: -56.19 },
{ id: 153, name: 'Asunción', region: 'Asunción', country: 'Paraguay', lat: -25.29, lon: -57.64 },
{ id: 154, name: 'Havana', region: 'La Habana', country: 'Cuba', lat: 23.11, lon: -82.39 },
{ id: 155, name: 'Kingston', region: 'Kingston', country: 'Jamaica', lat: 18.00, lon: -76.79 },
{ id: 156, name: 'Port of Spain', region: 'Port of Spain', country: 'Trinidad and Tobago', lat: 10.65, lon: -61.51 },
{ id: 157, name: 'Nairobi', region: 'Nairobi', country: 'Kenya', lat: -1.29, lon: 36.82 },
{ id: 158, name: 'Johannesburg', region: 'Gauteng', country: 'South Africa', lat: -26.20, lon: 28.04 },
{ id: 159, name: 'Cape Town', region: 'Western Cape', country: 'South Africa', lat: -33.93, lon: 18.42 },
{ id: 160, name: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia', lat: 9.03, lon: 38.74 },
{ id: 161, name: 'Casablanca', region: 'Casablanca-Settat', country: 'Morocco', lat: 33.59, lon: -7.62 },
{ id: 162, name: 'Accra', region: 'Greater Accra', country: 'Ghana', lat: 5.56, lon: -0.20 },
{ id: 163, name: 'Dakar', region: 'Dakar', country: 'Senegal', lat: 14.69, lon: -17.44 },
{ id: 164, name: 'Algiers', region: 'Algiers', country: 'Algeria', lat: 36.75, lon: 3.04 },
{ id: 165, name: 'Tunis', region: 'Tunis', country: 'Tunisia', lat: 36.80, lon: 10.18 },
{ id: 166, name: 'Helsinki', region: 'Uusimaa', country: 'Finland', lat: 60.17, lon: 24.94 },
{ id: 167, name: 'Oslo', region: 'Oslo', country: 'Norway', lat: 59.91, lon: 10.75 },
{ id: 168, name: 'Stockholm', region: 'Stockholm', country: 'Sweden', lat: 59.33, lon: 18.06 },
{ id: 169, name: 'Copenhagen', region: 'Capital Region', country: 'Denmark', lat: 55.68, lon: 12.57 },
{ id: 170, name: 'Reykjavik', region: 'Capital Region', country: 'Iceland', lat: 64.13, lon: -21.90 },
{ id: 171, name: 'Vienna', region: 'Vienna', country: 'Austria', lat: 48.21, lon: 16.37 },
{ id: 172, name: 'Brussels', region: 'Brussels-Capital', country: 'Belgium', lat: 50.85, lon: 4.35 },
{ id: 173, name: 'Amsterdam', region: 'North Holland', country: 'Netherlands', lat: 52.37, lon: 4.90 },
{ id: 174, name: 'Zurich', region: 'Zurich', country: 'Switzerland', lat: 47.37, lon: 8.54 },
{ id: 175, name: 'Geneva', region: 'Geneva', country: 'Switzerland', lat: 46.20, lon: 6.15 },
{ id: 176, name: 'Lisbon', region: 'Lisbon', country: 'Portugal', lat: 38.72, lon: -9.14 },
{ id: 177, name: 'Porto', region: 'Norte', country: 'Portugal', lat: 41.15, lon: -8.61 },
{ id: 178, name: 'Kuala Lumpur', region: 'Federal Territory of Kuala Lumpur', country: 'Malaysia', lat: 3.14, lon: 101.69 },
{ id: 179, name: 'Singapore', region: 'Singapore', country: 'Singapore', lat: 1.35, lon: 103.82 },
{ id: 180, name: 'Jakarta', region: 'Jakarta', country: 'Indonesia', lat: -6.21, lon: 106.85 },
{ id: 181, name: 'Manila', region: 'National Capital Region', country: 'Philippines', lat: 14.60, lon: 120.98 },
{ id: 182, name: 'Ho Chi Minh City', region: 'Ho Chi Minh', country: 'Vietnam', lat: 10.77, lon: 106.69 },
{ id: 183, name: 'Hanoi', region: 'Hanoi', country: 'Vietnam', lat: 21.03, lon: 105.85 },
{ id: 184, name: 'Bangkok', region: 'Bangkok', country: 'Thailand', lat: 13.76, lon: 100.50 },
{ id: 185, name: 'Phnom Penh', region: 'Phnom Penh', country: 'Cambodia', lat: 11.56, lon: 104.93 },
{ id: 186, name: 'Vientiane', region: 'Vientiane Prefecture', country: 'Laos', lat: 17.97, lon: 102.61 },
{ id: 187, name: 'Kathmandu', region: 'Bagmati', country: 'Nepal', lat: 27.71, lon: 85.32 },
{ id: 188, name: 'Colombo', region: 'Western Province', country: 'Sri Lanka', lat: 6.93, lon: 79.85 },
{ id: 189, name: 'Dhaka', region: 'Dhaka Division', country: 'Bangladesh', lat: 23.81, lon: 90.41 },
{ id: 190, name: 'Tashkent', region: 'Tashkent', country: 'Uzbekistan', lat: 41.31, lon: 69.28 },
{ id: 191, name: 'Almaty', region: 'Almaty', country: 'Kazakhstan', lat: 43.25, lon: 76.95 },
{ id: 192, name: 'Bishkek', region: 'Bishkek', country: 'Kyrgyzstan', lat: 42.87, lon: 74.59 },
{ id: 193, name: 'Ulaanbaatar', region: 'Ulaanbaatar', country: 'Mongolia', lat: 47.92, lon: 106.92 },
{ id: 194, name: 'Havana', region: 'La Habana', country: 'Cuba', lat: 23.11, lon: -82.39 },
{ id: 195, name: 'San Juan', region: 'San Juan', country: 'Puerto Rico', lat: 18.46, lon: -66.11 },
{ id: 196, name: 'La Paz', region: 'La Paz', country: 'Bolivia', lat: -16.50, lon: -68.15 },
{ id: 197, name: 'Sucre', region: 'Chuquisaca', country: 'Bolivia', lat: -19.04, lon: -65.26 },
{ id: 198, name: 'Guatemala City', region: 'Guatemala', country: 'Guatemala', lat: 14.62, lon: -90.53 },
{ id: 199, name: 'Tegucigalpa', region: 'Francisco Morazán', country: 'Honduras', lat: 14.10, lon: -87.22 },
{ id: 200, name: 'San Salvador', region: 'San Salvador', country: 'El Salvador', lat: 13.69, lon: -89.19 },
{ id: 201, name: 'Panama City', region: 'Panama', country: 'Panama', lat: 8.98, lon: -79.52 },
{ id: 202, name: 'Kingston', region: 'Kingston', country: 'Jamaica', lat: 18.00, lon: -76.79 },
{ id: 203, name: 'Bridgetown', region: 'Saint Michael', country: 'Barbados', lat: 13.10, lon: -59.62 },
{ id: 204, name: 'Port-au-Prince', region: 'Ouest', country: 'Haiti', lat: 18.54, lon: -72.34 },
{ id: 205, name: 'Nassau', region: 'New Providence', country: 'Bahamas', lat: 25.06, lon: -77.34 },
{ id: 206, name: 'Reykjavik', region: 'Capital Region', country: 'Iceland', lat: 64.13, lon: -21.90 },
{ id: 207, name: 'Valletta', region: 'Valletta', country: 'Malta', lat: 35.90, lon: 14.51 },
{ id: 208, name: 'Victoria', region: 'Seychelles', country: 'Seychelles', lat: -4.62, lon: 55.45 },
{ id: 209, name: 'Auckland', region: 'Auckland', country: 'New Zealand', lat: -36.85, lon: 174.76 },
{ id: 210, name: 'Wellington', region: 'Wellington', country: 'New Zealand', lat: -41.29, lon: 174.78 },
{ id: 211, name: 'Christchurch', region: 'Canterbury', country: 'New Zealand', lat: -43.53, lon: 172.63 },
{ id: 212, name: 'Adelaide', region: 'South Australia', country: 'Australia', lat: -34.93, lon: 138.60 },
{ id: 213, name: 'Melbourne', region: 'Victoria', country: 'Australia', lat: -37.81, lon: 144.96 },
{ id: 214, name: 'Brisbane', region: 'Queensland', country: 'Australia', lat: -27.47, lon: 153.03 },
{ id: 215, name: 'Perth', region: 'Western Australia', country: 'Australia', lat: -31.95, lon: 115.86 },
{ id: 216, name: 'Canberra', region: 'Australian Capital Territory', country: 'Australia', lat: -35.28, lon: 149.13 },
{ id: 217, name: 'Oslo', region: 'Oslo', country: 'Norway', lat: 59.91, lon: 10.75 },
{ id: 218, name: 'Stockholm', region: 'Stockholm', country: 'Sweden', lat: 59.33, lon: 18.06 },
{ id: 219, name: 'Helsinki', region: 'Uusimaa', country: 'Finland', lat: 60.17, lon: 24.94 },
{ id: 220, name: 'Copenhagen', region: 'Capital Region', country: 'Denmark', lat: 55.68, lon: 12.57 },
{ id: 221, name: 'Amsterdam', region: 'North Holland', country: 'Netherlands', lat: 52.37, lon: 4.90 },
{ id: 222, name: 'Brussels', region: 'Brussels-Capital', country: 'Belgium', lat: 50.85, lon: 4.35 },
{ id: 223, name: 'Vienna', region: 'Vienna', country: 'Austria', lat: 48.21, lon: 16.37 },
{ id: 224, name: 'Zurich', region: 'Zurich', country: 'Switzerland', lat: 47.38, lon: 8.54 },
{ id: 225, name: 'Geneva', region: 'Geneva', country: 'Switzerland', lat: 46.21, lon: 6.14 },
{ id: 226, name: 'Lisbon', region: 'Lisbon', country: 'Portugal', lat: 38.72, lon: -9.14 },
{ id: 227, name: 'Porto', region: 'Northern Portugal', country: 'Portugal', lat: 41.15, lon: -8.61 },
{ id: 228, name: 'Dublin', region: 'Leinster', country: 'Ireland', lat: 53.35, lon: -6.26 },
{ id: 229, name: 'Edinburgh', region: 'Scotland', country: 'United Kingdom', lat: 55.95, lon: -3.19 },
{ id: 230, name: 'Glasgow', region: 'Scotland', country: 'United Kingdom', lat: 55.86, lon: -4.25 },
{ id: 231, name: 'Belfast', region: 'Northern Ireland', country: 'United Kingdom', lat: 54.60, lon: -5.93 },
{ id: 232, name: 'Warsaw', region: 'Masovian', country: 'Poland', lat: 52.23, lon: 21.01 },
{ id: 233, name: 'Prague', region: 'Prague', country: 'Czech Republic', lat: 50.08, lon: 14.43 },
{ id: 234, name: 'Budapest', region: 'Central Hungary', country: 'Hungary', lat: 47.50, lon: 19.04 },
{ id: 235, name: 'Bratislava', region: 'Bratislava', country: 'Slovakia', lat: 48.15, lon: 17.11 },
{ id: 236, name: 'Ljubljana', region: 'Central Slovenia', country: 'Slovenia', lat: 46.05, lon: 14.51 },
{ id: 237, name: 'Zagreb', region: 'City of Zagreb', country: 'Croatia', lat: 45.81, lon: 15.98 },
{ id: 238, name: 'Sarajevo', region: 'Sarajevo', country: 'Bosnia and Herzegovina', lat: 43.85, lon: 18.41 },
{ id: 239, name: 'Belgrade', region: 'Belgrade', country: 'Serbia', lat: 44.82, lon: 20.46 },
{ id: 240, name: 'Skopje', region: 'Skopje', country: 'North Macedonia', lat: 41.99, lon: 21.43 },
{ id: 241, name: 'Tirana', region: 'Tirana', country: 'Albania', lat: 41.32, lon: 19.82 },
{ id: 242, name: 'Athens', region: 'Attica', country: 'Greece', lat: 37.98, lon: 23.72 },
{ id: 243, name: 'Nicosia', region: 'Nicosia District', country: 'Cyprus', lat: 35.17, lon: 33.36 },
{ id: 244, name: 'Luxembourg City', region: 'Luxembourg', country: 'Luxembourg', lat: 49.61, lon: 6.13 },
{ id: 245, name: 'Monaco', region: 'Monaco', country: 'Monaco', lat: 43.73, lon: 7.42 },
{ id: 246, name: 'Andorra la Vella', region: 'Andorra la Vella', country: 'Andorra', lat: 42.51, lon: 1.52 },
{ id: 247, name: 'Vaduz', region: 'Vaduz', country: 'Liechtenstein', lat: 47.14, lon: 9.52 },
{ id: 248, name: 'San Marino', region: 'San Marino', country: 'San Marino', lat: 43.93, lon: 12.45 },
{ id: 249, name: 'Valletta', region: 'Malta', country: 'Malta', lat: 35.90, lon: 14.51 },
{ id: 250, name: 'Castries', region: 'Castries', country: 'Saint Lucia', lat: 14.01, lon: -60.99 },
{ id: 251, name: 'Kingstown', region: 'Saint Vincent and the Grenadines', country: 'Saint Vincent and the Grenadines', lat: 13.16, lon: -61.23 },
{ id: 252, name: 'Roseau', region: 'Dominica', country: 'Dominica', lat: 15.30, lon: -61.39 },
{ id: 253, name: 'Basseterre', region: 'Saint Kitts and Nevis', country: 'Saint Kitts and Nevis', lat: 17.30, lon: -62.72 },
{ id: 254, name: 'Georgetown', region: 'Demerara-Mahaica', country: 'Guyana', lat: 6.80, lon: -58.16 },
{ id: 255, name: 'Paramaribo', region: 'Paramaribo', country: 'Suriname', lat: 5.85, lon: -55.17 },
{ id: 256, name: 'Cayenne', region: 'Cayenne', country: 'French Guiana', lat: 4.93, lon: -52.33 },
{ id: 257, name: 'Fort-de-France', region: 'Martinique', country: 'France', lat: 14.61, lon: -61.07 },
{ id: 258, name: 'Papeete', region: 'Windward Islands', country: 'French Polynesia', lat: -17.53, lon: -149.57 },
{ id: 259, name: 'Nouméa', region: 'South Province', country: 'New Caledonia', lat: -22.27, lon: 166.44 },
{ id: 260, name: 'Apia', region: 'Tuamasaga', country: 'Samoa', lat: -13.83, lon: -171.77 },
{ id: 261, name: 'Nukuʻalofa', region: 'Tongatapu', country: 'Tonga', lat: -21.14, lon: -175.20 },
{ id: 262, name: 'Suva', region: 'Rewa', country: 'Fiji', lat: -18.13, lon: 178.42 },
{ id: 263, name: 'Port Moresby', region: 'National Capital District', country: 'Papua New Guinea', lat: -9.44, lon: 147.18 },
{ id: 264, name: 'Honiara', region: 'Guadalcanal', country: 'Solomon Islands', lat: -9.43, lon: 159.95 },
{ id: 265, name: 'Palikir', region: 'Pohnpei', country: 'Federated States of Micronesia', lat: 6.92, lon: 158.16 },
{ id: 266, name: 'Majuro', region: 'Majuro', country: 'Marshall Islands', lat: 7.09, lon: 171.38 },
{ id: 267, name: 'Tarawa', region: 'South Tarawa', country: 'Kiribati', lat: 1.33, lon: 173.00 },
{ id: 268, name: 'Funafuti', region: 'Funafuti', country: 'Tuvalu', lat: -8.52, lon: 179.19 },
{ id: 269, name: 'Vatican City', region: 'Vatican City', country: 'Vatican City', lat: 41.90, lon: 12.45 },
{ id: 270, name: 'Longyearbyen', region: 'Svalbard', country: 'Norway', lat: 78.22, lon: 15.64 },
{ id: 271, name: 'Barrow (Utqiaġvik)', region: 'Alaska', country: 'United States', lat: 71.29, lon: -156.79 },
{ id: 272, name: 'Alert', region: 'Nunavut', country: 'Canada', lat: 82.50, lon: -62.35 },
{ id: 273, name: 'Thule Air Base', region: 'Greenland', country: 'Denmark', lat: 76.53, lon: -68.70 },
{ id: 274, name: 'McMurdo Station', region: 'Ross Dependency', country: 'Antarctica', lat: -77.85, lon: 166.67 },
{ id: 275, name: 'Palmer Station', region: 'Antarctica', country: 'Antarctica', lat: -64.77, lon: -64.05 },
{ id: 276, name: 'Vostok Station', region: 'Antarctica', country: 'Antarctica', lat: -78.46, lon: 106.84 },
{ id: 277, name: 'Rothera Research Station', region: 'Antarctica', country: 'Antarctica', lat: -67.57, lon: -68.13 },
{ id: 278, name: 'Halley Research Station', region: 'Antarctica', country: 'Antarctica', lat: -75.57, lon: -26.16 },
{ id: 279, name: 'Neumayer Station III', region: 'Antarctica', country: 'Antarctica', lat: -70.65, lon: -8.25 },
{ id: 280, name: 'Troll Station', region: 'Antarctica', country: 'Antarctica', lat: -72.01, lon: 2.53 },
{ id: 281, name: 'Puerto Williams', region: 'Magallanes', country: 'Chile', lat: -55.05, lon: -67.62 },
{ id: 282, name: 'Inuvik', region: 'Northwest Territories', country: 'Canada', lat: 68.36, lon: -133.72 },
{ id: 283, name: 'Iqaluit', region: 'Nunavut', country: 'Canada', lat: 63.75, lon: -68.52 },
{ id: 284, name: 'Norilsk', region: 'Krasnoyarsk Krai', country: 'Russia', lat: 69.34, lon: 88.19 },
{ id: 285, name: 'Yakutsk', region: 'Sakha Republic', country: 'Russia', lat: 62.03, lon: 129.73 },
{ id: 286, name: 'Barentsburg', region: 'Svalbard', country: 'Norway', lat: 78.07, lon: 14.21 },
{ id: 287, name: 'Hammerfest', region: 'Troms og Finnmark', country: 'Norway', lat: 70.66, lon: 23.67 },
{ id: 288, name: 'Kiruna', region: 'Norrbotten County', country: 'Sweden', lat: 67.86, lon: 20.22 },
{ id: 289, name: 'Tromsø', region: 'Troms og Finnmark', country: 'Norway', lat: 69.65, lon: 18.96 },
{ id: 290, name: 'Svalbard', region: 'Svalbard', country: 'Norway', lat: 77.97, lon: 23.43 },
{ id: 291, name: 'Nuuk', region: 'Kommuneqarfik Sermersooq', country: 'Greenland', lat: 64.18, lon: -51.72 },
{ id: 292, name: 'Reykjavik', region: 'Capital Region', country: 'Iceland', lat: 64.13, lon: -21.90 },
{ id: 293, name: 'Akureyri', region: 'Northeast', country: 'Iceland', lat: 65.69, lon: -18.09 },
{ id: 294, name: 'Grytviken', region: 'South Georgia and the South Sandwich Islands', country: 'United Kingdom', lat: -54.28, lon: -36.50 },
{ id: 295, name: 'Saint-Pierre', region: 'Saint Pierre and Miquelon', country: 'France', lat: 46.77, lon: -56.18 },
{ id: 296, name: 'Montserrat', region: 'Montserrat', country: 'United Kingdom', lat: 16.74, lon: -62.19 },
{ id: 297, name: 'Gibraltar', region: 'Gibraltar', country: 'United Kingdom', lat: 36.14, lon: -5.35 },
{ id: 298, name: 'Falkland Islands', region: 'Stanley', country: 'United Kingdom', lat: -51.70, lon: -57.85 },
{ id: 299, name: 'Saint Helena', region: 'Saint Helena', country: 'United Kingdom', lat: -15.95, lon: -5.70 },
{ id: 300, name: 'Ascension Island', region: 'Ascension Island', country: 'United Kingdom', lat: -7.95, lon: -14.42 },
{ id: 301, name: 'Tristan da Cunha', region: 'Tristan da Cunha', country: 'United Kingdom', lat: -37.05, lon: -12.28 },
{ id: 302, name: 'Bouvet Island', region: 'Bouvet Island', country: 'Norway', lat: -54.43, lon: 3.40 },
{ id: 303, name: 'Heard Island and McDonald Islands', region: 'Heard Island and McDonald Islands', country: 'Australia', lat: -53.10, lon: 73.50 },
{ id: 304, name: 'Pitcairn Islands', region: 'Pitcairn', country: 'United Kingdom', lat: -25.06, lon: -130.10 },
{ id: 305, name: 'Easter Island', region: 'Valparaíso', country: 'Chile', lat: -27.11, lon: -109.36 },
{ id: 306, name: 'Kiritimati', region: 'Line Islands', country: 'Kiribati', lat: 1.87, lon: -157.34 },
{ id: 307, name: 'Diego Garcia', region: 'British Indian Ocean Territory', country: 'United Kingdom', lat: -7.31, lon: 72.41 },
{ id: 308, name: 'Christmas Island', region: 'Australian External Territories', country: 'Australia', lat: -10.45, lon: 105.69 },
{ id: 309, name: 'Cocos (Keeling) Islands', region: 'Australian External Territories', country: 'Australia', lat: -12.16, lon: 96.87 },
{ id: 310, name: 'Norfolk Island', region: 'Norfolk Island', country: 'Australia', lat: -29.03, lon: 167.95 },
{ id: 311, name: 'Sana’a', region: 'Sana\'a', country: 'Yemen', lat: 15.35, lon: 44.21 },
{ id: 312, name: 'Jerusalem', region: 'Jerusalem', country: 'Israel', lat: 31.77, lon: 35.22 },
{ id: 313, name: 'Tiraspol', region: 'Transnistria', country: 'Moldova', lat: 46.85, lon: 29.63 },
{ id: 314, name: 'Nicosia (North)', region: 'Nicosia District', country: 'Northern Cyprus', lat: 35.18, lon: 33.37 },
{ id: 315, name: 'Taipei', region: 'Taipei City', country: 'Taiwan', lat: 25.03, lon: 121.56 },
{ id: 316, name: 'Hong Kong', region: 'Hong Kong', country: 'China', lat: 22.28, lon: 114.16 },
{ id: 317, name: 'Macau', region: 'Macau', country: 'China', lat: 22.20, lon: 113.55 },
{ id: 318, name: 'Gaza City', region: 'Gaza Strip', country: 'Palestine', lat: 31.52, lon: 34.47 },
{ id: 319, name: 'Ramallah', region: 'West Bank', country: 'Palestine', lat: 31.90, lon: 35.20 },
{ id: 320, name: 'Lhasa', region: 'Tibet', country: 'China', lat: 29.65, lon: 91.13 },
{ id: 321, name: 'Ulaanbaatar', region: 'Ulaanbaatar', country: 'Mongolia', lat: 47.92, lon: 106.92 },
{ id: 322, name: 'Thimphu', region: 'Thimphu', country: 'Bhutan', lat: 27.47, lon: 89.64 },
{ id: 323, name: 'Male', region: 'Kaafu Atoll', country: 'Maldives', lat: 4.17, lon: 73.51 },
{ id: 324, name: 'Bandar Seri Begawan', region: 'Brunei-Muara', country: 'Brunei', lat: 4.89, lon: 114.93 },
{ id: 325, name: 'Port Vila', region: 'Shefa Province', country: 'Vanuatu', lat: -17.74, lon: 168.32 },
{ id: 326, name: 'Suva', region: 'Central Division', country: 'Fiji', lat: -18.14, lon: 178.42 },
{ id: 327, name: 'Ngerulmud', region: 'Melekeok', country: 'Palau', lat: 7.50, lon: 134.62 },
{ id: 328, name: 'Palikir', region: 'Pohnpei', country: 'Federated States of Micronesia', lat: 6.92, lon: 158.16 },
{ id: 329, name: 'Majuro', region: 'Majuro Atoll', country: 'Marshall Islands', lat: 7.07, lon: 171.38 },
{ id: 330, name: 'Honiara', region: 'Guadalcanal Province', country: 'Solomon Islands', lat: -9.43, lon: 159.95 },
{ id: 331, name: 'Nouméa', region: 'South Province', country: 'New Caledonia', lat: -22.27, lon: 166.44 },
{ id: 332, name: 'Apia', region: "Tuamasaga", country: 'Samoa', lat: -13.83, lon: -171.77 },
{ id: 333, name: 'Nukuʻalofa', region: 'Tongatapu', country: 'Tonga', lat: -21.13, lon: -175.20 },
{ id: 334, name: 'Funafuti', region: 'Funafuti', country: 'Tuvalu', lat: -8.52, lon: 179.19 },
{ id: 335, name: 'Port Moresby', region: 'National Capital District', country: 'Papua New Guinea', lat: -9.44, lon: 147.18 },
{ id: 336, name: 'Pago Pago', region: 'Eastern District', country: 'American Samoa', lat: -14.28, lon: -170.70 },
{ id: 337, name: 'Wellington', region: 'Wellington', country: 'New Zealand', lat: -41.29, lon: 174.78 },
{ id: 338, name: 'Suva', region: 'Central', country: 'Fiji', lat: -18.13, lon: 178.43 },
{ id: 339, name: 'Christchurch', region: 'Canterbury', country: 'New Zealand', lat: -43.53, lon: 172.63 },
{ id: 340, name: 'Auckland', region: 'Auckland', country: 'New Zealand', lat: -36.85, lon: 174.76 },
{ id: 341, name: 'Hanga Roa', region: 'Easter Island', country: 'Chile', lat: -27.16, lon: -109.44 },



  ];

  // Debounced search for location suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 1) {
        searchLocations(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchLocations = (searchQuery: string) => {
    const filteredLocations = mockLocations.filter(location => 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSuggestions(filteredLocations.slice(0, 8));
    setShowSuggestions(filteredLocations.length > 0);
  };

  const generateMockWeather = (locationName: string): WeatherData => {
    const conditions = [
      { text: 'Sunny', temp: 25 },
      { text: 'Partly cloudy', temp: 20 },
      { text: 'Cloudy', temp: 15 },
      { text: 'Light rain', temp: 12 },
      { text: 'Clear', temp: 22 },
      { text: 'Overcast', temp: 16 },
      { text: 'Light snow', temp: -2 },
      { text: 'Fog', temp: 8 }
    ];

    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const tempC = randomCondition.temp + Math.floor(Math.random() * 10) - 5;
    const tempF = Math.round(tempC * 9/5 + 32);
    const windKph = Math.floor(Math.random() * 25) + 5;
    const windMph = Math.round(windKph * 0.621371);
    const pressureMb = Math.floor(Math.random() * 50) + 1000;
    const pressureIn = Math.round(pressureMb * 0.02953 * 100) / 100;
    const precipMm = Math.floor(Math.random() * 15);
    const precipIn = Math.round(precipMm * 0.0393701 * 100) / 100;
    const humidity = Math.floor(Math.random() * 40) + 40;
    const cloud = Math.floor(Math.random() * 100);
    const feelslikeC = tempC + Math.floor(Math.random() * 6) - 3;
    const feelslikeF = Math.round(feelslikeC * 9/5 + 32);
    const visKm = Math.floor(Math.random() * 20) + 5;
    const visMiles = Math.round(visKm * 0.621371);
    const uv = Math.floor(Math.random() * 10) + 1;

    return {
      location: {
        name: locationName,
        region: 'Demo Region',
        country: 'Demo Country',
        localtime: new Date().toLocaleString()
      },
      current: {
        temp_c: tempC,
        temp_f: tempF,
        condition: {
          text: randomCondition.text,
          icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
          code: 1000
        },
        wind_kph: windKph,
        wind_mph: windMph,
        wind_dir: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        pressure_mb: pressureMb,
        pressure_in: pressureIn,
        precip_mm: precipMm,
        precip_in: precipIn,
        humidity: humidity,
        cloud: cloud,
        feelslike_c: feelslikeC,
        feelslike_f: feelslikeF,
        vis_km: visKm,
        vis_miles: visMiles,
        uv: uv
      }
    };
  };

  const fetchWeather = async (location: string) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const locationName = location.split(',')[0] || location;
      const mockWeatherData = generateMockWeather(locationName);
      
      setWeather(mockWeatherData);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    const locationString = `${location.name}, ${location.region}, ${location.country}`;
    setQuery(locationString);
    setShowSuggestions(false);
    fetchWeather(location.name);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      fetchWeather(query.trim());
    }
  };

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return <Sun className="w-8 h-8 text-yellow-400" />;
    } else if (lowerCondition.includes('rain')) {
      return <CloudRain className="w-8 h-8 text-blue-400" />;
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className="w-8 h-8 text-blue-300" />;
    } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
      return <Cloud className="w-8 h-8 text-gray-400" />;
    } else {
      return <Sun className="w-8 h-8 text-yellow-400" />;
    }
  };

  const formatTemperature = (tempC: number, tempF: number) => {
    return isCelsius ? `${tempC}°C` : `${tempF}°F`;
  };

  const formatWind = (kph: number, mph: number) => {
    return isCelsius ? `${kph} km/h` : `${mph} mph`;
  };

  const formatPressure = (mb: number, inches: number) => {
    return isCelsius ? `${mb} mb` : `${inches} in`;
  };

  const formatVisibility = (km: number, miles: number) => {
    return isCelsius ? `${km} km` : `${miles} mi`;
  };

  const formatPrecipitation = (mm: number, inches: number) => {
    return isCelsius ? `${mm} mm` : `${inches} in`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <Cloud className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Global Weather</h1>
          <p className="text-blue-100 text-lg">Current weather conditions worldwide</p>
        </div>

        {/* Search Section */}
        <div className="relative mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for any city, state, or country..."
                className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm rounded-2xl border-0 focus:ring-4 focus:ring-white/30 focus:outline-none text-gray-800 placeholder-gray-500 text-lg shadow-xl"
              />
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 z-10 max-h-60 overflow-y-auto">
                {suggestions.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="font-medium text-gray-800">{location.name}</div>
                    <div className="text-sm text-gray-600">{location.region}, {location.country}</div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="text-white mt-4 text-lg">Loading weather data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-300 rounded-xl p-6 mb-8">
            <p className="text-white text-center">{error}</p>
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="space-y-6">
            {/* Main Weather Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{weather.location.name}</h2>
                  <p className="text-blue-100 text-lg">{weather.location.region}, {weather.location.country}</p>
                  <p className="text-blue-200 text-sm mt-1">Local time: {weather.location.localtime}</p>
                </div>
                <button
                  onClick={() => setIsCelsius(!isCelsius)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 text-white font-medium transition-all duration-200"
                >
                  {isCelsius ? '°C' : '°F'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {getWeatherIcon(weather.current.condition.text)}
                  <div>
                    <div className="text-6xl font-bold text-white mb-2">
                      {formatTemperature(weather.current.temp_c, weather.current.temp_f)}
                    </div>
                    <p className="text-blue-100 text-xl">{weather.current.condition.text}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-lg">Feels like</p>
                  <p className="text-white text-2xl font-semibold">
                    {formatTemperature(weather.current.feelslike_c, weather.current.feelslike_f)}
                  </p>
                </div>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Wind className="w-6 h-6 text-blue-200" />
                  <span className="text-blue-100 font-medium">Wind</span>
                </div>
                <p className="text-white text-2xl font-bold">{formatWind(weather.current.wind_kph, weather.current.wind_mph)}</p>
                <p className="text-blue-200 text-sm">{weather.current.wind_dir}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Droplets className="w-6 h-6 text-blue-200" />
                  <span className="text-blue-100 font-medium">Humidity</span>
                </div>
                <p className="text-white text-2xl font-bold">{weather.current.humidity}%</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Gauge className="w-6 h-6 text-blue-200" />
                  <span className="text-blue-100 font-medium">Pressure</span>
                </div>
                <p className="text-white text-2xl font-bold">{formatPressure(weather.current.pressure_mb, weather.current.pressure_in)}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Eye className="w-6 h-6 text-blue-200" />
                  <span className="text-blue-100 font-medium">Visibility</span>
                </div>
                <p className="text-white text-2xl font-bold">{formatVisibility(weather.current.vis_km, weather.current.vis_miles)}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Cloud className="w-6 h-6 text-blue-200" />
                  <span className="text-blue-100 font-medium">Cloud Cover</span>
                </div>
                <p className="text-white text-2xl font-bold">{weather.current.cloud}%</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Sun className="w-6 h-6 text-blue-200" />
                  <span className="text-blue-100 font-medium">UV Index</span>
                </div>
                <p className="text-white text-2xl font-bold">{weather.current.uv}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 md:col-span-2">
                <div className="flex items-center space-x-3 mb-3">
                  <CloudRain className="w-6 h-6 text-blue-200" />
                  <span className="text-blue-100 font-medium">Precipitation</span>
                </div>
                <p className="text-white text-2xl font-bold">
                  {formatPrecipitation(weather.current.precip_mm, weather.current.precip_in)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!weather && !loading && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Search for Weather</h3>
            <p className="text-blue-100 text-lg max-w-md mx-auto">
              Enter any city, state, or country name to get current weather conditions and detailed meteorological data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;