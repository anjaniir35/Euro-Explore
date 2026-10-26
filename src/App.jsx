import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import "./App.css";

const cities = [
  {
    name: "London",
    country: "United Kingdom",
    region: "Northern Europe",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Paris",
    country: "France",
    region: "Western Europe",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    region: "Western Europe",
    image:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Berlin",
    country: "Germany",
    region: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Bern",
    country: "Switzerland",
    region: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Rome",
    country: "Italy",
    region: "Southern Europe",
    image:
      "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Madrid",
    country: "Spain",
    region: "Southern Europe",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Vienna",
    country: "Austria",
    region: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Brussels",
    country: "Belgium",
    region: "Western Europe",
    image:
      "https://media.traveler.es/photos/61377ff8bf63e581e01026f7/master/w_1024%2Cc_limit/23583.jpg",
  },
  {
    name: "Lisbon",
    country: "Portugal",
    region: "Southern Europe",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80",
  },
];

const regions = [
  "All Regions",
  ...new Set(cities.map((city) => city.region)),
];

function getWikipediaUrl(cityName) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(cityName)}`;
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>EuroExplore</h2>
        <p>Discover Europe</p>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className="sidebar-link">
          Dashboard
        </Link>

        <p className="sidebar-label">DESTINATIONS</p>

        {cities.map((city) => (
          <Link
            key={city.name}
            to={`/cities/${city.name.toLowerCase()}`}
            className="sidebar-link"
          >
            {city.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function AppLayout({ cityData, loading, error }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                cityData={cityData}
                loading={loading}
                error={error}
              />
            }
          />

          <Route
            path="/cities/:cityName"
            element={<CityDetail cityData={cityData} loading={loading} />}
          />

          <Route
            path="*"
            element={
              <section className="detail-page">
                <h1>Page Not Found</h1>
                <p>Sorry, that page doesn't exist.</p>
                <Link to="/" className="back-link">
                  Back to Dashboard
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function Dashboard({ cityData, loading, error }) {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");

  const filteredCities = useMemo(() => {
    return cityData.filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(search.toLowerCase()) ||
        city.country.toLowerCase().includes(search.toLowerCase());

      const matchesRegion =
        selectedRegion === "All Regions" ||
        city.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [cityData, search, selectedRegion]);

  const totalCities = cityData.length;
  const totalCountries = new Set(cityData.map((city) => city.country)).size;
  const totalRegions = new Set(cityData.map((city) => city.region)).size;

  // Count the destinations in each region.
  const regionCounts = regions
    .filter((region) => region !== "All Regions")
    .map((region) => ({
      name: region,
      count: cityData.filter((city) => city.region === region).length,
    }));

  const maxRegionCount = Math.max(
    ...regionCounts.map((region) => region.count),
    1
  );

  // Calculate word counts from the summaries fetched from Wikipedia.
  const summaryData = cityData
    .filter((city) => city.summary)
    .map((city) => ({
      name: city.name,
      wordCount: city.summary.trim().split(/\s+/).length,
    }));

  const maxWordCount = Math.max(
    ...summaryData.map((city) => city.wordCount),
    1
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <p className="eyebrow">YOUR EUROPEAN TRAVEL GUIDE</p>
        <h1>Western Europe Vacation Cities</h1>
        <p>
          Explore European destinations, discover interesting places, and
          find inspiration for your next vacation.
        </p>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <h2>Total Cities</h2>
          <p className="stat-number">{totalCities}</p>
          <p>Destinations to explore</p>
        </article>

        <article className="stat-card">
          <h2>Countries</h2>
          <p className="stat-number">{totalCountries}</p>
          <p>Different countries represented</p>
        </article>

        <article className="stat-card">
          <h2>European Regions</h2>
          <p className="stat-number">{totalRegions}</p>
          <p>Regions represented in the dataset</p>
        </article>
      </section>

      <section className="charts-section">
        <div className="section-heading">
          <h2>Explore the Data</h2>
          <p>Compare destinations and discover patterns across the dataset.</p>
        </div>

        <div className="charts-grid">
          <article className="chart-card">
            <h3>Cities by Region</h3>

            <p className="chart-description">
              Explore how the destinations are distributed across different
              European regions. This comparison highlights which regions have
              the most cities in this collection.
            </p>

            <div className="bar-chart">
              {regionCounts.map((region) => (
                <div className="bar-row" key={region.name}>
                  <span className="bar-label">{region.name}</span>

                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(region.count / maxRegionCount) * 100}%`,
                      }}
                    />
                  </div>

                  <span className="bar-value">{region.count}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="chart-card">
            <h3>Wikipedia Summary Length</h3>

            <p className="chart-description">
              Compare the number of words in each city's fetched Wikipedia
              summary. Longer summaries contain more text, but this does not
              necessarily mean a city has more attractions or is a better
              vacation destination.
            </p>

            {loading && <p>Loading summary data...</p>}

            {!loading && summaryData.length === 0 && (
              <p>Summary data is not available yet.</p>
            )}

            {!loading && summaryData.length > 0 && (
              <div className="bar-chart">
                {summaryData.map((city) => (
                  <div className="bar-row" key={city.name}>
                    <span className="bar-label">{city.name}</span>

                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(city.wordCount / maxWordCount) * 100}%`,
                        }}
                      />
                    </div>

                    <span className="bar-value">{city.wordCount}</span>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Explore Destinations</h2>
          <p>Search for a city or country, or filter destinations by region.</p>
        </div>

        <div className="filter-controls">
          <input
            type="text"
            placeholder="Search cities or countries..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search cities or countries"
          />

          <select
            value={selectedRegion}
            onChange={(event) => setSelectedRegion(event.target.value)}
            aria-label="Filter cities by region"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="reset-button"
            onClick={() => {
              setSearch("");
              setSelectedRegion("All Regions");
            }}
          >
            Reset Filters
          </button>
        </div>

        {loading && <p>Loading European destinations...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && (
          <>
            <p className="results-count">
              Showing {filteredCities.length} of {totalCities} cities
            </p>

            <div className="city-grid">
              {filteredCities.map((city) => (
                <Link
                  to={`/cities/${city.name.toLowerCase()}`}
                  className="city-card"
                  key={city.name}
                >
                  <img src={city.image} alt={city.name} />

                  <div className="city-card-content">
                    <h3>{city.name}</h3>
                    <p>{city.country}</p>

                    <span className="region-badge">{city.region}</span>

                    {city.description && (
                      <p className="city-description">{city.description}</p>
                    )}

                    <span className="card-link">View City Details →</span>
                  </div>
                </Link>
              ))}
            </div>

            {filteredCities.length === 0 && (
              <p className="empty-message">
                No cities match your search and selected region. Try changing
                your search or resetting the filters.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function CityDetail({ cityData, loading }) {
  const { cityName } = useParams();

  const city = cityData.find(
    (item) => item.name.toLowerCase() === cityName?.toLowerCase()
  );

  if (loading && !city) {
    return (
      <section className="detail-page">
        <p>Loading city information...</p>
      </section>
    );
  }

  if (!city) {
    return (
      <section className="detail-page">
        <h1>City Not Found</h1>
        <p>We couldn't find that destination.</p>
        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
      </section>
    );
  }

  const wordCount = city.summary
    ? city.summary.trim().split(/\s+/).length
    : 0;

  const relatedCities = cityData.filter(
    (item) => item.region === city.region && item.name !== city.name
  );

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <header className="detail-header">
        <p className="eyebrow">DESTINATION DETAILS</p>
        <h1>{city.name}</h1>
        <p>
          {city.country} · {city.region}
        </p>
      </header>

      <img className="detail-image" src={city.image} alt={city.name} />

      <section className="detail-card">
        <h2>About {city.name}</h2>

        {city.description && <p>{city.description}</p>}

        <p>
          {city.summary ||
            "A Wikipedia summary for this destination is not currently available."}
        </p>

        <a
          href={getWikipediaUrl(city.name)}
          target="_blank"
          rel="noreferrer"
          className="wikipedia-link"
        >
          Read more on Wikipedia ↗
        </a>
      </section>

      <section className="stats-grid detail-stats">
        <article className="stat-card">
          <h2>Country</h2>
          <p className="detail-stat-value">{city.country}</p>
        </article>

        <article className="stat-card">
          <h2>Region</h2>
          <p className="detail-stat-value">{city.region}</p>
        </article>

        <article className="stat-card">
          <h2>Summary Length</h2>
          <p className="stat-number">{wordCount}</p>
          <p>Words in the Wikipedia summary</p>
        </article>
      </section>

      {relatedCities.length > 0 && (
        <section className="related-section">
          <h2>Explore More in {city.region}</h2>
          <p>Discover other destinations in the same region.</p>

          <div className="related-cities">
            {relatedCities.map((relatedCity) => (
              <Link
                to={`/cities/${relatedCity.name.toLowerCase()}`}
                className="related-city-link"
                key={relatedCity.name}
              >
                {relatedCity.name} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function App() {
  const [cityData, setCityData] = useState(
    cities.map((city) => ({
      ...city,
      description: "",
      summary: "",
    }))
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchCityInformation() {
      setLoading(true);
      setError("");

      const results = await Promise.allSettled(
        cities.map(async (city) => {
          const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city.name)}`
          );

          if (!response.ok) {
            throw new Error(`Could not load ${city.name}`);
          }

          const data = await response.json();

          return {
            ...city,
            description: data.description || "",
            summary: data.extract || "",
            wikipediaUrl: data.content_urls?.desktop?.page || getWikipediaUrl(city.name),
          };
        })
      );

      if (cancelled) return;

      const fetchedCities = results.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value;
        }

        return {
          ...cities[index],
          description: "",
          summary: "",
          wikipediaUrl: getWikipediaUrl(cities[index].name),
        };
      });

      setCityData(fetchedCities);

      if (fetchedCities.every((city) => !city.summary)) {
        setError(
          "City information could not be loaded. Check your internet connection and refresh the page."
        );
      }

      setLoading(false);
    }

    fetchCityInformation();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <BrowserRouter>
      <AppLayout cityData={cityData} loading={loading} error={error} />
    </BrowserRouter>
  );
}

export default App;