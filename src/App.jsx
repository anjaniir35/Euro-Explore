import { useState } from "react";
import "./App.css";

const cities = [
  {
  name: "London",
  country: "United Kingdom",
  region: "Northern Europe",
  image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  },

  {
  name: "Paris",
  country: "France",
  region: "Western Europe",
  image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },

  {
  name: "Amsterdam",
  country: "Netherlands",
  region: "Western Europe",
  image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80"
  },

  
  {
  name: "Berlin",
  country: "Germany",
  region: "Western Europe",
  image: "https://goway-cms-files.s3.ca-central-1.amazonaws.com/production/wordpress_images/Aerial-view-of-Marienplatz-Town-Hall-and-Frauenkirche-in-Munich-Germany-_348837170.jpg",
  },

  {
  name: "Bern",
  country: "Switzerland",
  region: "Western Europe",
  image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80",
  },

  {
  name: "Rome",
  country: "Italy",
  region: "Southern Europe",
  image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=800&q=80",
  },

  {
  name: "Madrid",
  country: "Spain",
  region: "Southern Europe",
  image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80",
  },

  {
  name: "Vienna",
  country: "Austria",
  region: "Western Europe",
  image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80",
  },

  {
  name: "Brussels",
  country: "Belgium",
  region: "Western Europe",
  image: "https://images.locationscout.net/2024/04/aerial-view-of-grand-place-brussels-belgium-8civ.webp?h=1400&q=80",
  },

  {
  name: "Lisbon",
  country: "Portugal",
  region: "Southern Europe",
  image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80",
  }
];

function App() {
  const [currentCity, setCurrentCity] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const discoverCity = async () => {
    const availableCities = cities.filter(
      (city) =>
        !banList.includes(city.country) &&
        !banList.includes(city.region)
    );

    if (availableCities.length === 0) {
      setError("No cities match your current ban list. Remove a ban and try again.");
      return;
    }

    setLoading(true);
    setError("");

    const shuffled = [...availableCities].sort(
      () => Math.random() - 0.5
    );

    try {
      let foundCity = null;

      for (const city of shuffled) {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city.name)}`
        );

        if (!response.ok) continue;

        const data = await response.json();

        if (
          data.title &&
          data.description &&
          data.extract &&
          data.thumbnail?.source
        ) {
          foundCity = {
            ...city,
            apiName: data.title,
            description: data.description,
            summary: data.extract,
            apiImage: data.thumbnail.source,
          };
          break;
        }
      }

      if (!foundCity) {
        setError("Couldn't find a city with complete information. Please try again.");
        return;
      }

      setCurrentCity(foundCity);
      setHistory((previous) => [foundCity, ...previous]);
    } catch {
      setError("Couldn't load city information. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = (value) => {
    setBanList((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };

  return (
    <div className="app">
      <header>
        <h1>Western Europe Vacation Cities</h1>
        <p>Discover European destinations, one city at a time!</p>
      </header>

      <main className="card-grid">
        <section className="discover-section">
          <button onClick={discoverCity} disabled={loading}>
            {loading ? "Discovering..." : "Discover a City"}
          </button>

          {error && <p className="incorrect">{error}</p>}

          {currentCity && (
            <article className="city-card">
              <h2>{currentCity.apiName}</h2>

              <img
                src={currentCity.apiImage}
                alt={currentCity.apiName}
              />

              <p>
                <strong>Description:</strong>{" "}
                {currentCity.description}
              </p>

              <p>
                <strong>About:</strong> {currentCity.summary}
              </p>

              <p>
                <strong>Country:</strong>{" "}
                <button
                  className="attribute-button"
                  onClick={() => toggleBan(currentCity.country)}
                >
                  {currentCity.country}
                </button>
              </p>

              <p>
                <strong>Region:</strong>{" "}
                <button
                  className="attribute-button"
                  onClick={() => toggleBan(currentCity.region)}
                >
                  {currentCity.region}
                </button>
              </p>
            </article>
          )}
        </section>

        <aside className="ban-section">
          <h2>Ban List</h2>
          <p>Click a country or region to exclude it from future discoveries.</p>

          {banList.length === 0 ? (
            <p>No banned attributes yet.</p>
          ) : (
            banList.map((item) => (
              <button
                key={item}
                className="ban-item"
                onClick={() => toggleBan(item)}
              >
                {item} ✕
              </button>
            ))
          )}
        </aside>

        <section className="history-section">
          <h2>Previously Discovered</h2>

          {history.length === 0 ? (
            <p>Your discovered cities will appear here.</p>
          ) : (
            history.map((city, index) => (
              <p key={`${city.name}-${index}`}>{city.name}</p>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;