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
    { id: 51, name: 'Belgrade', region: 'Central Serbia', country: 'Serbia', lat: 44.82, lon: 20.46 },
    { id: 52, name: 'Sofia', region: 'Sofia City', country: 'Bulgaria', lat: 42.70, lon: 23.32 },
    { id: 53, name: 'Kiev', region: 'Kyiv City', country: 'Ukraine', lat: 50.45, lon: 30.52 },
    { id: 54, name: 'Vilnius', region: 'Vilnius County', country: 'Lithuania', lat: 54.69, lon: 25.28 },
    { id: 55, name: 'Riga', region: 'Riga', country: 'Latvia', lat: 56.95, lon: 24.11 },
    { id: 56, name: 'Tallinn', region: 'Harju County', country: 'Estonia', lat: 59.44, lon: 24.75 },
    { id: 57, name: 'Casablanca', region: 'Casablanca-Settat', country: 'Morocco', lat: 33.57, lon: -7.59 },
    { id: 58, name: 'Algiers', region: 'Algiers', country: 'Algeria', lat: 36.75, lon: 3.04 },
    { id: 59, name: 'Nairobi', region: 'Nairobi', country: 'Kenya', lat: -1.29, lon: 36.82 },
    { id: 60, name: 'Accra', region: 'Greater Accra', country: 'Ghana', lat: 5.60, lon: -0.19 },
    { id: 61, name: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia', lat: 9.03, lon: 38.74 },
    { id: 62, name: 'Santiago', region: 'Santiago Metropolitan', country: 'Chile', lat: -33.45, lon: -70.66 },
    { id: 63, name: 'Bogotá', region: 'Bogotá', country: 'Colombia', lat: 4.71, lon: -74.07 },
    { id: 64, name: 'Caracas', region: 'Capital District', country: 'Venezuela', lat: 10.49, lon: -66.88 },
    { id: 65, name: 'Quito', region: 'Pichincha', country: 'Ecuador', lat: -0.23, lon: -78.52 },
    { id: 66, name: 'Guatemala City', region: 'Guatemala', country: 'Guatemala', lat: 14.63, lon: -90.52 },
    { id: 67, name: 'San José', region: 'San José', country: 'Costa Rica', lat: 9.93, lon: -84.08 },
    { id: 68, name: 'Panama City', region: 'Panamá', country: 'Panama', lat: 8.98, lon: -79.52 },
    { id: 69, name: 'Havana', region: 'Havana', country: 'Cuba', lat: 23.13, lon: -82.38 },
    { id: 70, name: 'Manila', region: 'Metro Manila', country: 'Philippines', lat: 14.60, lon: 120.98 },
    { id: 71, name: 'Taipei', region: 'Taipei City', country: 'Taiwan', lat: 25.03, lon: 121.56 },
    { id: 72, name: 'Ho Chi Minh City', region: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.82, lon: 106.63 },
    { id: 73, name: 'Baghdad', region: 'Baghdad', country: 'Iraq', lat: 33.32, lon: 44.36 },
    { id: 74, name: 'Damascus', region: 'Damascus', country: 'Syria', lat: 33.51, lon: 36.29 },
    { id: 75, name: 'Doha', region: 'Doha', country: 'Qatar', lat: 25.29, lon: 51.53 },
    { id: 76, name: 'Ankara', region: 'Ankara', country: 'Turkey', lat: 39.92, lon: 32.85 },
    { id: 77, name: 'Brasilia', region: 'Federal District', country: 'Brazil', lat: -15.79, lon: -47.88 },
    { id: 78, name: 'Montevideo', region: 'Montevideo', country: 'Uruguay', lat: -34.90, lon: -56.19 },
    { id: 79, name: 'Edinburgh', region: 'Scotland', country: 'United Kingdom', lat: 55.95, lon: -3.19 },
    { id: 80, name: 'Glasgow', region: 'Scotland', country: 'United Kingdom', lat: 55.86, lon: -4.25 },
    { id: 81, name: 'Manchester', region: 'England', country: 'United Kingdom', lat: 53.48, lon: -2.24 },
    { id: 82, name: 'Birmingham', region: 'England', country: 'United Kingdom', lat: 52.48, lon: -1.89 },
    { id: 83, name: 'Lyon', region: 'Auvergne-Rhône-Alpes', country: 'France', lat: 45.76, lon: 4.83 },
    { id: 84, name: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', country: 'France', lat: 43.30, lon: 5.38 },
    { id: 85, name: 'Naples', region: 'Campania', country: 'Italy', lat: 40.85, lon: 14.25 },
    { id: 86, name: 'Milan', region: 'Lombardy', country: 'Italy', lat: 45.46, lon: 9.19 },
    { id: 87, name: 'St. Petersburg', region: 'Saint Petersburg', country: 'Russia', lat: 59.93, lon: 30.36 },
    { id: 88, name: 'Novosibirsk', region: 'Novosibirsk Oblast', country: 'Russia', lat: 55.04, lon: 82.94 },
    { id: 89, name: 'Chengdu', region: 'Sichuan', country: 'China', lat: 30.67, lon: 104.07 },
    { id: 90, name: 'Shenzhen', region: 'Guangdong', country: 'China', lat: 22.54, lon: 114.06 },
    { id: 91, name: 'Guangzhou', region: 'Guangdong', country: 'China', lat: 23.13, lon: 113.26 },
    { id: 92, name: 'Ahmedabad', region: 'Gujarat', country: 'India', lat: 23.03, lon: 72.58 },
    { id: 93, name: 'Bangalore', region: 'Karnataka', country: 'India', lat: 12.97, lon: 77.59 },
    { id: 94, name: 'Chennai', region: 'Tamil Nadu', country: 'India', lat: 13.08, lon: 80.27 },
    { id: 95, name: 'Hyderabad', region: 'Telangana', country: 'India', lat: 17.39, lon: 78.49 },
    { id: 96, name: 'Rio de Janeiro', region: 'Rio de Janeiro', country: 'Brazil', lat: -22.91, lon: -43.17 },
    { id: 97, name: 'Salvador', region: 'Bahia', country: 'Brazil', lat: -12.97, lon: -38.51 },
    { id: 98, name: 'Valencia', region: 'Valencian Community', country: 'Spain', lat: 39.47, lon: -0.38 },
    { id: 99, name: 'Seville', region: 'Andalusia', country: 'Spain', lat: 37.39, lon: -5.99 },
    { id: 100, name: 'Zaragoza', region: 'Aragon', country: 'Spain', lat: 41.65, lon: -0.89 },
    { id: 101, name: 'Bilbao', region: 'Basque Country', country: 'Spain', lat: 43.26, lon: -2.94 }
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
            <span className="text-gray-500">🕒 Hora</span>
            <span className="font-semibold">{current.time}</span>
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