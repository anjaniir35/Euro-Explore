import { useState } from "react";
import "./App.css";

const flashcards = [

  {
  question: "What is the capital of the United Kingdom?",
  answer: "London",
  image:
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  },

  {
  question: "What is the capital of France?",
  answer: "Paris",
  image:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },

  {
  question: "What is the capital of the Netherlands?",
  answer: "Amsterdam",
  image:
    "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80",
  },

  {
  question: "What is the capital of Germany?",
  answer: "Berlin",
  image:
    "https://goway-cms-files.s3.ca-central-1.amazonaws.com/production/wordpress_images/Aerial-view-of-Marienplatz-Town-Hall-and-Frauenkirche-in-Munich-Germany-_348837170.jpg",
  },

  {
  question: "What is the capital of Switzerland?",
  answer: "Bern",
  image:
    "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80",
  },

  {
  question: "What is the capital of Italy?",
  answer: "Rome",
  image:
    "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=800&q=80",
  },

  {
  question: "What is the capital of Spain?",
  answer: "Madrid",
  image:
    "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80",
  },

  {
  question: "What is the capital of Austria?",
  answer: "Vienna",
  image:
    "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80",
  },

  {
  question: "What is the capital of Belgium?",
  answer: "Brussels",
  image:
    "https://images.locationscout.net/2024/04/aerial-view-of-grand-place-brussels-belgium-8civ.webp?h=1400&q=80",
  },

  {
  question: "What is the capital of Portugal?",
  answer: "Lisbon",
  image:
    "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80",
  },
];

function Flashcard({ question, answer, image, flipped, onClick }) {
  return (
    <div className={`card ${flipped ? "flipped" : ""}`} onClick={onClick}>
      <div className="card-inner">
        <div className="card-front">
          <img src={image} alt={answer} />
          <div className="card-content">
            <h2>{question}</h2>
          </div>
        </div>

        <div className="card-back">
          <img src={image} alt={answer} />
          <div className="card-content">
            <h2>{answer}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const nextCard = () => {
    let randomCard = Math.floor(Math.random() * flashcards.length);

    while (randomCard === currentCard) {
      randomCard = Math.floor(Math.random() * flashcards.length);
    }

    setCurrentCard(randomCard);
    setFlipped(false);
  };

  return (
    <div className="app">
      <header>
        <h1>Western Europe Capital Cities</h1>
        <p>Test your knowledge of the capital cities of Western Europe!</p>
        <p>Total Cards: {flashcards.length}</p>
      </header>

      <main className="card-grid">
        <Flashcard
          question={flashcards[currentCard].question}
          answer={flashcards[currentCard].answer}
          image={flashcards[currentCard].image}
          flipped={flipped}
          onClick={() => setFlipped(!flipped)}
        />

        <button onClick={nextCard}>Next Card</button>
      </main>
    </div>
  );
}

export default App;