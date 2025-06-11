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