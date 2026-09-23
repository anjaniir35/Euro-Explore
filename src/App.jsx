import "./App.css";

const destinations = [
  {
    city: "London",
    country: "United Kingdom",
    description: "Explore historic landmarks, museums, markets, and famous royal sites.",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Paris",
    country: "France",
    description: "Visit the Eiffel Tower, Louvre Museum, charming cafés, and beautiful gardens.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Amsterdam",
    country: "Netherlands",
    description: "Enjoy canals, museums, bike rides, and the colorful streets of the city.",
    image:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Munich",
    country: "Germany",
    description: "Experience Bavarian culture, historic buildings, parks, and local food.",
    image:
      "https://goway-cms-files.s3.ca-central-1.amazonaws.com/production/wordpress_images/Aerial-view-of-Marienplatz-Town-Hall-and-Frauenkirche-in-Munich-Germany-_348837170.jpg",
  },
  {
    city: "Geneva",
    country: "Switzerland",
    description: "Relax beside Lake Geneva and explore museums, parks, and the Old Town.",
    image:
      "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Rome",
    country: "Italy",
    description: "Discover ancient ruins, famous landmarks, Italian cuisine, and historic neighborhoods.",
    image:
      "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Madrid",
    country: "Spain",
    description: "Explore art museums, historic plazas, parks, and traditional Spanish cuisine.",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Vienna",
    country: "Austria",
    description: "Visit grand palaces, classical music venues, cafés, and beautiful city squares.",
    image:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Brussels",
    country: "Belgium",
    description: "See historic architecture, enjoy Belgian chocolate, and explore the Grand Place.",
    image:
      "https://images.locationscout.net/2024/04/aerial-view-of-grand-place-brussels-belgium-8civ.webp?h=1400&q=80",
  },
  {
    city: "Lisbon",
    country: "Portugal",
    description: "Ride historic trams, explore colorful neighborhoods, and enjoy views of the Atlantic.",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80",
  },
];

function DestinationCard({ city, country, description, image }) {
  return (
    <div className="card">
      <img src={image} alt={city} />

      <div className="card-content">
        <h2>{city}</h2>
        <h3>{country}</h3>
        <p>{description}</p>

        <button onClick={() => alert(`Explore vacation ideas for ${city}!`)}>
          Explore
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <header>
        <h1>Western Europe Vacation Guide</h1>
        <p>
          Discover some of the best cities to visit on your next European
          adventure!
        </p>
      </header>

      <main className="card-grid">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.city}
            city={destination.city}
            country={destination.country}
            description={destination.description}
            image={destination.image}
          />
        ))}
      </main>
    </div>
  );
}

export default App;