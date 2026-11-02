import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { supabase } from "./supabase";
import "./App.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80";

const getWikipediaUrl = (cityName) =>
  `https://en.wikipedia.org/wiki/${encodeURIComponent(cityName)}`;

async function addWikipediaInformation(cities) {
  return Promise.all(
    cities.map(async (city) => {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city.name)}`
        );

        if (!response.ok) throw new Error("Wikipedia unavailable");

        const data = await response.json();

        return {
          ...city,
          description: data.description || "",
          summary: data.extract || "",
          wikipediaUrl:
            data.content_urls?.desktop?.page || getWikipediaUrl(city.name),
        };
      } catch {
        return {
          ...city,
          description: "",
          summary: "",
          wikipediaUrl: getWikipediaUrl(city.name),
        };
      }
    })
  );
}

// SIDEBAR

function Sidebar({ cityData }) {
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

        <Link to="/add" className="sidebar-link">
          + Add a City
        </Link>

        <p className="sidebar-label">DESTINATIONS</p>

        {cityData.map((city) => (
          <Link
            key={city.id}
            to={`/cities/${city.id}`}
            className="sidebar-link"
          >
            {city.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

// MAIN LAYOUT

function AppLayout({ cityData, loading, error, refreshCities }) {
  return (
    <div className="app-layout">
      <Sidebar cityData={cityData} />

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
            path="/add"
            element={
              <CityForm
                title="Add a New City"
                refreshCities={refreshCities}
              />
            }
          />

          <Route
            path="/cities/:cityId"
            element={<CityDetail cityData={cityData} loading={loading} />}
          />

          <Route
            path="/cities/:cityId/edit"
            element={
              <EditCity
                cityData={cityData}
                loading={loading}
                refreshCities={refreshCities}
              />
            }
          />

          <Route
            path="*"
            element={
              <section className="detail-page page-content">
                <h1>Page Not Found</h1>
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

// DASHBOARD

function Dashboard({ cityData, loading, error }) {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");

  const regions = useMemo(
    () => [
      "All Regions",
      ...new Set(cityData.map((city) => city.region)),
    ],
    [cityData]
  );

  const filteredCities = cityData.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase());

    const matchesRegion =
      selectedRegion === "All Regions" ||
      city.region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  const totalCities = cityData.length;
  const totalCountries = new Set(cityData.map((city) => city.country)).size;
  const totalRegions = new Set(cityData.map((city) => city.region)).size;

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
        <div>
          <p className="eyebrow">YOUR EUROPEAN TRAVEL GUIDE</p>
          <h1>Western Europe Vacation Cities</h1>
          <p>
            Explore European destinations, discover interesting places, and
            find inspiration for your next vacation.
          </p>
        </div>

        <Link to="/add" className="primary-button">
          + Add a City
        </Link>
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
              European regions.
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
              Compare the number of words in each city's Wikipedia summary.
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

        {error && <p className="error-message">{error}</p>}

        {loading && <p>Loading European destinations...</p>}

        {!loading && (
          <>
            <p className="results-count">
              Showing {filteredCities.length} of {totalCities} cities
              <span> · Sorted newest first</span>
            </p>

            <div className="city-grid">
              {filteredCities.map((city) => (
                <Link
                  to={`/cities/${city.id}`}
                  className="city-card"
                  key={city.id}
                >
                  <img
                    className="city-card-image"
                    src={city.image || fallbackImage}
                    alt={city.name}
                  />

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
                No cities match your search. Try changing your filters.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

// ADD CITY FORM

function CityForm({ title, refreshCities, existingCity }) {
  const navigate = useNavigate();

  const [name, setName] = useState(existingCity?.name || "");
  const [country, setCountry] = useState(existingCity?.country || "");
  const [region, setRegion] = useState(existingCity?.region || "");
  const [image, setImage] = useState(existingCity?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const city = {
      name: name.trim(),
      country: country.trim(),
      region,
      image: image.trim() || fallbackImage,
    };

    let result;

    if (existingCity) {
      result = await supabase
        .from("cities")
        .update(city)
        .eq("id", existingCity.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("cities")
        .insert([city])
        .select()
        .single();
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    await refreshCities();
    navigate(`/cities/${result.data.id}`);
  }

  return (
    <div className="page-content">
      <Link
        to={existingCity ? `/cities/${existingCity.id}` : "/"}
        className="back-link"
      >
        ← Back
      </Link>

      <header className="page-header">
        <div>
          <p className="eyebrow">EUROEXPLORE DESTINATIONS</p>
          <h1>{title}</h1>
          <p className="page-subtitle">
            {existingCity
              ? "Update the information for this destination."
              : "Add a new European destination to your collection."}
          </p>
        </div>
      </header>

      <form className="city-form" onSubmit={handleSubmit}>
        <label htmlFor="city-name">City Name</label>
        <input
          id="city-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Prague"
          required
        />

        <label htmlFor="city-country">Country</label>
        <input
          id="city-country"
          type="text"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          placeholder="e.g. Czech Republic"
          required
        />

        <label htmlFor="city-region">European Region</label>
        <select
          id="city-region"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          required
        >
          <option value="">Select a region</option>
          <option value="Northern Europe">Northern Europe</option>
          <option value="Western Europe">Western Europe</option>
          <option value="Central Europe">Central Europe</option>
          <option value="Southern Europe">Southern Europe</option>
          <option value="Eastern Europe">Eastern Europe</option>
        </select>

        <label htmlFor="city-image">Image URL (optional)</label>
        <input
          id="city-image"
          type="url"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://example.com/city-image.jpg"
        />

        {error && <p className="error-message">{error}</p>}

        <button
          type="submit"
          className="primary-button form-submit"
          disabled={saving}
        >
          {saving ? "Saving..." : existingCity ? "Save Changes" : "Add City"}
        </button>
      </form>
    </div>
  );
}

// EDIT CITY PAGE

function EditCity({ cityData, loading, refreshCities }) {
  const { cityId } = useParams();
  const city = cityData.find((item) => String(item.id) === cityId);
  const navigate = useNavigate();

  async function deleteCity() {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${city.name}?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("cities")
      .delete()
      .eq("id", city.id);

    if (error) {
      alert(error.message);
      return;
    }

    await refreshCities();
    navigate("/");
  }

  if (loading && !city) return <p className="page-content">Loading...</p>;

  if (!city) {
    return (
      <div className="page-content">
        <h1>City Not Found</h1>
        <Link to="/" className="back-link">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="page-content">
      <CityForm
        title={`Edit ${city.name}`}
        existingCity={city}
        refreshCities={refreshCities}
      />

      <div className="delete-section">
        <h2>Delete Destination</h2>
        <p>This will permanently remove this city from your collection.</p>
        <button type="button" className="delete-button" onClick={deleteCity}>
          Delete {city.name}
        </button>
      </div>
    </div>
  );
}

// CITY DETAIL PAGE

function CityDetail({ cityData, loading }) {
  const { cityId } = useParams();
  const city = cityData.find((item) => String(item.id) === cityId);

  if (loading && !city) {
    return <section className="detail-page page-content">Loading city information...</section>;
  }

  if (!city) {
    return (
      <section className="detail-page page-content">
        <h1>City Not Found</h1>
        <p>We couldn't find that destination.</p>
        <Link to="/" className="back-link">← Back to Dashboard</Link>
      </section>
    );
  }

  const wordCount = city.summary
    ? city.summary.trim().split(/\s+/).length
    : 0;

  const relatedCities = cityData.filter(
    (item) => item.region === city.region && item.id !== city.id
  );

  return (
    <div className="detail-page page-content">
      <Link to="/" className="back-link">← Back to Dashboard</Link>

      <header className="detail-header">
        <p className="eyebrow">DESTINATION DETAILS</p>
        <h1>{city.name}</h1>
        <p>{city.country} · {city.region}</p>
      </header>

      <img
        className="detail-image"
        src={city.image || fallbackImage}
        alt={city.name}
      />

      <section className="detail-card">
        <h2>About {city.name}</h2>

        {city.description && <p>{city.description}</p>}

        <p>
          {city.summary ||
            "A Wikipedia summary for this destination is not currently available."}
        </p>

        <a
          href={city.wikipediaUrl || getWikipediaUrl(city.name)}
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

      <Link to={`/cities/${city.id}/edit`} className="primary-button">
        Edit Destination
      </Link>

      {relatedCities.length > 0 && (
        <section className="related-section">
          <h2>Explore More in {city.region}</h2>
          <p>Discover other destinations in the same region.</p>

          <div className="related-cities">
            {relatedCities.map((relatedCity) => (
              <Link
                to={`/cities/${relatedCity.id}`}
                className="related-city-link"
                key={relatedCity.id}
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

// MAIN APP AND SUPABASE DATA

function App() {
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshCities = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: databaseError } = await supabase
      .from("cities")
      .select("*")
      .order("created_at", { ascending: false });

    if (databaseError) {
      setError(databaseError.message);
      setLoading(false);
      return;
    }

    const citiesWithWikipedia = await addWikipediaInformation(data || []);

    setCityData(citiesWithWikipedia);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshCities();
  }, [refreshCities]);

  return (
    <BrowserRouter>
      <AppLayout
        cityData={cityData}
        loading={loading}
        error={error}
        refreshCities={refreshCities}
      />
    </BrowserRouter>
  );
}

export default App;
