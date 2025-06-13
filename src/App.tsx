import React, { useEffect, useState, useRef } from "react";

interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
  relativehumidity: number;
  pressure: number;
}

interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}

interface HourlyData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  windspeed_10m: number[];
  precipitation: number[];
  shortwave_radiation: number[];
  cloudcover: number[];
}

interface Location {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

const locations: Location[] = [
{"id": 1, "name": "Herat", "region": "Herat", "country": "Afghanistan", "lat": 34.3529, "lon": 62.204},
{"id": 2, "name": "Kabul", "region": "Kabul", "country": "Afghanistan", "lat": 34.5553, "lon": 69.2075},
{"id": 3, "name": "Berat", "region": "Berat", "country": "Albania", "lat": 40.7048, "lon": 19.9497},
{"id": 4, "name": "Durrës", "region": "Durrës", "country": "Albania", "lat": 41.324, "lon": 19.45},
{"id": 5, "name": "Shkoder", "region": "Shkodër", "country": "Albania", "lat": 42.0683, "lon": 19.5119},
{"id": 6, "name": "Tirana", "region": "Tirana", "country": "Albania", "lat": 41.3275, "lon": 19.8187},
{"id": 7, "name": "Algiers", "region": "Algiers", "country": "Algeria", "lat": 36.75, "lon": 3.04},
{"id": 8, "name": "Algiers", "region": "Algiers Province", "country": "Algeria", "lat": 36.7538, "lon": 3.0588},
{"id": 9, "name": "Constantine", "region": "Constantine Province", "country": "Algeria", "lat": 36.365, "lon": 6.6147},
{"id": 10, "name": "Oran", "region": "Oran Province", "country": "Algeria", "lat": 35.6971, "lon": -0.6351},
{"id": 11, "name": "Pago Pago", "region": "Eastern District", "country": "American Samoa", "lat": -14.276, "lon": -170.706},
{"id": 12, "name": "Andorra la Vella", "region": "Andorra la Vella", "country": "Andorra", "lat": 42.5063, "lon": 1.5218},
{"id": 13, "name": "Benguela", "region": "Benguela", "country": "Angola", "lat": -12.5797, "lon": 13.4052},
{"id": 14, "name": "Lobito", "region": "Benguela", "country": "Angola", "lat": -12.3597, "lon": 13.5308},
{"id": 15, "name": "Luanda", "region": "Luanda", "country": "Angola", "lat": -8.8383, "lon": 13.2344},
{"id": 16, "name": "Buenos Aires", "region": "Buenos Aires", "country": "Argentina", "lat": -34.61, "lon": -58.38},
{"id": 17, "name": "Oranjestad", "region": "Aruba", "country": "Aruba", "lat": 12.5236, "lon": -70.027},
{"id": 18, "name": "Sydney", "region": "New South Wales", "country": "Australia", "lat": -33.87, "lon": 151.21},
{"id": 19, "name": "Graz", "region": "Styria", "country": "Austria", "lat": 47.0707, "lon": 15.4395},
{"id": 20, "name": "Innsbruck", "region": "Tyrol", "country": "Austria", "lat": 47.2692, "lon": 11.4041},
{"id": 21, "name": "Linz", "region": "Upper Austria", "country": "Austria", "lat": 48.3069, "lon": 14.2858},
{"id": 22, "name": "Salzburg", "region": "Salzburg", "country": "Austria", "lat": 47.8095, "lon": 13.055},
{"id": 23, "name": "Vienna", "region": "Vienna", "country": "Austria", "lat": 48.21, "lon": 16.37},
{"id": 24, "name": "Nassau", "region": "New Providence", "country": "Bahamas", "lat": 25.0443, "lon": -77.3504},
{"id": 25, "name": "Manama", "region": "Capital", "country": "Bahrain", "lat": 26.2235, "lon": 50.5876},
{"id": 26, "name": "Chittagong", "region": "Chittagong Division", "country": "Bangladesh", "lat": 22.3569, "lon": 91.7832},
{"id": 27, "name": "Dhaka", "region": "Dhaka Division", "country": "Bangladesh", "lat": 23.8103, "lon": 90.4125},
{"id": 28, "name": "Bridgetown", "region": "Saint Michael", "country": "Barbados", "lat": 13.0975, "lon": -59.6165},
{"id": 29, "name": "Minsk", "region": "Minsk", "country": "Belarus", "lat": 53.9045, "lon": 27.5615},
{"id": 30, "name": "Antwerp", "region": "Antwerp", "country": "Belgium", "lat": 51.2194, "lon": 4.4024},
{"id": 31, "name": "Bruges", "region": "West Flanders", "country": "Belgium", "lat": 51.2093, "lon": 3.2247},
{"id": 32, "name": "Brussels", "region": "Brussels-Capital", "country": "Belgium", "lat": 50.85, "lon": 4.35},
{"id": 33, "name": "Ghent", "region": "East Flanders", "country": "Belgium", "lat": 51.0543, "lon": 3.7174},
{"id": 34, "name": "Liege", "region": "Liege", "country": "Belgium", "lat": 50.6326, "lon": 5.5797},
{"id": 35, "name": "Belmopan", "region": "Cayo", "country": "Belize", "lat": 17.25, "lon": -88.7667},
{"id": 36, "name": "Corozal Town", "region": "Corozal", "country": "Belize", "lat": 18.4, "lon": -88.4},
{"id": 37, "name": "Dangriga", "region": "Stann Creek", "country": "Belize", "lat": 16.97, "lon": -88.22},
{"id": 38, "name": "Orange Walk Town", "region": "Orange Walk", "country": "Belize", "lat": 18.075, "lon": -88.5583},
{"id": 39, "name": "Punta Gorda", "region": "Toledo", "country": "Belize", "lat": 16.1, "lon": -88.8},
{"id": 40, "name": "San Ignacio", "region": "Cayo", "country": "Belize", "lat": 17.1561, "lon": -89.0625},
{"id": 41, "name": "Abomey", "region": "Zou", "country": "Benin", "lat": 7.1833, "lon": 1.9833},
{"id": 42, "name": "Cotonou", "region": "Littoral", "country": "Benin", "lat": 6.3677, "lon": 2.4253},
{"id": 43, "name": "Kétou", "region": "Plateau", "country": "Benin", "lat": 7.3667, "lon": 2.6},
{"id": 44, "name": "Natitingou", "region": "Atakora", "country": "Benin", "lat": 10.3167, "lon": 1.3833},
{"id": 45, "name": "Parakou", "region": "Borgou", "country": "Benin", "lat": 9.35, "lon": 2.6167},
{"id": 46, "name": "Porto-Novo", "region": "Ouémé", "country": "Benin", "lat": 6.4969, "lon": 2.6289},
{"id": 47, "name": "Savalou", "region": "Collines", "country": "Benin", "lat": 7.9333, "lon": 1.9667},
{"id": 48, "name": "Ségbana", "region": "Alibori", "country": "Benin", "lat": 10.9333, "lon": 3.6833},
{"id": 49, "name": "Thimphu", "region": "Thimphu", "country": "Bhutan", "lat": 27.4728, "lon": 89.639},
{"id": 50, "name": "Cobija", "region": "Pando", "country": "Bolivia", "lat": -11.0333, "lon": -68.7333},
{"id": 51, "name": "Cotoca", "region": "Santa Cruz", "country": "Bolivia", "lat": -17.8167, "lon": -63.05},
{"id": 52, "name": "Guayaramerín", "region": "Beni", "country": "Bolivia", "lat": -10.8, "lon": -65.3833},
{"id": 53, "name": "La Paz", "region": "La Paz", "country": "Bolivia", "lat": -16.4897, "lon": -68.1193},
{"id": 54, "name": "Montero", "region": "Santa Cruz", "country": "Bolivia", "lat": -17.3333, "lon": -63.25},
{"id": 55, "name": "Oruro", "region": "Oruro", "country": "Bolivia", "lat": -17.9667, "lon": -67.1167},
{"id": 56, "name": "Potosí", "region": "Potosí", "country": "Bolivia", "lat": -19.5892, "lon": -65.7533},
{"id": 57, "name": "Riberalta", "region": "Beni", "country": "Bolivia", "lat": -10.9833, "lon": -66.1},
{"id": 58, "name": "Santa Cruz", "region": "Santa Cruz", "country": "Bolivia", "lat": -17.7833, "lon": -63.1821},
{"id": 59, "name": "Sucre", "region": "Chuquisaca", "country": "Bolivia", "lat": -19.0196, "lon": -65.262},
{"id": 60, "name": "Tarija", "region": "Tarija", "country": "Bolivia", "lat": -21.5333, "lon": -64.7333},
{"id": 61, "name": "Trinidad", "region": "Beni", "country": "Bolivia", "lat": -14.8333, "lon": -64.9},
{"id": 62, "name": "Villazón", "region": "Potosí", "country": "Bolivia", "lat": -22.0875, "lon": -65.6},
{"id": 63, "name": "Warnes", "region": "Santa Cruz", "country": "Bolivia", "lat": -17.5167, "lon": -63.1667},
{"id": 64, "name": "Mostar", "region": "Herzegovina-Neretva", "country": "Bosnia and Herzegovina", "lat": 43.3438, "lon": 17.8078},
{"id": 65, "name": "Sarajevo", "region": "Sarajevo Canton", "country": "Bosnia and Herzegovina", "lat": 43.8563, "lon": 18.4131},
{"id": 66, "name": "Francistown", "region": "North-East", "country": "Botswana", "lat": -21.17, "lon": 27.5},
{"id": 67, "name": "Gaborone", "region": "South-East", "country": "Botswana", "lat": -24.6282, "lon": 25.9231},
{"id": 68, "name": "Maun", "region": "North-West", "country": "Botswana", "lat": -19.9954, "lon": 23.4181},
{"id": 69, "name": "Brasilia", "region": "Federal District", "country": "Brazil", "lat": -15.79, "lon": -47.88},
{"id": 70, "name": "Rio de Janeiro", "region": "Rio de Janeiro", "country": "Brazil", "lat": -22.91, "lon": -43.17},
{"id": 71, "name": "Salvador", "region": "Bahia", "country": "Brazil", "lat": -12.97, "lon": -38.51},
{"id": 72, "name": "Sao Paulo", "region": "Sao Paulo", "country": "Brazil", "lat": -23.5505, "lon": -46.6333},
{"id": 73, "name": "São Paulo", "region": "São Paulo", "country": "Brazil", "lat": -23.55, "lon": -46.64},
{"id": 74, "name": "Plovdiv", "region": "Plovdiv", "country": "Bulgaria", "lat": 42.1354, "lon": 24.7453},
{"id": 75, "name": "Sofia", "region": "Sofia City", "country": "Bulgaria", "lat": 42.7, "lon": 23.32},
{"id": 76, "name": "Varna", "region": "Varna", "country": "Bulgaria", "lat": 43.2141, "lon": 27.9147},
{"id": 77, "name": "Banfora", "region": "Cascades", "country": "Burkina Faso", "lat": 10.6333, "lon": -4.7667},
{"id": 78, "name": "Bobo-Dioulasso", "region": "Hauts-Bassins", "country": "Burkina Faso", "lat": 11.1861, "lon": -4.2893},
{"id": 79, "name": "Dédougou", "region": "Boucle du Mouhoun", "country": "Burkina Faso", "lat": 12.4667, "lon": -3.4667},
{"id": 80, "name": "Fada N\"gourma", "region": "Est", "country": "Burkina Faso", "lat": 12.05, "lon": 0.3667},
{"id": 81, "name": "Ouagadougou", "region": "Centre", "country": "Burkina Faso", "lat": 12.3714, "lon": -1.5197},
{"id": 82, "name": "Ouahigouya", "region": "Nord", "country": "Burkina Faso", "lat": 13.5833, "lon": -2.4167},
{"id": 83, "name": "Bujumbura", "region": "Bujumbura Mairie", "country": "Burundi", "lat": -3.3614, "lon": 29.3599},
{"id": 84, "name": "Gitega", "region": "Gitega", "country": "Burundi", "lat": -3.4264, "lon": 29.9306},
{"id": 85, "name": "Phnom Penh", "region": "Phnom Penh", "country": "Cambodia", "lat": 11.5564, "lon": 104.9282},
{"id": 86, "name": "Siem Reap", "region": "Siem Reap", "country": "Cambodia", "lat": 13.3671, "lon": 103.8448},
{"id": 87, "name": "Banff", "region": "Alberta", "country": "Canada", "lat": 51.1784, "lon": -115.5708},
{"id": 88, "name": "Calgary", "region": "Alberta", "country": "Canada", "lat": 51.0447, "lon": -114.0719},
{"id": 89, "name": "Edmonton", "region": "Alberta", "country": "Canada", "lat": 53.5461, "lon": -113.4938},
{"id": 90, "name": "Halifax", "region": "Nova Scotia", "country": "Canada", "lat": 44.6488, "lon": -63.5752},
{"id": 91, "name": "Montreal", "region": "Quebec", "country": "Canada", "lat": 45.5017, "lon": -73.5673},
{"id": 92, "name": "Ottawa", "region": "Ontario", "country": "Canada", "lat": 45.4215, "lon": -75.6972},
{"id": 93, "name": "Quebec City", "region": "Quebec", "country": "Canada", "lat": 46.8139, "lon": -71.208},
{"id": 94, "name": "Toronto", "region": "Ontario", "country": "Canada", "lat": 43.65, "lon": -79.38},
{"id": 95, "name": "Vancouver", "region": "British Columbia", "country": "Canada", "lat": 49.2827, "lon": -123.1207},
{"id": 96, "name": "Winnipeg", "region": "Manitoba", "country": "Canada", "lat": 49.8951, "lon": -97.1384},
{"id": 97, "name": "Mindelo", "region": "São Vicente", "country": "Cape Verde", "lat": 16.8871, "lon": -24.9884},
{"id": 98, "name": "Praia", "region": "Praia", "country": "Cape Verde", "lat": 14.933, "lon": -23.5133},
{"id": 99, "name": "São Filipe", "region": "Fogo", "country": "Cape Verde", "lat": 14.8958, "lon": -24.4986},
{"id": 100, "name": "Tarrafal", "region": "Santiago", "country": "Cape Verde", "lat": 15.2783, "lon": -23.7486},
{"id": 101, "name": "Bangui", "region": "Bangui", "country": "Central African Republic", "lat": 4.3667, "lon": 18.5833},
{"id": 102, "name": "Bimbo", "region": "Ombella-M\"Poko", "country": "Central African Republic", "lat": 4.3311, "lon": 18.5164},
{"id": 103, "name": "Moundou", "region": "Logone Occidental", "country": "Chad", "lat": 8.5667, "lon": 16.0833},
{"id": 104, "name": "Ndjamena", "region": "Ndjamena", "country": "Chad", "lat": 12.11, "lon": 15.05},
{"id": 105, "name": "Santiago", "region": "Santiago Metropolitan", "country": "Chile", "lat": -33.45, "lon": -70.66},
{"id": 106, "name": "Beijing", "region": "Beijing", "country": "China", "lat": 39.9, "lon": 116.4},
{"id": 107, "name": "Chengdu", "region": "Sichuan", "country": "China", "lat": 30.67, "lon": 104.07},
{"id": 108, "name": "Guangzhou", "region": "Guangdong", "country": "China", "lat": 23.13, "lon": 113.26},
{"id": 109, "name": "Hong Kong", "region": "Hong Kong", "country": "China", "lat": 22.32, "lon": 114.17},
{"id": 110, "name": "Shanghai", "region": "Shanghai", "country": "China", "lat": 31.2304, "lon": 121.4737},
{"id": 111, "name": "Shenzhen", "region": "Guangdong", "country": "China", "lat": 22.54, "lon": 114.06},
{"id": 112, "name": "Armenia", "region": "Quindío", "country": "Colombia", "lat": 4.5389, "lon": -75.6725},
{"id": 113, "name": "Barranquilla", "region": "Atlántico", "country": "Colombia", "lat": 10.9639, "lon": -74.7964},
{"id": 114, "name": "Bogotá", "region": "Bogotá", "country": "Colombia", "lat": 4.71, "lon": -74.07},
{"id": 115, "name": "Bogotá", "region": "Bogotá D.C.", "country": "Colombia", "lat": 4.711, "lon": -74.0721},
{"id": 116, "name": "Bucaramanga", "region": "Santander", "country": "Colombia", "lat": 7.1333, "lon": -73.0},
{"id": 117, "name": "Cali", "region": "Valle del Cauca", "country": "Colombia", "lat": 3.4516, "lon": -76.532},
{"id": 118, "name": "Cartagena", "region": "Bolívar", "country": "Colombia", "lat": 10.391, "lon": -75.4794},
{"id": 119, "name": "Cúcuta", "region": "Norte de Santander", "country": "Colombia", "lat": 7.9075, "lon": -72.5047},
{"id": 120, "name": "Ibagué", "region": "Tolima", "country": "Colombia", "lat": 4.4378, "lon": -75.2006},
{"id": 121, "name": "Leticia", "region": "Amazonas", "country": "Colombia", "lat": -4.215, "lon": -69.9411},
{"id": 122, "name": "Medellín", "region": "Antioquia", "country": "Colombia", "lat": 6.2442, "lon": -75.5812},
{"id": 123, "name": "Mitu", "region": "Vaupés", "country": "Colombia", "lat": 1.1983, "lon": -70.1733},
{"id": 124, "name": "Montería", "region": "Córdoba", "country": "Colombia", "lat": 8.75, "lon": -75.8833},
{"id": 125, "name": "Neiva", "region": "Huila", "country": "Colombia", "lat": 2.9275, "lon": -75.2875},
{"id": 126, "name": "Pereira", "region": "Risaralda", "country": "Colombia", "lat": 4.8143, "lon": -75.6946},
{"id": 127, "name": "Popayán", "region": "Cauca", "country": "Colombia", "lat": 2.4411, "lon": -76.6061},
{"id": 128, "name": "Quibdó", "region": "Chocó", "country": "Colombia", "lat": 5.6923, "lon": -76.6582},
{"id": 129, "name": "San Andrés", "region": "San Andrés", "country": "Colombia", "lat": 12.5847, "lon": -81.7006},
{"id": 130, "name": "San José del Guaviare", "region": "Guaviare", "country": "Colombia", "lat": 2.5667, "lon": -72.6333},
{"id": 131, "name": "Sincelejo", "region": "Sucre", "country": "Colombia", "lat": 9.295, "lon": -75.3961},
{"id": 132, "name": "Tunja", "region": "Boyacá", "country": "Colombia", "lat": 5.5333, "lon": -73.3667},
{"id": 133, "name": "Valledupar", "region": "Cesar", "country": "Colombia", "lat": 10.4833, "lon": -73.25},
{"id": 134, "name": "Villavicencio", "region": "Meta", "country": "Colombia", "lat": 4.1425, "lon": -73.6294},
{"id": 135, "name": "Yopal", "region": "Casanare", "country": "Colombia", "lat": 5.35, "lon": -72.41},
{"id": 136, "name": "Fomboni", "region": "Mohéli", "country": "Comoros", "lat": -12.28, "lon": 43.7425},
{"id": 137, "name": "Moroni", "region": "Grande Comore", "country": "Comoros", "lat": -11.7172, "lon": 43.2473},
{"id": 138, "name": "Mutsamudu", "region": "Anjouan", "country": "Comoros", "lat": -12.1667, "lon": 44.3994},
{"id": 139, "name": "Alajuela", "region": "Alajuela", "country": "Costa Rica", "lat": 10.0167, "lon": -84.2167},
{"id": 140, "name": "Cartago", "region": "Cartago", "country": "Costa Rica", "lat": 9.8667, "lon": -83.9167},
{"id": 141, "name": "Heredia", "region": "Heredia", "country": "Costa Rica", "lat": 9.9986, "lon": -84.1169},
{"id": 142, "name": "Liberia", "region": "Guanacaste", "country": "Costa Rica", "lat": 10.635, "lon": -85.4377},
{"id": 143, "name": "Limón", "region": "Limón", "country": "Costa Rica", "lat": 9.9833, "lon": -83.0333},
{"id": 144, "name": "Puntarenas", "region": "Puntarenas", "country": "Costa Rica", "lat": 9.9762, "lon": -84.8384},
{"id": 145, "name": "San José", "region": "San José", "country": "Costa Rica", "lat": 9.93, "lon": -84.08},
{"id": 146, "name": "Dubrovnik", "region": "Dubrovnik-Neretva", "country": "Croatia", "lat": 42.6507, "lon": 18.0944},
{"id": 147, "name": "Split", "region": "Split-Dalmatia", "country": "Croatia", "lat": 43.5081, "lon": 16.4402},
{"id": 148, "name": "Zagreb", "region": "Zagreb", "country": "Croatia", "lat": 45.815, "lon": 15.9819},
{"id": 149, "name": "Havana", "region": "Havana", "country": "Cuba", "lat": 23.13, "lon": -82.38},
{"id": 150, "name": "Havana", "region": "La Habana", "country": "Cuba", "lat": 23.1136, "lon": -82.3666},
{"id": 151, "name": "Varadero", "region": "Matanzas", "country": "Cuba", "lat": 23.1418, "lon": -81.287},
{"id": 152, "name": "Willemstad", "region": "Curaçao", "country": "Curaçao", "lat": 12.1224, "lon": -68.8824},
{"id": 153, "name": "Nicosia", "region": "Nicosia", "country": "Cyprus", "lat": 35.1856, "lon": 33.3823},
{"id": 154, "name": "Prague", "region": "Prague", "country": "Czech Republic", "lat": 50.08, "lon": 14.42},
{"id": 155, "name": "Kinshasa", "region": "Kinshasa", "country": "DR Congo", "lat": -4.4419, "lon": 15.2663},
{"id": 156, "name": "Lubumbashi", "region": "Haut-Katanga", "country": "DR Congo", "lat": -11.6642, "lon": 27.4826},
{"id": 157, "name": "Copenhagen", "region": "Capital Region", "country": "Denmark", "lat": 55.68, "lon": 12.57},
{"id": 158, "name": "Djibouti City", "region": "Djibouti", "country": "Djibouti", "lat": 11.5721, "lon": 43.1456},
{"id": 159, "name": "Tadjoura", "region": "Tadjoura", "country": "Djibouti", "lat": 11.7853, "lon": 42.8844},
{"id": 160, "name": "Marigot", "region": "Saint Andrew", "country": "Dominica", "lat": 15.5333, "lon": -61.3},
{"id": 161, "name": "Portsmouth", "region": "Saint John", "country": "Dominica", "lat": 15.5833, "lon": -61.4667},
{"id": 162, "name": "Roseau", "region": "Saint George", "country": "Dominica", "lat": 15.3, "lon": -61.3833},
{"id": 163, "name": "Punta Cana", "region": "La Altagracia", "country": "Dominican Republic", "lat": 18.5601, "lon": -68.3725},
{"id": 164, "name": "Santo Domingo", "region": "Distrito Nacional", "country": "Dominican Republic", "lat": 18.4861, "lon": -69.9312},
{"id": 165, "name": "Galápagos", "region": "Galápagos", "country": "Ecuador", "lat": -0.9538, "lon": -90.9656},
{"id": 166, "name": "Guayaquil", "region": "Guayas", "country": "Ecuador", "lat": -2.1708, "lon": -79.9224},
{"id": 167, "name": "Quito", "region": "Pichincha", "country": "Ecuador", "lat": -0.23, "lon": -78.52},
{"id": 168, "name": "Alexandria", "region": "Alexandria Governorate", "country": "Egypt", "lat": 31.2001, "lon": 29.9187},
{"id": 169, "name": "Cairo", "region": "Cairo", "country": "Egypt", "lat": 30.04, "lon": 31.24},
{"id": 170, "name": "Cairo", "region": "Cairo Governorate", "country": "Egypt", "lat": 30.0444, "lon": 31.2357},
{"id": 171, "name": "Hurghada", "region": "Red Sea Governorate", "country": "Egypt", "lat": 27.2579, "lon": 33.8116},
{"id": 172, "name": "Luxor", "region": "Luxor Governorate", "country": "Egypt", "lat": 25.6872, "lon": 32.6396},
{"id": 173, "name": "Sharm El Sheikh", "region": "South Sinai Governorate", "country": "Egypt", "lat": 27.9158, "lon": 34.33},
{"id": 174, "name": "Ahuachapán", "region": "Ahuachapán", "country": "El Salvador", "lat": 13.9214, "lon": -89.845},
{"id": 175, "name": "La Unión", "region": "La Unión", "country": "El Salvador", "lat": 13.3367, "lon": -87.8439},
{"id": 176, "name": "San Miguel", "region": "San Miguel", "country": "El Salvador", "lat": 13.4833, "lon": -88.1833},
{"id": 177, "name": "San Salvador", "region": "San Salvador", "country": "El Salvador", "lat": 13.6929, "lon": -89.2182},
{"id": 178, "name": "Santa Ana", "region": "Santa Ana", "country": "El Salvador", "lat": 13.9833, "lon": -89.5333},
{"id": 179, "name": "Sonsonate", "region": "Sonsonate", "country": "El Salvador", "lat": 13.7167, "lon": -89.7167},
{"id": 180, "name": "Zacatecoluca", "region": "La Paz", "country": "El Salvador", "lat": 13.5, "lon": -88.8667},
{"id": 181, "name": "Bata", "region": "Litoral", "country": "Equatorial Guinea", "lat": 1.865, "lon": 9.77},
{"id": 182, "name": "Ebebiyin", "region": "Kié-Ntem", "country": "Equatorial Guinea", "lat": 2.15, "lon": 11.3167},
{"id": 183, "name": "Malabo", "region": "Bioko Norte", "country": "Equatorial Guinea", "lat": 3.75, "lon": 8.7833},
{"id": 184, "name": "Asmara", "region": "Maekel", "country": "Eritrea", "lat": 15.3333, "lon": 38.9167},
{"id": 185, "name": "Massawa", "region": "Northern Red Sea", "country": "Eritrea", "lat": 15.6097, "lon": 39.45},
{"id": 186, "name": "Tallinn", "region": "Harju County", "country": "Estonia", "lat": 59.44, "lon": 24.75},
{"id": 187, "name": "Tallinn", "region": "Harju", "country": "Estonia", "lat": 59.437, "lon": 24.7536},
{"id": 188, "name": "Manzini", "region": "Manzini", "country": "Eswatini", "lat": -26.4833, "lon": 31.3667},
{"id": 189, "name": "Mbabane", "region": "Hhohho", "country": "Eswatini", "lat": -26.3167, "lon": 31.1333},
{"id": 190, "name": "Addis Ababa", "region": "Addis Ababa", "country": "Ethiopia", "lat": 9.03, "lon": 38.74},
{"id": 191, "name": "Dire Dawa", "region": "Dire Dawa", "country": "Ethiopia", "lat": 9.6009, "lon": 41.8501},
{"id": 192, "name": "Gondar", "region": "Amhara", "country": "Ethiopia", "lat": 12.6, "lon": 37.4667},
{"id": 193, "name": "Hawassa", "region": "Sidama", "country": "Ethiopia", "lat": 7.05, "lon": 38.4667},
{"id": 194, "name": "Mekele", "region": "Tigray", "country": "Ethiopia", "lat": 13.4969, "lon": 39.4769},
{"id": 195, "name": "Nadi", "region": "Western", "country": "Fiji", "lat": -17.7984, "lon": 177.416},
{"id": 196, "name": "Suva", "region": "Central", "country": "Fiji", "lat": -18.1248, "lon": 178.4501},
{"id": 197, "name": "Helsinki", "region": "Uusimaa", "country": "Finland", "lat": 60.17, "lon": 24.94},
{"id": 198, "name": "Bordeaux", "region": "Nouvelle-Aquitaine", "country": "France", "lat": 44.8378, "lon": -0.5792},
{"id": 199, "name": "Lille", "region": "Hauts-de-France", "country": "France", "lat": 50.6292, "lon": 3.0573},
{"id": 200, "name": "Lyon", "region": "Auvergne-Rhône-Alpes", "country": "France", "lat": 45.76, "lon": 4.83},
{"id": 201, "name": "Marseille", "region": "Provence-Alpes-Côte d\"Azur", "country": "France", "lat": 43.3, "lon": 5.38},
{"id": 202, "name": "Montpellier", "region": "Occitanie", "country": "France", "lat": 43.6108, "lon": 3.8767},
{"id": 203, "name": "Nantes", "region": "Pays de la Loire", "country": "France", "lat": 47.2184, "lon": -1.5536},
{"id": 204, "name": "Paris", "region": "Île-de-France", "country": "France", "lat": 48.87, "lon": 2.33},
{"id": 205, "name": "Rennes", "region": "Brittany", "country": "France", "lat": 48.1173, "lon": -1.6778},
{"id": 206, "name": "Strasbourg", "region": "Grand Est", "country": "France", "lat": 48.5734, "lon": 7.7521},
{"id": 207, "name": "Toulouse", "region": "Occitanie", "country": "France", "lat": 43.6047, "lon": 1.4442},
{"id": 208, "name": "Cayenne", "region": "Cayenne", "country": "French Guiana", "lat": 4.9224, "lon": -52.3135},
{"id": 209, "name": "Kourou", "region": "Kourou", "country": "French Guiana", "lat": 5.16, "lon": -52.6499},
{"id": 210, "name": "Saint-Laurent-du-Maroni", "region": "Saint-Laurent-du-Maroni", "country": "French Guiana", "lat": 5.5039, "lon": -54.0289},
{"id": 211, "name": "Franceville", "region": "Haut-Ogooué", "country": "Gabon", "lat": -1.6333, "lon": 13.5833},
{"id": 212, "name": "Libreville", "region": "Estuaire", "country": "Gabon", "lat": 0.4162, "lon": 9.4673},
{"id": 213, "name": "Port-Gentil", "region": "Ogooué-Maritime", "country": "Gabon", "lat": -0.7167, "lon": 8.7833},
{"id": 214, "name": "Bakau", "region": "Kanifing", "country": "Gambia", "lat": 13.4789, "lon": -16.6819},
{"id": 215, "name": "Banjul", "region": "Banjul", "country": "Gambia", "lat": 13.4553, "lon": -16.5756},
{"id": 216, "name": "Basse Santa Su", "region": "Upper River", "country": "Gambia", "lat": 13.3167, "lon": -14.2167},
{"id": 217, "name": "Brikama", "region": "Western", "country": "Gambia", "lat": 13.2667, "lon": -16.65},
{"id": 218, "name": "Serekunda", "region": "Banjul", "country": "Gambia", "lat": 13.4383, "lon": -16.6781},
{"id": 219, "name": "Berlin", "region": "Berlin", "country": "Germany", "lat": 52.52, "lon": 13.41},
{"id": 220, "name": "Bremen", "region": "Bremen", "country": "Germany", "lat": 53.0793, "lon": 8.8017},
{"id": 221, "name": "Cologne", "region": "North Rhine-Westphalia", "country": "Germany", "lat": 50.9375, "lon": 6.9603},
{"id": 222, "name": "Dortmund", "region": "North Rhine-Westphalia", "country": "Germany", "lat": 51.5136, "lon": 7.4653},
{"id": 223, "name": "Dresden", "region": "Saxony", "country": "Germany", "lat": 51.0504, "lon": 13.7373},
{"id": 224, "name": "Dusseldorf", "region": "North Rhine-Westphalia", "country": "Germany", "lat": 51.2277, "lon": 6.7735},
{"id": 225, "name": "Essen", "region": "North Rhine-Westphalia", "country": "Germany", "lat": 51.4556, "lon": 7.0116},
{"id": 226, "name": "Frankfurt", "region": "Hesse", "country": "Germany", "lat": 50.1109, "lon": 8.6821},
{"id": 227, "name": "Hamburg", "region": "Hamburg", "country": "Germany", "lat": 53.5511, "lon": 9.9937},
{"id": 228, "name": "Hannover", "region": "Lower Saxony", "country": "Germany", "lat": 52.3759, "lon": 9.732},
{"id": 229, "name": "Leipzig", "region": "Saxony", "country": "Germany", "lat": 51.3397, "lon": 12.3731},
{"id": 230, "name": "Munich", "region": "Bavaria", "country": "Germany", "lat": 48.1351, "lon": 11.582},
{"id": 231, "name": "Nuremberg", "region": "Bavaria", "country": "Germany", "lat": 49.4521, "lon": 11.0767},
{"id": 232, "name": "Stuttgart", "region": "Baden-Württemberg", "country": "Germany", "lat": 48.7758, "lon": 9.1829},
{"id": 233, "name": "Accra", "region": "Greater Accra", "country": "Ghana", "lat": 5.6, "lon": -0.19},
{"id": 234, "name": "Bolgatanga", "region": "Upper East", "country": "Ghana", "lat": 10.7833, "lon": -0.85},
{"id": 235, "name": "Cape Coast", "region": "Central", "country": "Ghana", "lat": 5.1, "lon": -1.25},
{"id": 236, "name": "Ho", "region": "Volta", "country": "Ghana", "lat": 6.6, "lon": 0.4667},
{"id": 237, "name": "Kumasi", "region": "Ashanti", "country": "Ghana", "lat": 6.687, "lon": -1.6244},
{"id": 238, "name": "Sekondi-Takoradi", "region": "Western", "country": "Ghana", "lat": 4.9167, "lon": -1.7667},
{"id": 239, "name": "Sunyani", "region": "Bono", "country": "Ghana", "lat": 7.3333, "lon": -2.3333},
{"id": 240, "name": "Tamale", "region": "Northern", "country": "Ghana", "lat": 9.4, "lon": -0.85},
{"id": 241, "name": "Wa", "region": "Upper West", "country": "Ghana", "lat": 10.0667, "lon": -2.5},
{"id": 242, "name": "Gibraltar", "region": "Gibraltar", "country": "Gibraltar", "lat": 36.1408, "lon": -5.3536},
{"id": 243, "name": "Athens", "region": "Attica", "country": "Greece", "lat": 37.98, "lon": 23.73},
{"id": 244, "name": "Corfu", "region": "Ionian Islands", "country": "Greece", "lat": 39.6243, "lon": 19.9217},
{"id": 245, "name": "Crete", "region": "Crete", "country": "Greece", "lat": 35.2401, "lon": 24.8093},
{"id": 246, "name": "Mykonos", "region": "South Aegean", "country": "Greece", "lat": 37.4467, "lon": 25.3289},
{"id": 247, "name": "Rhodes", "region": "South Aegean", "country": "Greece", "lat": 36.4345, "lon": 28.2176},
{"id": 248, "name": "Santorini", "region": "South Aegean", "country": "Greece", "lat": 36.3932, "lon": 25.4615},
{"id": 249, "name": "Thessaloniki", "region": "Central Macedonia", "country": "Greece", "lat": 40.6401, "lon": 22.9444},
{"id": 250, "name": "Zakynthos", "region": "Ionian Islands", "country": "Greece", "lat": 37.7829, "lon": 20.8978},
{"id": 251, "name": "St. George\"s", "region": "Saint George", "country": "Grenada", "lat": 12.0561, "lon": -61.7488},
{"id": 252, "name": "Hagåtña", "region": "Hagåtña", "country": "Guam", "lat": 13.4757, "lon": 144.7489},
{"id": 253, "name": "Antigua Guatemala", "region": "Sacatepéquez", "country": "Guatemala", "lat": 14.5586, "lon": -90.7295},
{"id": 254, "name": "Guatemala City", "region": "Guatemala", "country": "Guatemala", "lat": 14.63, "lon": -90.52},
{"id": 255, "name": "Guatemala City", "region": "Guatemala Department", "country": "Guatemala", "lat": 14.6349, "lon": -90.5069},
{"id": 256, "name": "Conakry", "region": "Conakry", "country": "Guinea", "lat": 9.6412, "lon": -13.5784},
{"id": 257, "name": "Kankan", "region": "Kankan", "country": "Guinea", "lat": 10.3833, "lon": -9.3},
{"id": 258, "name": "Kindia", "region": "Kindia", "country": "Guinea", "lat": 10.05, "lon": -12.8667},
{"id": 259, "name": "Labé", "region": "Labé", "country": "Guinea", "lat": 11.3167, "lon": -12.2833},
{"id": 260, "name": "Nzérékoré", "region": "Nzérékoré", "country": "Guinea", "lat": 7.75, "lon": -8.8167},
{"id": 261, "name": "Bafatá", "region": "Bafatá", "country": "Guinea-Bissau", "lat": 12.1667, "lon": -14.6667},
{"id": 262, "name": "Bissau", "region": "Bissau", "country": "Guinea-Bissau", "lat": 11.8613, "lon": -15.5831},
{"id": 263, "name": "Gabú", "region": "Gabú", "country": "Guinea-Bissau", "lat": 12.2833, "lon": -14.2167},
{"id": 264, "name": "Bartica", "region": "Cuyuni-Mazaruni", "country": "Guyana", "lat": 6.4, "lon": -58.6167},
{"id": 265, "name": "Corriverton", "region": "East Berbice-Corentyne", "country": "Guyana", "lat": 5.9, "lon": -57.15},
{"id": 266, "name": "Georgetown", "region": "Demerara-Mahaica", "country": "Guyana", "lat": 6.8013, "lon": -58.1551},
{"id": 267, "name": "Lethem", "region": "Upper Takutu-Upper Essequibo", "country": "Guyana", "lat": 3.3833, "lon": -59.8},
{"id": 268, "name": "Linden", "region": "Upper Demerara-Berbice", "country": "Guyana", "lat": 6.0, "lon": -58.3},
{"id": 269, "name": "Mabaruma", "region": "Barima-Waini", "country": "Guyana", "lat": 8.2, "lon": -59.7833},
{"id": 270, "name": "New Amsterdam", "region": "East Berbice-Corentyne", "country": "Guyana", "lat": 6.25, "lon": -57.5167},
{"id": 271, "name": "Port-au-Prince", "region": "Ouest", "country": "Haiti", "lat": 18.5944, "lon": -72.3074},
{"id": 272, "name": "Comayagua", "region": "Comayagua", "country": "Honduras", "lat": 14.46, "lon": -87.65},
{"id": 273, "name": "Juticalpa", "region": "Olancho", "country": "Honduras", "lat": 14.6667, "lon": -86.2167},
{"id": 274, "name": "La Ceiba", "region": "Atlántida", "country": "Honduras", "lat": 15.7833, "lon": -86.8},
{"id": 275, "name": "Roatán", "region": "Bay Islands", "country": "Honduras", "lat": 16.324, "lon": -86.536},
{"id": 276, "name": "Santa Rosa de Copán", "region": "Copán", "country": "Honduras", "lat": 14.7667, "lon": -88.7833},
{"id": 277, "name": "Tegucigalpa", "region": "Francisco Morazán", "country": "Honduras", "lat": 14.0723, "lon": -87.1921},
{"id": 278, "name": "Yoro", "region": "Yoro", "country": "Honduras", "lat": 15.1333, "lon": -87.1333},
{"id": 279, "name": "Hong Kong", "region": "Hong Kong Island", "country": "Hong Kong", "lat": 22.3193, "lon": 114.1694},
{"id": 280, "name": "Budapest", "region": "Central Hungary", "country": "Hungary", "lat": 47.5, "lon": 19.04},
{"id": 281, "name": "Reykjavik", "region": "Capital Region", "country": "Iceland", "lat": 64.1466, "lon": -21.9426},
{"id": 282, "name": "Agra", "region": "Uttar Pradesh", "country": "India", "lat": 27.1767, "lon": 78.0081},
{"id": 283, "name": "Ahmedabad", "region": "Gujarat", "country": "India", "lat": 23.03, "lon": 72.58},
{"id": 284, "name": "Bangalore", "region": "Karnataka", "country": "India", "lat": 12.97, "lon": 77.59},
{"id": 285, "name": "Chennai", "region": "Tamil Nadu", "country": "India", "lat": 13.08, "lon": 80.27},
{"id": 286, "name": "Delhi", "region": "Delhi", "country": "India", "lat": 28.6139, "lon": 77.209},
{"id": 287, "name": "Goa", "region": "Goa", "country": "India", "lat": 15.2993, "lon": 74.124},
{"id": 288, "name": "Hyderabad", "region": "Telangana", "country": "India", "lat": 17.39, "lon": 78.49},
{"id": 289, "name": "Jaipur", "region": "Rajasthan", "country": "India", "lat": 26.9124, "lon": 75.7873},
{"id": 290, "name": "Kochi", "region": "Kerala", "country": "India", "lat": 9.9312, "lon": 76.2673},
{"id": 291, "name": "Kolkata", "region": "West Bengal", "country": "India", "lat": 22.5726, "lon": 88.3639},
{"id": 292, "name": "Mumbai", "region": "Maharashtra", "country": "India", "lat": 19.08, "lon": 72.88},
{"id": 293, "name": "Varanasi", "region": "Uttar Pradesh", "country": "India", "lat": 25.3176, "lon": 82.9739},
{"id": 294, "name": "Bali", "region": "Bali", "country": "Indonesia", "lat": -8.3405, "lon": 115.092},
{"id": 295, "name": "Bandung", "region": "West Java", "country": "Indonesia", "lat": -6.9175, "lon": 107.6191},
{"id": 296, "name": "Jakarta", "region": "Jakarta", "country": "Indonesia", "lat": -6.21, "lon": 106.85},
{"id": 297, "name": "Lombok", "region": "West Nusa Tenggara", "country": "Indonesia", "lat": -8.65, "lon": 116.3249},
{"id": 298, "name": "Medan", "region": "North Sumatra", "country": "Indonesia", "lat": 3.5952, "lon": 98.6722},
{"id": 299, "name": "Surabaya", "region": "East Java", "country": "Indonesia", "lat": -7.2575, "lon": 112.7521},
{"id": 300, "name": "Yogyakarta", "region": "Yogyakarta", "country": "Indonesia", "lat": -7.7956, "lon": 110.3695},
{"id": 301, "name": "Isfahan", "region": "Isfahan", "country": "Iran", "lat": 32.6539, "lon": 51.666},
{"id": 302, "name": "Mashhad", "region": "Razavi Khorasan", "country": "Iran", "lat": 36.2605, "lon": 59.6168},
{"id": 303, "name": "Shiraz", "region": "Fars", "country": "Iran", "lat": 29.5926, "lon": 52.5836},
{"id": 304, "name": "Tabriz", "region": "East Azerbaijan", "country": "Iran", "lat": 38.0962, "lon": 46.2738},
{"id": 305, "name": "Tehran", "region": "Tehran", "country": "Iran", "lat": 35.69, "lon": 51.39},
{"id": 306, "name": "Baghdad", "region": "Baghdad", "country": "Iraq", "lat": 33.32, "lon": 44.36},
{"id": 307, "name": "Basra", "region": "Basra", "country": "Iraq", "lat": 30.5258, "lon": 47.7731},
{"id": 308, "name": "Erbil", "region": "Erbil", "country": "Iraq", "lat": 36.19, "lon": 43.993},
{"id": 309, "name": "Dublin", "region": "Leinster", "country": "Ireland", "lat": 53.35, "lon": -6.26},
{"id": 310, "name": "Bari", "region": "Apulia", "country": "Italy", "lat": 41.1258, "lon": 16.8675},
{"id": 311, "name": "Bologna", "region": "Emilia-Romagna", "country": "Italy", "lat": 44.4949, "lon": 11.3426},
{"id": 312, "name": "Capri", "region": "Campania", "country": "Italy", "lat": 40.5507, "lon": 14.2426},
{"id": 313, "name": "Catania", "region": "Sicily", "country": "Italy", "lat": 37.5079, "lon": 15.083},
{"id": 314, "name": "Florence", "region": "Tuscany", "country": "Italy", "lat": 43.7696, "lon": 11.2558},
{"id": 315, "name": "Genoa", "region": "Liguria", "country": "Italy", "lat": 44.4056, "lon": 8.9463},
{"id": 316, "name": "Herculaneum", "region": "Campania", "country": "Italy", "lat": 40.806, "lon": 14.3482},
{"id": 317, "name": "Lake Como", "region": "Lombardy", "country": "Italy", "lat": 45.9852, "lon": 9.258},
{"id": 318, "name": "Milan", "region": "Lombardy", "country": "Italy", "lat": 45.46, "lon": 9.19},
{"id": 319, "name": "Naples", "region": "Campania", "country": "Italy", "lat": 40.85, "lon": 14.25},
{"id": 320, "name": "Palermo", "region": "Sicily", "country": "Italy", "lat": 38.1157, "lon": 13.3615},
{"id": 321, "name": "Pisa", "region": "Tuscany", "country": "Italy", "lat": 43.7228, "lon": 10.4017},
{"id": 322, "name": "Pompeii", "region": "Campania", "country": "Italy", "lat": 40.7462, "lon": 14.4989},
{"id": 323, "name": "Rome", "region": "Lazio", "country": "Italy", "lat": 41.9, "lon": 12.5},
{"id": 324, "name": "Siena", "region": "Tuscany", "country": "Italy", "lat": 43.3186, "lon": 11.3308},
{"id": 325, "name": "Turin", "region": "Piedmont", "country": "Italy", "lat": 45.0703, "lon": 7.6869},
{"id": 326, "name": "Venice", "region": "Veneto", "country": "Italy", "lat": 45.4408, "lon": 12.3155},
{"id": 327, "name": "Verona", "region": "Veneto", "country": "Italy", "lat": 45.4384, "lon": 10.9916},
{"id": 328, "name": "Abidjan", "region": "Abidjan", "country": "Ivory Coast", "lat": 5.3599, "lon": -4.0083},
{"id": 329, "name": "Bouaké", "region": "Vallée du Bandama", "country": "Ivory Coast", "lat": 7.6833, "lon": -5.0331},
{"id": 330, "name": "Daloa", "region": "Sassandra-Marahoué", "country": "Ivory Coast", "lat": 6.8833, "lon": -6.45},
{"id": 331, "name": "Divo", "region": "Gôh-Djiboua", "country": "Ivory Coast", "lat": 5.8333, "lon": -5.3667},
{"id": 332, "name": "Gagnoa", "region": "Gôh-Djiboua", "country": "Ivory Coast", "lat": 6.1333, "lon": -5.9333},
{"id": 333, "name": "Korhogo", "region": "Savanes", "country": "Ivory Coast", "lat": 9.4167, "lon": -5.6167},
{"id": 334, "name": "Man", "region": "Montagnes", "country": "Ivory Coast", "lat": 7.4, "lon": -7.55},
{"id": 335, "name": "San-Pédro", "region": "Bas-Sassandra", "country": "Ivory Coast", "lat": 4.75, "lon": -6.6333},
{"id": 336, "name": "Yamoussoukro", "region": "Yamoussoukro", "country": "Ivory Coast", "lat": 6.8276, "lon": -5.2893},
{"id": 337, "name": "Kingston", "region": "Kingston", "country": "Jamaica", "lat": 17.9714, "lon": -76.7926},
{"id": 338, "name": "Montego Bay", "region": "Saint James", "country": "Jamaica", "lat": 18.4663, "lon": -77.9189},
{"id": 339, "name": "Fukuoka", "region": "Kyushu", "country": "Japan", "lat": 33.5902, "lon": 130.4017},
{"id": 340, "name": "Hiroshima", "region": "Chugoku", "country": "Japan", "lat": 34.3853, "lon": 132.4553},
{"id": 341, "name": "Kyoto", "region": "Kansai", "country": "Japan", "lat": 35.0116, "lon": 135.7681},
{"id": 342, "name": "Nagoya", "region": "Chubu", "country": "Japan", "lat": 35.1815, "lon": 136.9066},
{"id": 343, "name": "Nara", "region": "Kansai", "country": "Japan", "lat": 34.6851, "lon": 135.8048},
{"id": 344, "name": "Okinawa", "region": "Okinawa", "country": "Japan", "lat": 26.2124, "lon": 127.6809},
{"id": 345, "name": "Osaka", "region": "Kansai", "country": "Japan", "lat": 34.6937, "lon": 135.5023},
{"id": 346, "name": "Sapporo", "region": "Hokkaido", "country": "Japan", "lat": 43.0618, "lon": 141.3545},
{"id": 347, "name": "Sendai", "region": "Tohoku", "country": "Japan", "lat": 38.2682, "lon": 140.8694},
{"id": 348, "name": "Tokyo", "region": "Tokyo", "country": "Japan", "lat": 35.69, "lon": 139.69},
{"id": 349, "name": "Tokyo", "region": "Kanto", "country": "Japan", "lat": 35.6895, "lon": 139.6917},
{"id": 350, "name": "Yokohama", "region": "Kanto", "country": "Japan", "lat": 35.4437, "lon": 139.638},
{"id": 351, "name": "Amman", "region": "Amman", "country": "Jordan", "lat": 31.9539, "lon": 35.9106},
{"id": 352, "name": "Aqaba", "region": "Aqaba", "country": "Jordan", "lat": 29.5319, "lon": 35.0061},
{"id": 353, "name": "Petra", "region": "Ma\"an Governorate", "country": "Jordan", "lat": 30.3285, "lon": 35.4444},
{"id": 354, "name": "Almaty", "region": "Almaty Region", "country": "Kazakhstan", "lat": 43.222, "lon": 76.8512},
{"id": 355, "name": "Astana", "region": "Akmola Region", "country": "Kazakhstan", "lat": 51.1694, "lon": 71.4491},
{"id": 356, "name": "Eldoret", "region": "Uasin Gishu", "country": "Kenya", "lat": 0.5143, "lon": 35.2698},
{"id": 357, "name": "Kisumu", "region": "Kisumu", "country": "Kenya", "lat": -0.0917, "lon": 34.768},
{"id": 358, "name": "Mombasa", "region": "Mombasa", "country": "Kenya", "lat": -4.0435, "lon": 39.6682},
{"id": 359, "name": "Nairobi", "region": "Nairobi", "country": "Kenya", "lat": -1.29, "lon": 36.82},
{"id": 360, "name": "Nakuru", "region": "Nakuru", "country": "Kenya", "lat": -0.3031, "lon": 36.08},
{"id": 361, "name": "Tarawa", "region": "South Tarawa", "country": "Kiribati", "lat": 1.3291, "lon": 172.979},
{"id": 362, "name": "Pristina", "region": "Pristina", "country": "Kosovo", "lat": 42.6629, "lon": 21.1655},
{"id": 363, "name": "Bishkek", "region": "Bishkek", "country": "Kyrgyzstan", "lat": 42.8746, "lon": 74.5698},
{"id": 364, "name": "Luang Prabang", "region": "Luang Prabang", "country": "Laos", "lat": 19.8834, "lon": 102.1347},
{"id": 365, "name": "Vientiane", "region": "Vientiane Prefecture", "country": "Laos", "lat": 17.9757, "lon": 102.6331},
{"id": 366, "name": "Riga", "region": "Riga", "country": "Latvia", "lat": 56.95, "lon": 24.11},
{"id": 367, "name": "Beirut", "region": "Beirut", "country": "Lebanon", "lat": 33.8938, "lon": 35.5018},
{"id": 368, "name": "Byblos", "region": "Mount Lebanon", "country": "Lebanon", "lat": 34.1233, "lon": 35.6511},
{"id": 369, "name": "Maseru", "region": "Maseru", "country": "Lesotho", "lat": -29.31, "lon": 27.48},
{"id": 370, "name": "Buchanan", "region": "Grand Bassa", "country": "Liberia", "lat": 5.8808, "lon": -10.0447},
{"id": 371, "name": "Gbarnga", "region": "Bong", "country": "Liberia", "lat": 6.9956, "lon": -9.4722},
{"id": 372, "name": "Kakata", "region": "Margibi", "country": "Liberia", "lat": 6.5303, "lon": -10.3517},
{"id": 373, "name": "Monrovia", "region": "Montserrado", "country": "Liberia", "lat": 6.2907, "lon": -10.7605},
{"id": 374, "name": "Voinjama", "region": "Lofa", "country": "Liberia", "lat": 8.4167, "lon": -9.75},
{"id": 375, "name": "Benghazi", "region": "Benghazi District", "country": "Libya", "lat": 32.1167, "lon": 20.0667},
{"id": 376, "name": "Tripoli", "region": "Tripoli District", "country": "Libya", "lat": 32.8872, "lon": 13.1913},
{"id": 377, "name": "Vaduz", "region": "Vaduz", "country": "Liechtenstein", "lat": 47.141, "lon": 9.5209},
{"id": 378, "name": "Vilnius", "region": "Vilnius County", "country": "Lithuania", "lat": 54.69, "lon": 25.28},
{"id": 379, "name": "Vilnius", "region": "Vilnius", "country": "Lithuania", "lat": 54.6872, "lon": 25.2797},
{"id": 380, "name": "Luxembourg City", "region": "Luxembourg", "country": "Luxembourg", "lat": 49.6116, "lon": 6.1319},
{"id": 381, "name": "Antananarivo", "region": "Analamanga", "country": "Madagascar", "lat": -18.8792, "lon": 47.5079},
{"id": 382, "name": "Antsirabe", "region": "Vakinankaratra", "country": "Madagascar", "lat": -19.8667, "lon": 47.0333},
{"id": 383, "name": "Mahajanga", "region": "Boeny", "country": "Madagascar", "lat": -15.7167, "lon": 46.3167},
{"id": 384, "name": "Nosy Be", "region": "Diana", "country": "Madagascar", "lat": -13.3124, "lon": 48.2546},
{"id": 385, "name": "Toamasina", "region": "Atsinanana", "country": "Madagascar", "lat": -18.1499, "lon": 49.4023},
{"id": 386, "name": "Toliara", "region": "Atsimo-Andrefana", "country": "Madagascar", "lat": -23.35, "lon": 43.6667},
{"id": 387, "name": "Blantyre", "region": "Southern", "country": "Malawi", "lat": -15.7861, "lon": 35.0059},
{"id": 388, "name": "Lilongwe", "region": "Central", "country": "Malawi", "lat": -13.9626, "lon": 33.7741},
{"id": 389, "name": "Zomba", "region": "Southern", "country": "Malawi", "lat": -15.3833, "lon": 35.3333},
{"id": 390, "name": "Kota Kinabalu", "region": "Sabah", "country": "Malaysia", "lat": 5.9804, "lon": 116.0735},
{"id": 391, "name": "Kuala Lumpur", "region": "Kuala Lumpur", "country": "Malaysia", "lat": 3.14, "lon": 101.69},
{"id": 392, "name": "Kuching", "region": "Sarawak", "country": "Malaysia", "lat": 1.5535, "lon": 110.3593},
{"id": 393, "name": "Malacca", "region": "Malacca", "country": "Malaysia", "lat": 2.1896, "lon": 102.2501},
{"id": 394, "name": "Penang", "region": "Penang", "country": "Malaysia", "lat": 5.4164, "lon": 100.3327},
{"id": 395, "name": "Malé", "region": "Malé", "country": "Maldives", "lat": 4.1755, "lon": 73.5093},
{"id": 396, "name": "Bamako", "region": "Bamako", "country": "Mali", "lat": 12.6392, "lon": -8.0029},
{"id": 397, "name": "Gao", "region": "Gao", "country": "Mali", "lat": 16.2667, "lon": -0.05},
{"id": 398, "name": "Kayes", "region": "Kayes", "country": "Mali", "lat": 14.45, "lon": -11.4333},
{"id": 399, "name": "Koulikoro", "region": "Koulikoro", "country": "Mali", "lat": 12.8667, "lon": -7.5667},
{"id": 400, "name": "Koutiala", "region": "Sikasso", "country": "Mali", "lat": 12.3833, "lon": -5.4667},
{"id": 401, "name": "Mopti", "region": "Mopti", "country": "Mali", "lat": 14.493, "lon": -4.1942},
{"id": 402, "name": "Sikasso", "region": "Sikasso", "country": "Mali", "lat": 11.3167, "lon": -5.6667},
{"id": 403, "name": "Ségou", "region": "Ségou", "country": "Mali", "lat": 13.45, "lon": -6.2667},
{"id": 404, "name": "Timbuktu", "region": "Tombouctou", "country": "Mali", "lat": 16.7666, "lon": -3.0026},
{"id": 405, "name": "Valletta", "region": "Malta", "country": "Malta", "lat": 35.8989, "lon": 14.5146},
{"id": 406, "name": "Majuro", "region": "Majuro Atoll", "country": "Marshall Islands", "lat": 7.0897, "lon": 171.3803},
{"id": 407, "name": "Atar", "region": "Adrar", "country": "Mauritania", "lat": 20.5167, "lon": -13.05},
{"id": 408, "name": "Chinguetti", "region": "Adrar", "country": "Mauritania", "lat": 20.4591, "lon": -12.3622},
{"id": 409, "name": "Kaédi", "region": "Gorgol", "country": "Mauritania", "lat": 16.15, "lon": -13.5},
{"id": 410, "name": "Kiffa", "region": "Assaba", "country": "Mauritania", "lat": 16.6167, "lon": -11.4},
{"id": 411, "name": "Nouadhibou", "region": "Dakhlet Nouadhibou", "country": "Mauritania", "lat": 20.95, "lon": -17.0333},
{"id": 412, "name": "Nouakchott", "region": "Nouakchott-Nord", "country": "Mauritania", "lat": 18.0841, "lon": -15.9784},
{"id": 413, "name": "Sélibaby", "region": "Guidimaka", "country": "Mauritania", "lat": 15.1583, "lon": -12.1819},
{"id": 414, "name": "Curepipe", "region": "Plaines Wilhems", "country": "Mauritius", "lat": -20.3147, "lon": 57.5203},
{"id": 415, "name": "Flic-en-Flac", "region": "Black River", "country": "Mauritius", "lat": -20.2742, "lon": 57.3631},
{"id": 416, "name": "Mahébourg", "region": "Grand Port", "country": "Mauritius", "lat": -20.4081, "lon": 57.7},
{"id": 417, "name": "Port Louis", "region": "Port Louis", "country": "Mauritius", "lat": -20.1609, "lon": 57.5012},
{"id": 418, "name": "Quatre Bornes", "region": "Plaines Wilhems", "country": "Mauritius", "lat": -20.265, "lon": 57.4792},
{"id": 419, "name": "Cancún", "region": "Quintana Roo", "country": "Mexico", "lat": 21.1619, "lon": -86.8515},
{"id": 420, "name": "Guadalajara", "region": "Jalisco", "country": "Mexico", "lat": 20.6597, "lon": -103.3496},
{"id": 421, "name": "Mexico City", "region": "Mexico City", "country": "Mexico", "lat": 19.43, "lon": -99.13},
{"id": 422, "name": "Monterrey", "region": "Nuevo León", "country": "Mexico", "lat": 25.6866, "lon": -100.3161},
{"id": 423, "name": "Mérida", "region": "Yucatán", "country": "Mexico", "lat": 20.9674, "lon": -89.5926},
{"id": 424, "name": "Oaxaca", "region": "Oaxaca", "country": "Mexico", "lat": 17.0732, "lon": -96.7266},
{"id": 425, "name": "Puebla", "region": "Puebla", "country": "Mexico", "lat": 19.0414, "lon": -98.2063},
{"id": 426, "name": "San Miguel de Allende", "region": "Guanajuato", "country": "Mexico", "lat": 20.9153, "lon": -100.7439},
{"id": 427, "name": "Tijuana", "region": "Baja California", "country": "Mexico", "lat": 32.5149, "lon": -117.0382},
{"id": 428, "name": "Palikir", "region": "Pohnpei", "country": "Micronesia", "lat": 6.9147, "lon": 158.161},
{"id": 429, "name": "Chisinau", "region": "Chisinau", "country": "Moldova", "lat": 47.0105, "lon": 28.8638},
{"id": 430, "name": "Monaco", "region": "Monaco", "country": "Monaco", "lat": 43.7384, "lon": 7.4246},
{"id": 431, "name": "Monte Carlo", "region": "Monaco", "country": "Monaco", "lat": 43.7384, "lon": 7.4246},
{"id": 432, "name": "Ulaanbaatar", "region": "Ulaanbaatar", "country": "Mongolia", "lat": 47.8864, "lon": 106.9057},
{"id": 433, "name": "Kotor", "region": "Kotor", "country": "Montenegro", "lat": 42.4247, "lon": 18.7712},
{"id": 434, "name": "Podgorica", "region": "Podgorica", "country": "Montenegro", "lat": 42.4304, "lon": 19.2594},
{"id": 435, "name": "Casablanca", "region": "Casablanca-Settat", "country": "Morocco", "lat": 33.57, "lon": -7.59},
{"id": 436, "name": "Essaouira", "region": "Marrakesh-Safi", "country": "Morocco", "lat": 31.5131, "lon": -9.7698},
{"id": 437, "name": "Fes", "region": "Fès-Meknès", "country": "Morocco", "lat": 34.0331, "lon": -5.0003},
{"id": 438, "name": "Marrakech", "region": "Marrakesh-Safi", "country": "Morocco", "lat": 31.6295, "lon": -7.9811},
{"id": 439, "name": "Rabat", "region": "Rabat-Salé-Kénitra", "country": "Morocco", "lat": 34.0209, "lon": -6.8417},
{"id": 440, "name": "Tangier", "region": "Tanger-Tetouan-Al Hoceima", "country": "Morocco", "lat": 35.7595, "lon": -5.834},
{"id": 441, "name": "Beira", "region": "Sofala", "country": "Mozambique", "lat": -19.8308, "lon": 34.8447},
{"id": 442, "name": "Maputo", "region": "Maputo City", "country": "Mozambique", "lat": -25.9692, "lon": 32.5732},
{"id": 443, "name": "Nampula", "region": "Nampula", "country": "Mozambique", "lat": -15.1167, "lon": 39.2667},
{"id": 444, "name": "Bagan", "region": "Mandalay Region", "country": "Myanmar", "lat": 21.1722, "lon": 94.8606},
{"id": 445, "name": "Mandalay", "region": "Mandalay Region", "country": "Myanmar", "lat": 21.9588, "lon": 96.0891},
{"id": 446, "name": "Yangon", "region": "Yangon Region", "country": "Myanmar", "lat": 16.8409, "lon": 96.1735},
{"id": 447, "name": "Swakopmund", "region": "Erongo", "country": "Namibia", "lat": -22.6749, "lon": 14.5266},
{"id": 448, "name": "Walvis Bay", "region": "Erongo", "country": "Namibia", "lat": -22.9576, "lon": 14.5053},
{"id": 449, "name": "Windhoek", "region": "Khomas", "country": "Namibia", "lat": -22.5609, "lon": 17.0658},
{"id": 450, "name": "Yaren", "region": "Yaren", "country": "Nauru", "lat": -0.5476, "lon": 166.9209},
{"id": 451, "name": "Kathmandu", "region": "Bagmati", "country": "Nepal", "lat": 27.7172, "lon": 85.324},
{"id": 452, "name": "Pokhara", "region": "Gandaki", "country": "Nepal", "lat": 28.2096, "lon": 83.9856},
{"id": 453, "name": "Amsterdam", "region": "North Holland", "country": "Netherlands", "lat": 52.37, "lon": 4.89},
{"id": 454, "name": "Eindhoven", "region": "North Brabant", "country": "Netherlands", "lat": 51.4416, "lon": 5.4697},
{"id": 455, "name": "Groningen", "region": "Groningen", "country": "Netherlands", "lat": 53.2194, "lon": 6.5665},
{"id": 456, "name": "Maastricht", "region": "Limburg", "country": "Netherlands", "lat": 50.8514, "lon": 5.691},
{"id": 457, "name": "Rotterdam", "region": "South Holland", "country": "Netherlands", "lat": 51.9244, "lon": 4.4777},
{"id": 458, "name": "The Hague", "region": "South Holland", "country": "Netherlands", "lat": 52.0705, "lon": 4.3007},
{"id": 459, "name": "Utrecht", "region": "Utrecht", "country": "Netherlands", "lat": 52.0907, "lon": 5.1214},
{"id": 460, "name": "Nouméa", "region": "South Province", "country": "New Caledonia", "lat": -22.2558, "lon": 166.4505},
{"id": 461, "name": "Auckland", "region": "Auckland", "country": "New Zealand", "lat": -36.85, "lon": 174.76},
{"id": 462, "name": "Christchurch", "region": "Canterbury", "country": "New Zealand", "lat": -43.5321, "lon": 172.6362},
{"id": 463, "name": "Dunedin", "region": "Otago", "country": "New Zealand", "lat": -45.8788, "lon": 170.5028},
{"id": 464, "name": "Queenstown", "region": "Otago", "country": "New Zealand", "lat": -45.0312, "lon": 168.6626},
{"id": 465, "name": "Rotorua", "region": "Bay of Plenty", "country": "New Zealand", "lat": -38.1368, "lon": 176.2497},
{"id": 466, "name": "Tauranga", "region": "Bay of Plenty", "country": "New Zealand", "lat": -37.6878, "lon": 176.1651},
{"id": 467, "name": "Wellington", "region": "Wellington", "country": "New Zealand", "lat": -41.2865, "lon": 174.7762},
{"id": 468, "name": "Chinandega", "region": "Chinandega", "country": "Nicaragua", "lat": 12.6167, "lon": -87.15},
{"id": 469, "name": "Estelí", "region": "Estelí", "country": "Nicaragua", "lat": 13.0833, "lon": -86.35},
{"id": 470, "name": "Granada", "region": "Granada", "country": "Nicaragua", "lat": 11.9344, "lon": -85.956},
{"id": 471, "name": "León", "region": "León", "country": "Nicaragua", "lat": 12.4344, "lon": -86.8775},
{"id": 472, "name": "Managua", "region": "Managua", "country": "Nicaragua", "lat": 12.115, "lon": -86.2362},
{"id": 473, "name": "Masaya", "region": "Masaya", "country": "Nicaragua", "lat": 11.9667, "lon": -86.1},
{"id": 474, "name": "Matagalpa", "region": "Matagalpa", "country": "Nicaragua", "lat": 12.9167, "lon": -85.9167},
{"id": 475, "name": "Agadez", "region": "Agadez", "country": "Niger", "lat": 16.9742, "lon": 7.9909},
{"id": 476, "name": "Diffa", "region": "Diffa", "country": "Niger", "lat": 13.3167, "lon": 12.6167},
{"id": 477, "name": "Maradi", "region": "Maradi", "country": "Niger", "lat": 13.5, "lon": 7.1},
{"id": 478, "name": "Niamey", "region": "Niamey", "country": "Niger", "lat": 13.5136, "lon": 2.1098},
{"id": 479, "name": "Tahoua", "region": "Tahoua", "country": "Niger", "lat": 14.9, "lon": 5.2667},
{"id": 480, "name": "Zinder", "region": "Zinder", "country": "Niger", "lat": 13.8, "lon": 8.9833},
{"id": 481, "name": "Lagos", "region": "Lagos", "country": "Nigeria", "lat": 6.52, "lon": 3.38},
{"id": 482, "name": "Ohrid", "region": "Ohrid", "country": "North Macedonia", "lat": 41.1231, "lon": 20.8016},
{"id": 483, "name": "Skopje", "region": "Skopje", "country": "North Macedonia", "lat": 41.9973, "lon": 21.428},
{"id": 484, "name": "Saipan", "region": "Saipan", "country": "Northern Mariana Islands", "lat": 15.185, "lon": 145.7467},
{"id": 485, "name": "Bergen", "region": "Vestland", "country": "Norway", "lat": 60.3913, "lon": 5.3221},
{"id": 486, "name": "Oslo", "region": "Oslo", "country": "Norway", "lat": 59.91, "lon": 10.75},
{"id": 487, "name": "Stavanger", "region": "Rogaland", "country": "Norway", "lat": 58.9699, "lon": 5.7331},
{"id": 488, "name": "Tromso", "region": "Troms og Finnmark", "country": "Norway", "lat": 69.6492, "lon": 18.9553},
{"id": 489, "name": "Trondheim", "region": "Trøndelag", "country": "Norway", "lat": 63.4305, "lon": 10.3951},
{"id": 490, "name": "Muscat", "region": "Muscat", "country": "Oman", "lat": 23.588, "lon": 58.3829},
{"id": 491, "name": "Salalah", "region": "Dhofar", "country": "Oman", "lat": 17.0151, "lon": 54.0924},
{"id": 492, "name": "Islamabad", "region": "Islamabad Capital Territory", "country": "Pakistan", "lat": 33.6844, "lon": 73.0479},
{"id": 493, "name": "Karachi", "region": "Sindh", "country": "Pakistan", "lat": 24.86, "lon": 67.01},
{"id": 494, "name": "Lahore", "region": "Punjab", "country": "Pakistan", "lat": 31.5204, "lon": 74.3587},
{"id": 495, "name": "Rawalpindi", "region": "Punjab", "country": "Pakistan", "lat": 33.5651, "lon": 73.0169},
{"id": 496, "name": "Bocas del Toro", "region": "Bocas del Toro", "country": "Panama", "lat": 9.34, "lon": -82.242},
{"id": 497, "name": "Chitré", "region": "Herrera", "country": "Panama", "lat": 7.9667, "lon": -80.4333},
{"id": 498, "name": "Colón", "region": "Colón", "country": "Panama", "lat": 9.3589, "lon": -79.9},
{"id": 499, "name": "David", "region": "Chiriquí", "country": "Panama", "lat": 8.4333, "lon": -82.4333},
{"id": 500, "name": "Panama City", "region": "Panamá", "country": "Panama", "lat": 8.98, "lon": -79.52},
{"id": 501, "name": "Penonomé", "region": "Coclé", "country": "Panama", "lat": 8.5167, "lon": -80.3667},
{"id": 502, "name": "Santiago", "region": "Veraguas", "country": "Panama", "lat": 8.1, "lon": -80.9833},
{"id": 503, "name": "Port Moresby", "region": "National Capital District", "country": "Papua New Guinea", "lat": -9.478, "lon": 147.15},
{"id": 504, "name": "Asunción", "region": "Asunción", "country": "Paraguay", "lat": -25.2637, "lon": -57.5759},
{"id": 505, "name": "Ciudad del Este", "region": "Alto Paraná", "country": "Paraguay", "lat": -25.5091, "lon": -54.6116},
{"id": 506, "name": "Arequipa", "region": "Arequipa", "country": "Peru", "lat": -16.409, "lon": -71.5375},
{"id": 507, "name": "Cusco", "region": "Cusco", "country": "Peru", "lat": -13.5319, "lon": -71.9675},
{"id": 508, "name": "Lima", "region": "Lima", "country": "Peru", "lat": -12.04, "lon": -77.03},
{"id": 509, "name": "Lima", "region": "Lima Province", "country": "Peru", "lat": -12.0464, "lon": -77.0428},
{"id": 510, "name": "Boracay", "region": "Aklan", "country": "Philippines", "lat": 11.9674, "lon": 121.9248},
{"id": 511, "name": "Cebu City", "region": "Cebu", "country": "Philippines", "lat": 10.3157, "lon": 123.8854},
{"id": 512, "name": "Davao City", "region": "Davao del Sur", "country": "Philippines", "lat": 7.1907, "lon": 125.4553},
{"id": 513, "name": "Manila", "region": "Metro Manila", "country": "Philippines", "lat": 14.6, "lon": 120.98},
{"id": 514, "name": "Palawan", "region": "Palawan", "country": "Philippines", "lat": 9.8349, "lon": 118.7384},
{"id": 515, "name": "Gdansk", "region": "Pomerania", "country": "Poland", "lat": 54.352, "lon": 18.6466},
{"id": 516, "name": "Krakow", "region": "Lesser Poland", "country": "Poland", "lat": 50.0647, "lon": 19.945},
{"id": 517, "name": "Warsaw", "region": "Masovian", "country": "Poland", "lat": 52.23, "lon": 21.01},
{"id": 518, "name": "Warsaw", "region": "Masovia", "country": "Poland", "lat": 52.2297, "lon": 21.0122},
{"id": 519, "name": "Wroclaw", "region": "Lower Silesia", "country": "Poland", "lat": 51.1079, "lon": 17.0385},
{"id": 520, "name": "Coimbra", "region": "Coimbra", "country": "Portugal", "lat": 40.2033, "lon": -8.4103},
{"id": 521, "name": "Faro", "region": "Algarve", "country": "Portugal", "lat": 37.0194, "lon": -7.9304},
{"id": 522, "name": "Funchal", "region": "Madeira", "country": "Portugal", "lat": 32.6669, "lon": -16.9241},
{"id": 523, "name": "Lisbon", "region": "Lisbon", "country": "Portugal", "lat": 38.72, "lon": -9.14},
{"id": 524, "name": "Ponta Delgada", "region": "Azores", "country": "Portugal", "lat": 37.7396, "lon": -25.6687},
{"id": 525, "name": "Porto", "region": "Porto", "country": "Portugal", "lat": 41.1579, "lon": -8.6291},
{"id": 526, "name": "Sintra", "region": "Lisbon", "country": "Portugal", "lat": 38.8029, "lon": -9.3816},
{"id": 527, "name": "San Juan", "region": "San Juan", "country": "Puerto Rico", "lat": 18.4655, "lon": -66.1057},
{"id": 528, "name": "Bosaso", "region": "Bari", "country": "Puntland", "lat": 11.2833, "lon": 49.1833},
{"id": 529, "name": "Garoowe", "region": "Nugal", "country": "Puntland", "lat": 8.4, "lon": 48.4833},
{"id": 530, "name": "Doha", "region": "Doha", "country": "Qatar", "lat": 25.29, "lon": 51.53},
{"id": 531, "name": "Brazzaville", "region": "Brazzaville", "country": "Republic of the Congo", "lat": -4.2634, "lon": 15.2429},
{"id": 532, "name": "Pointe-Noire", "region": "Pointe-Noire", "country": "Republic of the Congo", "lat": -4.7777, "lon": 11.846},
{"id": 533, "name": "Brasov", "region": "Brasov", "country": "Romania", "lat": 45.6427, "lon": 25.5887},
{"id": 534, "name": "Bucharest", "region": "Bucharest", "country": "Romania", "lat": 44.4268, "lon": 26.1025},
{"id": 535, "name": "Sibiu", "region": "Sibiu", "country": "Romania", "lat": 45.7983, "lon": 24.1256},
{"id": 536, "name": "Sighisoara", "region": "Mures", "country": "Romania", "lat": 46.2218, "lon": 24.7929},
{"id": 537, "name": "Moscow", "region": "Moscow", "country": "Russia", "lat": 55.76, "lon": 37.62},
{"id": 538, "name": "Novosibirsk", "region": "Novosibirsk Oblast", "country": "Russia", "lat": 55.04, "lon": 82.94},
{"id": 539, "name": "St. Petersburg", "region": "Saint Petersburg", "country": "Russia", "lat": 59.93, "lon": 30.36},
{"id": 540, "name": "Butare", "region": "Southern", "country": "Rwanda", "lat": -2.5967, "lon": 29.7439},
{"id": 541, "name": "Kigali", "region": "Kigali", "country": "Rwanda", "lat": -1.9441, "lon": 30.0619},
{"id": 542, "name": "Basseterre", "region": "Saint George Basseterre", "country": "Saint Kitts and Nevis", "lat": 17.2983, "lon": -62.7342},
{"id": 543, "name": "Charlestown", "region": "Nevis", "country": "Saint Kitts and Nevis", "lat": 17.1333, "lon": -62.6167},
{"id": 544, "name": "Castries", "region": "Castries", "country": "Saint Lucia", "lat": 14.0167, "lon": -60.9833},
{"id": 545, "name": "Soufrière", "region": "Soufrière", "country": "Saint Lucia", "lat": 13.8569, "lon": -61.0569},
{"id": 546, "name": "Vieux Fort", "region": "Vieux Fort", "country": "Saint Lucia", "lat": 13.7167, "lon": -60.95},
{"id": 547, "name": "Bequia", "region": "Grenadines", "country": "Saint Vincent and the Grenadines", "lat": 13.0167, "lon": -61.2333},
{"id": 548, "name": "Georgetown", "region": "Charlotte", "country": "Saint Vincent and the Grenadines", "lat": 13.2806, "lon": -61.1189},
{"id": 549, "name": "Kingstown", "region": "Saint George", "country": "Saint Vincent and the Grenadines", "lat": 13.16, "lon": -61.2242},
{"id": 550, "name": "Apia", "region": "Tuamasaga", "country": "Samoa", "lat": -13.8507, "lon": -171.7514},
{"id": 551, "name": "San Marino", "region": "San Marino", "country": "San Marino", "lat": 43.9424, "lon": 12.4578},
{"id": 552, "name": "Dammam", "region": "Eastern Province", "country": "Saudi Arabia", "lat": 26.3927, "lon": 49.9777},
{"id": 553, "name": "Jeddah", "region": "Mecca", "country": "Saudi Arabia", "lat": 21.4858, "lon": 39.1925},
{"id": 554, "name": "Mecca", "region": "Mecca", "country": "Saudi Arabia", "lat": 21.4225, "lon": 39.8262},
{"id": 555, "name": "Medina", "region": "Medina", "country": "Saudi Arabia", "lat": 24.5247, "lon": 39.5692},
{"id": 556, "name": "Riyadh", "region": "Riyadh", "country": "Saudi Arabia", "lat": 24.71, "lon": 46.67},
{"id": 557, "name": "Dakar", "region": "Dakar", "country": "Senegal", "lat": 14.7167, "lon": -17.4677},
{"id": 558, "name": "Kolda", "region": "Kolda", "country": "Senegal", "lat": 12.8833, "lon": -14.95},
{"id": 559, "name": "Kédougou", "region": "Kédougou", "country": "Senegal", "lat": 12.55, "lon": -12.1833},
{"id": 560, "name": "Saint-Louis", "region": "Saint-Louis", "country": "Senegal", "lat": 16.0326, "lon": -16.4898},
{"id": 561, "name": "Tambacounda", "region": "Tambacounda", "country": "Senegal", "lat": 13.7689, "lon": -13.6672},
{"id": 562, "name": "Thiès", "region": "Thiès", "country": "Senegal", "lat": 14.7833, "lon": -16.9167},
{"id": 563, "name": "Touba", "region": "Diourbel", "country": "Senegal", "lat": 14.8667, "lon": -15.8833},
{"id": 564, "name": "Ziguinchor", "region": "Ziguinchor", "country": "Senegal", "lat": 12.5833, "lon": -16.2667},
{"id": 565, "name": "Belgrade", "region": "Central Serbia", "country": "Serbia", "lat": 44.82, "lon": 20.46},
{"id": 566, "name": "Belgrade", "region": "Belgrade", "country": "Serbia", "lat": 44.7866, "lon": 20.4489},
{"id": 567, "name": "Niš", "region": "Nišava", "country": "Serbia", "lat": 43.3209, "lon": 21.8958},
{"id": 568, "name": "Novi Sad", "region": "Vojvodina", "country": "Serbia", "lat": 45.2671, "lon": 19.8335},
{"id": 569, "name": "Anse Boileau", "region": "Mahé", "country": "Seychelles", "lat": -4.7167, "lon": 55.4833},
{"id": 570, "name": "Victoria", "region": "Mahé", "country": "Seychelles", "lat": -4.6191, "lon": 55.4513},
{"id": 571, "name": "Bo", "region": "Southern", "country": "Sierra Leone", "lat": 7.955, "lon": -11.74},
{"id": 572, "name": "Freetown", "region": "Western Area", "country": "Sierra Leone", "lat": 8.4657, "lon": -13.2317},
{"id": 573, "name": "Kenema", "region": "Eastern", "country": "Sierra Leone", "lat": 7.8833, "lon": -11.1833},
{"id": 574, "name": "Koidu", "region": "Eastern", "country": "Sierra Leone", "lat": 8.6439, "lon": -10.9717},
{"id": 575, "name": "Makeni", "region": "Northern", "country": "Sierra Leone", "lat": 8.8803, "lon": -12.0447},
{"id": 576, "name": "Singapore", "region": "Central Singapore", "country": "Singapore", "lat": 1.35, "lon": 103.82},
{"id": 577, "name": "Singapore", "region": "Central Region", "country": "Singapore", "lat": 1.3521, "lon": 103.8198},
{"id": 578, "name": "Bratislava", "region": "Bratislava", "country": "Slovakia", "lat": 48.1486, "lon": 17.1077},
{"id": 579, "name": "Bled", "region": "Upper Carniola", "country": "Slovenia", "lat": 46.3692, "lon": 14.1136},
{"id": 580, "name": "Ljubljana", "region": "Central Slovenia", "country": "Slovenia", "lat": 46.0569, "lon": 14.5058},
{"id": 581, "name": "Honiara", "region": "Guadalcanal", "country": "Solomon Islands", "lat": -9.4456, "lon": 159.9729},
{"id": 582, "name": "Mogadishu", "region": "Banaadir", "country": "Somalia", "lat": 2.0469, "lon": 45.3182},
{"id": 583, "name": "Berbera", "region": "Sahil", "country": "Somaliland", "lat": 10.4356, "lon": 45.0164},
{"id": 584, "name": "Hargeisa", "region": "Woqooyi Galbeed", "country": "Somaliland", "lat": 9.56, "lon": 44.065},
{"id": 585, "name": "Bloemfontein", "region": "Free State", "country": "South Africa", "lat": -29.1167, "lon": 26.2167},
{"id": 586, "name": "Cape Town", "region": "Western Cape", "country": "South Africa", "lat": -33.93, "lon": 18.42},
{"id": 587, "name": "Durban", "region": "KwaZulu-Natal", "country": "South Africa", "lat": -29.8587, "lon": 31.0218},
{"id": 588, "name": "Johannesburg", "region": "Gauteng", "country": "South Africa", "lat": -26.2041, "lon": 28.0473},
{"id": 589, "name": "Kimberley", "region": "Northern Cape", "country": "South Africa", "lat": -28.7386, "lon": 24.7581},
{"id": 590, "name": "Nelspruit", "region": "Mpumalanga", "country": "South Africa", "lat": -25.4747, "lon": 30.97},
{"id": 591, "name": "Polokwane", "region": "Limpopo", "country": "South Africa", "lat": -23.9, "lon": 29.45},
{"id": 592, "name": "Port Elizabeth", "region": "Eastern Cape", "country": "South Africa", "lat": -33.9608, "lon": 25.6022},
{"id": 593, "name": "Pretoria", "region": "Gauteng", "country": "South Africa", "lat": -25.7461, "lon": 28.1881},
{"id": 594, "name": "Busan", "region": "Busan", "country": "South Korea", "lat": 35.1796, "lon": 129.0756},
{"id": 595, "name": "Daegu", "region": "Daegu", "country": "South Korea", "lat": 35.8714, "lon": 128.6014},
{"id": 596, "name": "Incheon", "region": "Incheon", "country": "South Korea", "lat": 37.4563, "lon": 126.7052},
{"id": 597, "name": "Jeju", "region": "Jeju", "country": "South Korea", "lat": 33.4996, "lon": 126.5312},
{"id": 598, "name": "Seoul", "region": "Seoul", "country": "South Korea", "lat": 37.57, "lon": 126.98},
{"id": 599, "name": "Juba", "region": "Central Equatoria", "country": "South Sudan", "lat": 4.8594, "lon": 31.5713},
{"id": 600, "name": "Malakal", "region": "Upper Nile", "country": "South Sudan", "lat": 9.5333, "lon": 31.65},
{"id": 601, "name": "Wau", "region": "Western Bahr el Ghazal", "country": "South Sudan", "lat": 7.7, "lon": 28.0},
{"id": 602, "name": "Barcelona", "region": "Catalonia", "country": "Spain", "lat": 41.38, "lon": 2.17},
{"id": 603, "name": "Bilbao", "region": "Basque Country", "country": "Spain", "lat": 43.26, "lon": -2.94},
{"id": 604, "name": "Cordoba", "region": "Andalusia", "country": "Spain", "lat": 37.8882, "lon": -4.7794},
{"id": 605, "name": "Granada", "region": "Andalusia", "country": "Spain", "lat": 37.1773, "lon": -3.5986},
{"id": 606, "name": "Ibiza", "region": "Balearic Islands", "country": "Spain", "lat": 38.9067, "lon": 1.4206},
{"id": 607, "name": "Madrid", "region": "Madrid", "country": "Spain", "lat": 40.42, "lon": -3.7},
{"id": 608, "name": "Madrid", "region": "Community of Madrid", "country": "Spain", "lat": 40.4168, "lon": -3.7038},
{"id": 609, "name": "Malaga", "region": "Andalusia", "country": "Spain", "lat": 36.7213, "lon": -4.4213},
{"id": 610, "name": "Palma de Mallorca", "region": "Balearic Islands", "country": "Spain", "lat": 39.5696, "lon": 2.6502},
{"id": 611, "name": "Salamanca", "region": "Castile and León", "country": "Spain", "lat": 40.964, "lon": -5.663},
{"id": 612, "name": "Seville", "region": "Andalusia", "country": "Spain", "lat": 37.39, "lon": -5.99},
{"id": 613, "name": "Toledo", "region": "Castile-La Mancha", "country": "Spain", "lat": 39.8628, "lon": -4.0273},
{"id": 614, "name": "Valencia", "region": "Valencian Community", "country": "Spain", "lat": 39.47, "lon": -0.38},
{"id": 615, "name": "Zaragoza", "region": "Aragon", "country": "Spain", "lat": 41.65, "lon": -0.89},
{"id": 616, "name": "Colombo", "region": "Western Province", "country": "Sri Lanka", "lat": 6.9271, "lon": 79.8612},
{"id": 617, "name": "Galle", "region": "Southern Province", "country": "Sri Lanka", "lat": 6.0535, "lon": 80.221},
{"id": 618, "name": "Kandy", "region": "Central Province", "country": "Sri Lanka", "lat": 7.2906, "lon": 80.6337},
{"id": 619, "name": "Khartoum", "region": "Khartoum", "country": "Sudan", "lat": 15.5007, "lon": 32.5599},
{"id": 620, "name": "Khartoum North", "region": "Khartoum", "country": "Sudan", "lat": 15.6333, "lon": 32.6333},
{"id": 621, "name": "Omdurman", "region": "Khartoum", "country": "Sudan", "lat": 15.65, "lon": 32.4833},
{"id": 622, "name": "Port Sudan", "region": "Red Sea", "country": "Sudan", "lat": 19.6158, "lon": 37.2164},
{"id": 623, "name": "Albina", "region": "Marowijne", "country": "Suriname", "lat": 5.5, "lon": -54.05},
{"id": 624, "name": "Lelydorp", "region": "Wanica", "country": "Suriname", "lat": 5.7, "lon": -55.2333},
{"id": 625, "name": "Nieuw Nickerie", "region": "Nickerie", "country": "Suriname", "lat": 5.95, "lon": -56.9833},
{"id": 626, "name": "Paramaribo", "region": "Paramaribo", "country": "Suriname", "lat": 5.852, "lon": -55.2038},
{"id": 627, "name": "Gothenburg", "region": "Västra Götaland", "country": "Sweden", "lat": 57.7089, "lon": 11.9746},
{"id": 628, "name": "Malmo", "region": "Scania", "country": "Sweden", "lat": 55.6049, "lon": 13.0038},
{"id": 629, "name": "Stockholm", "region": "Stockholm", "country": "Sweden", "lat": 59.33, "lon": 18.06},
{"id": 630, "name": "Uppsala", "region": "Uppsala", "country": "Sweden", "lat": 59.8586, "lon": 17.6389},
{"id": 631, "name": "Basel", "region": "Basel-Stadt", "country": "Switzerland", "lat": 47.5596, "lon": 7.5886},
{"id": 632, "name": "Bern", "region": "Bern", "country": "Switzerland", "lat": 46.948, "lon": 7.4474},
{"id": 633, "name": "Geneva", "region": "Geneva", "country": "Switzerland", "lat": 46.2044, "lon": 6.1432},
{"id": 634, "name": "Interlaken", "region": "Bern", "country": "Switzerland", "lat": 46.6863, "lon": 7.8632},
{"id": 635, "name": "Lausanne", "region": "Vaud", "country": "Switzerland", "lat": 46.5197, "lon": 6.6323},
{"id": 636, "name": "Lucerne", "region": "Lucerne", "country": "Switzerland", "lat": 47.0505, "lon": 8.3064},
{"id": 637, "name": "Lugano", "region": "Ticino", "country": "Switzerland", "lat": 46.0037, "lon": 8.9511},
{"id": 638, "name": "St. Moritz", "region": "Graubünden", "country": "Switzerland", "lat": 46.497, "lon": 9.837},
{"id": 639, "name": "Zermatt", "region": "Valais", "country": "Switzerland", "lat": 46.0207, "lon": 7.7491},
{"id": 640, "name": "Zurich", "region": "Zurich", "country": "Switzerland", "lat": 47.37, "lon": 8.55},
{"id": 641, "name": "Aleppo", "region": "Aleppo", "country": "Syria", "lat": 36.2021, "lon": 37.1343},
{"id": 642, "name": "Damascus", "region": "Damascus", "country": "Syria", "lat": 33.51, "lon": 36.29},
{"id": 643, "name": "Santo António", "region": "Príncipe", "country": "São Tomé and Príncipe", "lat": 1.6397, "lon": 7.4178},
{"id": 644, "name": "São Tomé", "region": "Água Grande", "country": "São Tomé and Príncipe", "lat": 0.3302, "lon": 6.7333},
{"id": 645, "name": "Kaohsiung", "region": "Kaohsiung", "country": "Taiwan", "lat": 22.6273, "lon": 120.3014},
{"id": 646, "name": "Taichung", "region": "Taichung", "country": "Taiwan", "lat": 24.1477, "lon": 120.6736},
{"id": 647, "name": "Tainan", "region": "Tainan", "country": "Taiwan", "lat": 22.9997, "lon": 120.227},
{"id": 648, "name": "Taipei", "region": "Taipei City", "country": "Taiwan", "lat": 25.03, "lon": 121.56},
{"id": 649, "name": "Taipei", "region": "Taipei", "country": "Taiwan", "lat": 25.033, "lon": 121.5654},
{"id": 650, "name": "Dushanbe", "region": "Dushanbe", "country": "Tajikistan", "lat": 38.5598, "lon": 68.787},
{"id": 651, "name": "Arusha", "region": "Arusha", "country": "Tanzania", "lat": -3.3869, "lon": 36.683},
{"id": 652, "name": "Dar es Salaam", "region": "Dar es Salaam", "country": "Tanzania", "lat": -6.7924, "lon": 39.2083},
{"id": 653, "name": "Dodoma", "region": "Dodoma", "country": "Tanzania", "lat": -6.163, "lon": 35.7516},
{"id": 654, "name": "Mbeya", "region": "Mbeya", "country": "Tanzania", "lat": -8.9, "lon": 33.45},
{"id": 655, "name": "Mwanza", "region": "Mwanza", "country": "Tanzania", "lat": -2.5167, "lon": 32.9},
{"id": 656, "name": "Stone Town", "region": "Zanzibar Urban/West", "country": "Tanzania", "lat": -6.1659, "lon": 39.2026},
{"id": 657, "name": "Zanzibar City", "region": "Zanzibar Urban/West", "country": "Tanzania", "lat": -6.1659, "lon": 39.2026},
{"id": 658, "name": "Bangkok", "region": "Bangkok", "country": "Thailand", "lat": 13.76, "lon": 100.5},
{"id": 659, "name": "Chiang Mai", "region": "Chiang Mai", "country": "Thailand", "lat": 18.7061, "lon": 98.9817},
{"id": 660, "name": "Krabi", "region": "Krabi", "country": "Thailand", "lat": 8.0863, "lon": 98.9063},
{"id": 661, "name": "Phuket", "region": "Phuket", "country": "Thailand", "lat": 7.8804, "lon": 98.3923},
{"id": 662, "name": "Atakpamé", "region": "Plateaux", "country": "Togo", "lat": 7.5333, "lon": 1.1333},
{"id": 663, "name": "Dapaong", "region": "Savanes", "country": "Togo", "lat": 10.8667, "lon": 0.2},
{"id": 664, "name": "Kara", "region": "Kara", "country": "Togo", "lat": 9.55, "lon": 1.2},
{"id": 665, "name": "Kpalimé", "region": "Plateaux", "country": "Togo", "lat": 6.9, "lon": 0.6333},
{"id": 666, "name": "Lomé", "region": "Maritime", "country": "Togo", "lat": 6.1304, "lon": 1.2158},
{"id": 667, "name": "Sokodé", "region": "Centrale", "country": "Togo", "lat": 8.9833, "lon": 1.1333},
{"id": 668, "name": "Nukuʻalofa", "region": "Tongatapu", "country": "Tonga", "lat": -21.1393, "lon": -175.2049},
{"id": 669, "name": "Port of Spain", "region": "Port of Spain", "country": "Trinidad and Tobago", "lat": 10.6549, "lon": -61.5019},
{"id": 670, "name": "Sfax", "region": "Sfax", "country": "Tunisia", "lat": 34.7376, "lon": 10.7608},
{"id": 671, "name": "Sousse", "region": "Sousse", "country": "Tunisia", "lat": 35.8254, "lon": 10.636},
{"id": 672, "name": "Tunis", "region": "Tunis", "country": "Tunisia", "lat": 36.8065, "lon": 10.1815},
{"id": 673, "name": "Ankara", "region": "Ankara", "country": "Turkey", "lat": 39.92, "lon": 32.85},
{"id": 674, "name": "Istanbul", "region": "Istanbul", "country": "Turkey", "lat": 41.01, "lon": 28.98},
{"id": 675, "name": "Ashgabat", "region": "Ashgabat", "country": "Turkmenistan", "lat": 37.9601, "lon": 58.3261},
{"id": 676, "name": "Funafuti", "region": "Funafuti", "country": "Tuvalu", "lat": -8.5204, "lon": 179.198},
{"id": 677, "name": "Entebbe", "region": "Central", "country": "Uganda", "lat": 0.0528, "lon": 32.4637},
{"id": 678, "name": "Jinja", "region": "Eastern", "country": "Uganda", "lat": 0.4244, "lon": 33.2042},
{"id": 679, "name": "Kampala", "region": "Central", "country": "Uganda", "lat": 0.3476, "lon": 32.5825},
{"id": 680, "name": "Kiev", "region": "Kyiv City", "country": "Ukraine", "lat": 50.45, "lon": 30.52},
{"id": 681, "name": "Lviv", "region": "Lviv Oblast", "country": "Ukraine", "lat": 49.8397, "lon": 24.0297},
{"id": 682, "name": "Odessa", "region": "Odessa Oblast", "country": "Ukraine", "lat": 46.4825, "lon": 30.7233},
{"id": 683, "name": "Abu Dhabi", "region": "Abu Dhabi", "country": "United Arab Emirates", "lat": 24.4539, "lon": 54.3773},
{"id": 684, "name": "Dubai", "region": "Dubai", "country": "United Arab Emirates", "lat": 25.2, "lon": 55.27},
{"id": 685, "name": "Sharjah", "region": "Sharjah", "country": "United Arab Emirates", "lat": 25.3463, "lon": 55.4209},
{"id": 686, "name": "Birmingham", "region": "England", "country": "United Kingdom", "lat": 52.48, "lon": -1.89},
{"id": 687, "name": "Edinburgh", "region": "Scotland", "country": "United Kingdom", "lat": 55.95, "lon": -3.19},
{"id": 688, "name": "Glasgow", "region": "Scotland", "country": "United Kingdom", "lat": 55.86, "lon": -4.25},
{"id": 689, "name": "London", "region": "England", "country": "United Kingdom", "lat": 51.52, "lon": -0.11},
{"id": 690, "name": "Manchester", "region": "England", "country": "United Kingdom", "lat": 53.48, "lon": -2.24},
{"id": 691, "name": "Anchorage", "region": "Alaska", "country": "United States", "lat": 61.2181, "lon": -149.9003},
{"id": 692, "name": "Atlanta", "region": "Georgia", "country": "United States", "lat": 33.749, "lon": -84.388},
{"id": 693, "name": "Austin", "region": "Texas", "country": "United States", "lat": 30.2672, "lon": -97.7431},
{"id": 694, "name": "Boston", "region": "Massachusetts", "country": "United States", "lat": 42.3601, "lon": -71.0589},
{"id": 695, "name": "Chicago", "region": "Illinois", "country": "United States", "lat": 41.88, "lon": -87.63},
{"id": 696, "name": "Dallas", "region": "Texas", "country": "United States", "lat": 32.7767, "lon": -96.797},
{"id": 697, "name": "Denver", "region": "Colorado", "country": "United States", "lat": 39.7392, "lon": -104.9903},
{"id": 698, "name": "Fairbanks", "region": "Alaska", "country": "United States", "lat": 64.8378, "lon": -147.7164},
{"id": 699, "name": "Honolulu", "region": "Hawaii", "country": "United States", "lat": 21.3069, "lon": -157.8583},
{"id": 700, "name": "Houston", "region": "Texas", "country": "United States", "lat": 29.7604, "lon": -95.3698},
{"id": 701, "name": "Las Vegas", "region": "Nevada", "country": "United States", "lat": 36.1699, "lon": -115.1398},
{"id": 702, "name": "Los Angeles", "region": "California", "country": "United States", "lat": 34.05, "lon": -118.24},
{"id": 703, "name": "Miami", "region": "Florida", "country": "United States", "lat": 25.7617, "lon": -80.1918},
{"id": 704, "name": "Nashville", "region": "Tennessee", "country": "United States", "lat": 36.1627, "lon": -86.7816},
{"id": 705, "name": "New Orleans", "region": "Louisiana", "country": "United States", "lat": 29.9511, "lon": -90.0715},
{"id": 706, "name": "New York", "region": "New York", "country": "United States", "lat": 40.71, "lon": -74.01},
{"id": 707, "name": "New York City", "region": "New York", "country": "United States", "lat": 40.7128, "lon": -74.006},
{"id": 708, "name": "Orlando", "region": "Florida", "country": "United States", "lat": 28.5383, "lon": -81.3792},
{"id": 709, "name": "Philadelphia", "region": "Pennsylvania", "country": "United States", "lat": 39.9526, "lon": -75.1652},
{"id": 710, "name": "Phoenix", "region": "Arizona", "country": "United States", "lat": 33.4484, "lon": -112.074},
{"id": 711, "name": "Portland", "region": "Oregon", "country": "United States", "lat": 45.5152, "lon": -122.6784},
{"id": 712, "name": "Salt Lake City", "region": "Utah", "country": "United States", "lat": 40.7608, "lon": -111.891},
{"id": 713, "name": "San Antonio", "region": "Texas", "country": "United States", "lat": 29.4241, "lon": -98.4936},
{"id": 714, "name": "San Diego", "region": "California", "country": "United States", "lat": 32.7157, "lon": -117.1611},
{"id": 715, "name": "San Francisco", "region": "California", "country": "United States", "lat": 37.77, "lon": -122.42},
{"id": 716, "name": "Seattle", "region": "Washington", "country": "United States", "lat": 47.6062, "lon": -122.3321},
{"id": 717, "name": "Washington D.C.", "region": "District of Columbia", "country": "United States", "lat": 38.9072, "lon": -77.0369},
{"id": 718, "name": "Achar", "region": "Tacuarembó", "country": "Uruguay", "lat": -31.7, "lon": -55.9833},
{"id": 719, "name": "Aguas Corrientes", "region": "Canelones", "country": "Uruguay", "lat": -34.5167, "lon": -56.4},
{"id": 720, "name": "Aigua", "region": "Maldonado", "country": "Uruguay", "lat": -34.2, "lon": -54.75},
{"id": 721, "name": "Artigas", "region": "Artigas", "country": "Uruguay", "lat": -30.4, "lon": -56.4667},
{"id": 722, "name": "Baltasar Brum", "region": "Artigas", "country": "Uruguay", "lat": -30.7167, "lon": -57.3167},
{"id": 723, "name": "Canelones", "region": "Canelones", "country": "Uruguay", "lat": -34.5228, "lon": -56.2778},
{"id": 724, "name": "Cardona", "region": "Soriano", "country": "Uruguay", "lat": -33.8833, "lon": -57.3833},
{"id": 725, "name": "Carmelo", "region": "Colonia", "country": "Uruguay", "lat": -34.0, "lon": -58.2833},
{"id": 726, "name": "Castillos", "region": "Rocha", "country": "Uruguay", "lat": -34.1667, "lon": -53.8333},
{"id": 727, "name": "Cebollatí", "region": "Rocha", "country": "Uruguay", "lat": -33.2667, "lon": -53.7833},
{"id": 728, "name": "Cerro Chato", "region": "Treinta y Tres", "country": "Uruguay", "lat": -33.4, "lon": -54.5667},
{"id": 729, "name": "Cerro Colorado", "region": "Florida", "country": "Uruguay", "lat": -33.8667, "lon": -55.55},
{"id": 730, "name": "Cerro Pelado", "region": "Artigas", "country": "Uruguay", "lat": -30.6, "lon": -57.2667},
{"id": 731, "name": "Chamangá", "region": "Flores", "country": "Uruguay", "lat": -33.55, "lon": -56.9167},
{"id": 732, "name": "Colonia del Sacramento", "region": "Colonia", "country": "Uruguay", "lat": -34.4717, "lon": -57.8442},
{"id": 733, "name": "Curtina", "region": "Tacuarembó", "country": "Uruguay", "lat": -32.15, "lon": -56.1167},
{"id": 734, "name": "Durazno", "region": "Durazno", "country": "Uruguay", "lat": -33.3811, "lon": -56.5292},
{"id": 735, "name": "Empalme Olmos", "region": "Canelones", "country": "Uruguay", "lat": -34.7, "lon": -55.9},
{"id": 736, "name": "Florida", "region": "Florida", "country": "Uruguay", "lat": -34.1, "lon": -56.2167},
{"id": 737, "name": "Fraile Muerto", "region": "Cerro Largo", "country": "Uruguay", "lat": -32.4833, "lon": -54.5333},
{"id": 738, "name": "Fray Bentos", "region": "Río Negro", "country": "Uruguay", "lat": -33.1333, "lon": -58.3},
{"id": 739, "name": "Ismael Cortinas", "region": "Flores", "country": "Uruguay", "lat": -33.9833, "lon": -56.4833},
{"id": 740, "name": "José Enrique Rodó", "region": "Soriano", "country": "Uruguay", "lat": -33.6833, "lon": -57.5667},
{"id": 741, "name": "José Pedro Varela", "region": "Lavalleja", "country": "Uruguay", "lat": -33.45, "lon": -54.5333},
{"id": 742, "name": "La Paloma", "region": "Rocha", "country": "Uruguay", "lat": -34.6667, "lon": -54.1667},
{"id": 743, "name": "Lascano", "region": "Rocha", "country": "Uruguay", "lat": -33.6667, "lon": -54.2},
{"id": 744, "name": "Mariscala", "region": "Lavalleja", "country": "Uruguay", "lat": -34.05, "lon": -54.7833},
{"id": 745, "name": "Melo", "region": "Cerro Largo", "country": "Uruguay", "lat": -32.3667, "lon": -54.1833},
{"id": 746, "name": "Mercedes", "region": "Soriano", "country": "Uruguay", "lat": -33.2558, "lon": -58.0192},
{"id": 747, "name": "Merinos", "region": "Salto", "country": "Uruguay", "lat": -31.25, "lon": -56.8333},
{"id": 748, "name": "Migues", "region": "Canelones", "country": "Uruguay", "lat": -34.4833, "lon": -55.65},
{"id": 749, "name": "Minas", "region": "Lavalleja", "country": "Uruguay", "lat": -34.3667, "lon": -55.2333},
{"id": 750, "name": "Montevideo", "region": "Montevideo", "country": "Uruguay", "lat": -34.9, "lon": -56.19},
{"id": 751, "name": "Nico Pérez", "region": "Lavalleja", "country": "Uruguay", "lat": -32.8, "lon": -54.7667},
{"id": 752, "name": "Nueva Helvecia", "region": "Colonia", "country": "Uruguay", "lat": -34.3, "lon": -57.2333},
{"id": 753, "name": "Ombúes de Lavalle", "region": "Colonia", "country": "Uruguay", "lat": -33.9167, "lon": -57.8},
{"id": 754, "name": "Palmitas", "region": "Soriano", "country": "Uruguay", "lat": -33.5, "lon": -57.8},
{"id": 755, "name": "Pan de Azúcar", "region": "Maldonado", "country": "Uruguay", "lat": -34.8, "lon": -55.2333},
{"id": 756, "name": "Paso de los Mellizos", "region": "Salto", "country": "Uruguay", "lat": -31.3, "lon": -57.0},
{"id": 757, "name": "Paso de los Toros", "region": "Tacuarembó", "country": "Uruguay", "lat": -32.8167, "lon": -56.5167},
{"id": 758, "name": "Paysandú", "region": "Paysandú", "country": "Uruguay", "lat": -32.3214, "lon": -58.0756},
{"id": 759, "name": "Piedras Coloradas", "region": "Paysandú", "country": "Uruguay", "lat": -32.3833, "lon": -57.6},
{"id": 760, "name": "Piriápolis", "region": "Maldonado", "country": "Uruguay", "lat": -34.8628, "lon": -55.2747},
{"id": 761, "name": "Progreso", "region": "Canelones", "country": "Uruguay", "lat": -34.6667, "lon": -56.2167},
{"id": 762, "name": "Pueblo Belén", "region": "Salto", "country": "Uruguay", "lat": -31.25, "lon": -57.7833},
{"id": 763, "name": "Pueblo Centenario", "region": "Soriano", "country": "Uruguay", "lat": -33.7167, "lon": -57.9667},
{"id": 764, "name": "Pueblo Esperanza", "region": "Salto", "country": "Uruguay", "lat": -31.4333, "lon": -57.8667},
{"id": 765, "name": "Pueblo Farrapos", "region": "Río Negro", "country": "Uruguay", "lat": -32.8167, "lon": -57.9},
{"id": 766, "name": "Pueblo Fernández", "region": "Río Negro", "country": "Uruguay", "lat": -32.7167, "lon": -57.5667},
{"id": 767, "name": "Pueblo Grecco", "region": "Rocha", "country": "Uruguay", "lat": -34.0167, "lon": -53.55},
{"id": 768, "name": "Pueblo Illescas", "region": "Cerro Largo", "country": "Uruguay", "lat": -32.1, "lon": -53.75},
{"id": 769, "name": "Pueblo Ituzaingó", "region": "Salto", "country": "Uruguay", "lat": -31.25, "lon": -57.8333},
{"id": 770, "name": "Pueblo Juan José Castro", "region": "Paysandú", "country": "Uruguay", "lat": -32.0667, "lon": -57.1667},
{"id": 771, "name": "Pueblo La Paz", "region": "Canelones", "country": "Uruguay", "lat": -34.7667, "lon": -56.2167},
{"id": 772, "name": "Pueblo La Pedrera", "region": "Rocha", "country": "Uruguay", "lat": -34.3667, "lon": -53.8833},
{"id": 773, "name": "Pueblo Lapido", "region": "Canelones", "country": "Uruguay", "lat": -34.5667, "lon": -55.8833},
{"id": 774, "name": "Pueblo Lares", "region": "Tacuarembó", "country": "Uruguay", "lat": -32.0667, "lon": -55.6167},
{"id": 775, "name": "Pueblo Menafra", "region": "Salto", "country": "Uruguay", "lat": -31.3167, "lon": -56.6167},
{"id": 776, "name": "Pueblo Muñoz", "region": "San José", "country": "Uruguay", "lat": -34.05, "lon": -56.6167},
{"id": 777, "name": "Pueblo Olimar", "region": "Treinta y Tres", "country": "Uruguay", "lat": -33.25, "lon": -54.4167},
{"id": 778, "name": "Pueblo Olivera", "region": "Florida", "country": "Uruguay", "lat": -34.2833, "lon": -56.3},
{"id": 779, "name": "Pueblo Pajas Blancas", "region": "Montevideo", "country": "Uruguay", "lat": -34.7667, "lon": -56.3333},
{"id": 780, "name": "Pueblo Palomas", "region": "Soriano", "country": "Uruguay", "lat": -33.5, "lon": -57.8667},
{"id": 781, "name": "Pueblo Quintana", "region": "San José", "country": "Uruguay", "lat": -34.3167, "lon": -56.7},
{"id": 782, "name": "Pueblo Reboledo", "region": "Durazno", "country": "Uruguay", "lat": -33.05, "lon": -55.9833},
{"id": 783, "name": "Pueblo Risso", "region": "Colonia", "country": "Uruguay", "lat": -34.2833, "lon": -57.55},
{"id": 784, "name": "Pueblo Rivas", "region": "Durazno", "country": "Uruguay", "lat": -33.25, "lon": -56.0333},
{"id": 785, "name": "Pueblo San Cono", "region": "Florida", "country": "Uruguay", "lat": -34.0, "lon": -55.3167},
{"id": 786, "name": "Pueblo San Félix", "region": "Soriano", "country": "Uruguay", "lat": -33.5333, "lon": -58.15},
{"id": 787, "name": "Pueblo San Jorge", "region": "Salto", "country": "Uruguay", "lat": -31.7667, "lon": -57.5},
{"id": 788, "name": "Pueblo San Mauricio", "region": "Lavalleja", "country": "Uruguay", "lat": -34.2, "lon": -55.2833},
{"id": 789, "name": "Pueblo Santa Rosa", "region": "Canelones", "country": "Uruguay", "lat": -34.5, "lon": -55.9},
{"id": 790, "name": "Pueblo Valentines", "region": "Rivera", "country": "Uruguay", "lat": -31.4, "lon": -55.4667},
{"id": 791, "name": "Pueblo Velázquez", "region": "Rocha", "country": "Uruguay", "lat": -33.9833, "lon": -54.0167},
{"id": 792, "name": "Pueblo de las Piedras", "region": "Canelones", "country": "Uruguay", "lat": -34.7264, "lon": -56.22},
{"id": 793, "name": "Punta del Este", "region": "Maldonado", "country": "Uruguay", "lat": -34.9608, "lon": -54.9426},
{"id": 794, "name": "Rivera", "region": "Rivera", "country": "Uruguay", "lat": -30.9025, "lon": -55.5506},
{"id": 795, "name": "Rocha", "region": "Rocha", "country": "Uruguay", "lat": -34.4833, "lon": -54.3333},
{"id": 796, "name": "Rodríguez", "region": "San José", "country": "Uruguay", "lat": -34.3833, "lon": -56.5333},
{"id": 797, "name": "Rosario", "region": "Colonia", "country": "Uruguay", "lat": -34.3167, "lon": -57.35},
{"id": 798, "name": "Salto", "region": "Salto", "country": "Uruguay", "lat": -31.3833, "lon": -57.9667},
{"id": 799, "name": "San Bautista", "region": "Canelones", "country": "Uruguay", "lat": -34.4333, "lon": -55.9833},
{"id": 800, "name": "San Carlos", "region": "Maldonado", "country": "Uruguay", "lat": -34.8, "lon": -54.9167},
{"id": 801, "name": "San Javier", "region": "Río Negro", "country": "Uruguay", "lat": -32.6833, "lon": -58.1333},
{"id": 802, "name": "San José de Mayo", "region": "San José", "country": "Uruguay", "lat": -34.35, "lon": -56.7167},
{"id": 803, "name": "Santa Lucía", "region": "Canelones", "country": "Uruguay", "lat": -34.45, "lon": -56.4},
{"id": 804, "name": "Sarandí del Yí", "region": "Durazno", "country": "Uruguay", "lat": -33.35, "lon": -55.6333},
{"id": 805, "name": "Soca", "region": "Canelones", "country": "Uruguay", "lat": -34.6833, "lon": -55.7},
{"id": 806, "name": "Solís de Mataojo", "region": "Lavalleja", "country": "Uruguay", "lat": -34.6, "lon": -55.4833},
{"id": 807, "name": "Tacuarembó", "region": "Tacuarembó", "country": "Uruguay", "lat": -31.7333, "lon": -55.9833},
{"id": 808, "name": "Tala", "region": "Canelones", "country": "Uruguay", "lat": -34.35, "lon": -55.7667},
{"id": 809, "name": "Tambores", "region": "Tacuarembó", "country": "Uruguay", "lat": -32.2, "lon": -56.2167},
{"id": 810, "name": "Tarariras", "region": "Colonia", "country": "Uruguay", "lat": -34.2833, "lon": -57.6167},
{"id": 811, "name": "Tomás Gomensoro", "region": "Artigas", "country": "Uruguay", "lat": -30.4333, "lon": -57.4333},
{"id": 812, "name": "Tranqueras", "region": "Rivera", "country": "Uruguay", "lat": -31.2, "lon": -55.75},
{"id": 813, "name": "Treinta y Tres", "region": "Treinta y Tres", "country": "Uruguay", "lat": -33.2333, "lon": -54.3833},
{"id": 814, "name": "Trinidad", "region": "Flores", "country": "Uruguay", "lat": -33.5167, "lon": -56.9},
{"id": 815, "name": "Veinticinco de Mayo", "region": "Florida", "country": "Uruguay", "lat": -34.1892, "lon": -56.3394},
{"id": 816, "name": "Vergara", "region": "Treinta y Tres", "country": "Uruguay", "lat": -32.9333, "lon": -53.95},
{"id": 817, "name": "Villa Soriano", "region": "Soriano", "country": "Uruguay", "lat": -33.4, "lon": -58.3167},
{"id": 818, "name": "Villa del Carmen", "region": "Durazno", "country": "Uruguay", "lat": -33.25, "lon": -56.0167},
{"id": 819, "name": "Bukhara", "region": "Bukhara Region", "country": "Uzbekistan", "lat": 39.7681, "lon": 64.4556},
{"id": 820, "name": "Samarkand", "region": "Samarkand Region", "country": "Uzbekistan", "lat": 39.627, "lon": 66.975},
{"id": 821, "name": "Tashkent", "region": "Tashkent", "country": "Uzbekistan", "lat": 41.2995, "lon": 69.2401},
{"id": 822, "name": "Port Vila", "region": "Shefa", "country": "Vanuatu", "lat": -17.7333, "lon": 168.3273},
{"id": 823, "name": "Vatican City", "region": "Vatican City", "country": "Vatican City", "lat": 41.9029, "lon": 12.4534},
{"id": 824, "name": "Acarigua", "region": "Portuguesa", "country": "Venezuela", "lat": 9.5597, "lon": -69.2019},
{"id": 825, "name": "Barcelona", "region": "Anzoátegui", "country": "Venezuela", "lat": 10.1333, "lon": -64.6833},
{"id": 826, "name": "Barquisimeto", "region": "Lara", "country": "Venezuela", "lat": 10.0678, "lon": -69.3467},
{"id": 827, "name": "Cabimas", "region": "Zulia", "country": "Venezuela", "lat": 10.4, "lon": -71.45},
{"id": 828, "name": "Caracas", "region": "Capital District", "country": "Venezuela", "lat": 10.49, "lon": -66.88},
{"id": 829, "name": "Carúpano", "region": "Sucre", "country": "Venezuela", "lat": 10.6722, "lon": -63.24},
{"id": 830, "name": "Ciudad Bolívar", "region": "Bolívar", "country": "Venezuela", "lat": 8.1167, "lon": -63.55},
{"id": 831, "name": "Ciudad Guayana", "region": "Bolívar", "country": "Venezuela", "lat": 8.3, "lon": -62.7167},
{"id": 832, "name": "Ciudad Ojeda", "region": "Zulia", "country": "Venezuela", "lat": 10.2, "lon": -71.3167},
{"id": 833, "name": "Coro", "region": "Falcón", "country": "Venezuela", "lat": 11.395, "lon": -69.6817},
{"id": 834, "name": "Cumaná", "region": "Sucre", "country": "Venezuela", "lat": 10.45, "lon": -64.1667},
{"id": 835, "name": "El Tigre", "region": "Anzoátegui", "country": "Venezuela", "lat": 8.8858, "lon": -64.2611},
{"id": 836, "name": "Guanare", "region": "Portuguesa", "country": "Venezuela", "lat": 9.05, "lon": -69.75},
{"id": 837, "name": "La Asunción", "region": "Nueva Esparta", "country": "Venezuela", "lat": 11.0333, "lon": -63.8628},
{"id": 838, "name": "Los Teques", "region": "Miranda", "country": "Venezuela", "lat": 10.3333, "lon": -67.0333},
{"id": 839, "name": "Maracaibo", "region": "Zulia", "country": "Venezuela", "lat": 10.6427, "lon": -71.6125},
{"id": 840, "name": "Maturín", "region": "Monagas", "country": "Venezuela", "lat": 9.7457, "lon": -63.1832},
{"id": 841, "name": "Mérida", "region": "Mérida", "country": "Venezuela", "lat": 8.5833, "lon": -71.1333},
{"id": 842, "name": "Porlamar", "region": "Nueva Esparta", "country": "Venezuela", "lat": 10.95, "lon": -63.85},
{"id": 843, "name": "Puerto Ayacucho", "region": "Amazonas", "country": "Venezuela", "lat": 5.6631, "lon": -67.6264},
{"id": 844, "name": "Puerto La Cruz", "region": "Anzoátegui", "country": "Venezuela", "lat": 10.2167, "lon": -64.6167},
{"id": 845, "name": "Punto Fijo", "region": "Falcón", "country": "Venezuela", "lat": 11.7167, "lon": -70.1833},
{"id": 846, "name": "San Cristóbal", "region": "Táchira", "country": "Venezuela", "lat": 7.7667, "lon": -72.2333},
{"id": 847, "name": "San Fernando de Apure", "region": "Apure", "country": "Venezuela", "lat": 7.9, "lon": -67.4667},
{"id": 848, "name": "Trujillo", "region": "Trujillo", "country": "Venezuela", "lat": 9.3667, "lon": -70.4333},
{"id": 849, "name": "Tucupita", "region": "Delta Amacuro", "country": "Venezuela", "lat": 9.0578, "lon": -62.0467},
{"id": 850, "name": "Valencia", "region": "Carabobo", "country": "Venezuela", "lat": 10.1667, "lon": -68.0},
{"id": 851, "name": "Valera", "region": "Trujillo", "country": "Venezuela", "lat": 9.3167, "lon": -70.6},
{"id": 852, "name": "Da Nang", "region": "Da Nang", "country": "Vietnam", "lat": 16.0544, "lon": 108.2022},
{"id": 853, "name": "Hanoi", "region": "Hanoi", "country": "Vietnam", "lat": 21.03, "lon": 105.85},
{"id": 854, "name": "Ho Chi Minh City", "region": "Ho Chi Minh City", "country": "Vietnam", "lat": 10.82, "lon": 106.63},
{"id": 855, "name": "Hoi An", "region": "Quang Nam", "country": "Vietnam", "lat": 15.8801, "lon": 108.338},
{"id": 856, "name": "Hue", "region": "Thua Thien Hue", "country": "Vietnam", "lat": 16.4637, "lon": 107.5908},
{"id": 857, "name": "Aden", "region": "Aden", "country": "Yemen", "lat": 12.7855, "lon": 45.0187},
{"id": 858, "name": "Sana\"a", "region": "Sana\"a", "country": "Yemen", "lat": 15.3694, "lon": 44.191},
{"id": 859, "name": "Kitwe", "region": "Copperbelt", "country": "Zambia", "lat": -12.8167, "lon": 28.2},
{"id": 860, "name": "Livingstone", "region": "Southern", "country": "Zambia", "lat": -17.8531, "lon": 25.861},
{"id": 861, "name": "Lusaka", "region": "Lusaka", "country": "Zambia", "lat": -15.3875, "lon": 28.3228},
{"id": 862, "name": "Ndola", "region": "Copperbelt", "country": "Zambia", "lat": -12.9667, "lon": 28.6333},
{"id": 863, "name": "Bulawayo", "region": "Bulawayo", "country": "Zimbabwe", "lat": -20.15, "lon": 28.5833},
{"id": 864, "name": "Gweru", "region": "Midlands", "country": "Zimbabwe", "lat": -19.45, "lon": 29.8167},
{"id": 865, "name": "Harare", "region": "Harare", "country": "Zimbabwe", "lat": -17.8252, "lon": 31.0335},
{"id": 866, "name": "Mutare", "region": "Manicaland", "country": "Zimbabwe", "lat": -18.9667, "lon": 32.6333},
{"id": 867, "name": "Victoria Falls", "region": "Matabeleland North", "country": "Zimbabwe", "lat": -17.9312, "lon": 25.8307}

];


const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

const SearchableLocationSelector: React.FC<{
  locations: Location[];
  selectedLocation: Location | null;
  onSelect: (location: Location) => void;
}> = ({ locations, selectedLocation, onSelect }) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Location[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFiltered([]);
      return;
    }
    const q = query.toLowerCase();
    const results = locations.filter(
      loc =>
        loc.name.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q) ||
        loc.country.toLowerCase().includes(q)
    );
    setFiltered(results);
  }, [query, locations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelect = (loc: Location) => {
    onSelect(loc);
    setQuery(loc.name);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="w-full max-w-md relative mx-auto mb-6">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Busca ciudad, región o país"
        className="w-full p-2 border rounded-lg text-lg"
        aria-label="Buscar ubicación"
        autoComplete="off"
      />
      {showSuggestions && filtered.length > 0 && (
        <ul className="absolute z-10 w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded-b-lg shadow-md">
          {filtered.map(loc => (
            <li
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className="cursor-pointer px-4 py-2 hover:bg-blue-100"
              role="option"
              aria-selected={selectedLocation?.id === loc.id}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelect(loc);
                }
              }}
            >
              {loc.name}, {loc.region} ({loc.country})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const WeatherComponent: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [daily, setDaily] = useState<DailyForecast | null>(null);
  const [hourly, setHourly] = useState<HourlyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedLocation) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${OPEN_METEO_URL}?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,windspeed_10m,precipitation,shortwave_radiation,cloudcover&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Europe/Madrid`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al cargar datos del clima.");
        const data = await res.json();

        setCurrent({
          temperature: data.current_weather.temperature,
          windspeed: data.current_weather.windspeed,
          winddirection: data.current_weather.winddirection,
          weathercode: data.current_weather.weathercode,
          time: data.current_weather.time,
          relativehumidity: data.hourly.relative_humidity_2m[0],
          pressure: data.hourly.pressure_msl ? data.hourly.pressure_msl[0] : 0,
        });

        setDaily({
          time: data.daily.time,
          weathercode: data.daily.weathercode,
          temperature_2m_max: data.daily.temperature_2m_max,
          temperature_2m_min: data.daily.temperature_2m_min,
          precipitation_sum: data.daily.precipitation_sum,
        });

        setHourly({
          time: data.hourly.time,
          temperature_2m: data.hourly.temperature_2m,
          relative_humidity_2m: data.hourly.relative_humidity_2m,
          windspeed_10m: data.hourly.windspeed_10m,
          precipitation: data.hourly.precipitation,
          shortwave_radiation: data.hourly.shortwave_radiation,
          cloudcover: data.hourly.cloudcover,
        });
      } catch (err) {
        console.error(err);
        setError("Ocurrió un error obteniendo el clima.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedLocation]);

  return (
    <div className="max-w-2xl mx-auto p-4 font-sans space-y-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">
        Clima por ciudad
      </h2>

      <SearchableLocationSelector
        locations={locations}
        selectedLocation={selectedLocation}
        onSelect={setSelectedLocation}
      />

      {loading && <div className="text-center text-gray-600 p-4">Cargando clima...</div>}
      {error && <div className="text-center text-red-500 p-4">{error}</div>}

      {current && (
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl shadow">
            <span className="text-gray-500">🕒 Fecha-Hora</span>
            <span className="font-semibold">F:.{current.time.replace("T", " H:.")}</span>
               </div>
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl shadow">
            <span className="text-gray-500">🌡 Temperatura</span>
            <span className="font-semibold">{current.temperature} °C</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl shadow">
            <span className="text-gray-500">💨 Viento</span>
            <span className="font-semibold">{current.windspeed} km/h</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl shadow">
            <span className="text-gray-500">📍 Dirección del viento</span>
            <span className="font-semibold">{current.winddirection}°</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl shadow">
            <span className="text-gray-500">💧 Humedad</span>
            <span className="font-semibold">{current.relativehumidity}%</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl shadow">
            <span className="text-gray-500">🧭 Presión</span>
            <span className="font-semibold">{current.pressure} hPa</span>
          </div>
        </div>
      )}

      {daily && (
        <>
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Pronóstico diario</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-center border border-gray-300">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-2 px-4 border">Fecha</th>
                  <th className="py-2 px-4 border">Codigo de clima</th>
                  <th className="py-2 px-4 border">Mín</th>
                  <th className="py-2 px-4 border">Máx</th>
                  <th className="py-2 px-4 border">Precipitación</th>
                </tr>
              </thead>
              <tbody>
                {daily.time.map((t, i) => (
                  <tr key={t} className="odd:bg-white even:bg-gray-50">
                    <td className="py-2 px-4 border">{t}</td>
                    <td className="py-2 px-4 border">{daily.weathercode[i]}</td>
                    <td className="py-2 px-4 border">{daily.temperature_2m_min[i]}°C</td>
                    <td className="py-2 px-4 border">{daily.temperature_2m_max[i]}°C</td>
                    <td className="py-2 px-4 border">{daily.precipitation_sum[i]} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {hourly && (
        <>
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Datos horarios</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {hourly.time.slice(0, 12).map((t, i) => (
              <li key={t} className="flex flex-col md:flex-row justify-between p-3 bg-gray-100 rounded-lg shadow">
                <span className="font-semibold">{t.slice(11)}</span>
                <span className="text-gray-600">Temp: {hourly.temperature_2m[i]}°C</span>
                <span className="text-gray-600">Humedad: {hourly.relative_humidity_2m[i]}%</span>
                <span className="text-gray-600">Viento: {hourly.windspeed_10m[i]} km/h</span>
                <span className="text-gray-600">Lluvia: {hourly.precipitation[i]} mm</span>
                <span className="text-gray-600">Radiación: {hourly.shortwave_radiation[i]} W/m²</span>
                <span className="text-gray-600">Nubes: {hourly.cloudcover[i]}%</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p><strong>Datos actuales:</strong> Temperatura a 2 m, Velocidad del viento a 10 m, Humedad relativa a 2 m, Presión atmosférica, Dirección del viento.</p>
        <p><strong>Datos horarios:</strong> Temperatura a 2 m, Humedad relativa a 2 m, Velocidad del viento a 10 m, Precipitación acumulada, Radiación solar, Cobertura de nubes.</p>
        <p className="text-center mt-4">Datos proporcionados por <a href="https://open-meteo.com/" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">open-meteo.com</a></p>
      </div>
    </div>
  );
};

export default WeatherComponent;