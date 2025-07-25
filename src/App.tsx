import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/Card";
interface pokemonData {
  name: string;
  sprites: {
    front_default: string;
  };
}

function createCardData(data: pokemonData) {
  let name = data.name;
  let imgURL = data.sprites.front_default;

  if (name && imgURL) {
    return {
      name: name,
      imgURL: imgURL,
      clicked: false,
    };
  } else {
    console.log("error");
    return null;
  }
}

function getPokemonData(id: Number) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((response) => response.json())
    .then(createCardData);
}

function App() {
  const [pokemonCount, setPokemonCount] = useState<number | null>(null);
  const [listOfPokemonData, setPokemonData] = useState<
    { name: string; imgURL: string; clicked: boolean }[]
  >([]);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  // Gets the current number of pokemons that exist
  useEffect(() => {
    async function fetchPokemonCount() {
      const response = await fetch(
        `https://pokeapi.co/api/v2//pokemon-species/?limit=0`
      );
      const data = await response.json();
      setPokemonCount(data.count);
    }
    fetchPokemonCount();
  }, []);

  // Generate 12 random numbers and get the pokemons data for them
  useEffect(() => {
    if (pokemonCount !== null) {
      const promises = [];
      let usedNumber: number[] = [];
      for (let i = 0; i < 12; i++) {
        let pokemonId: number = Math.floor(Math.random() * pokemonCount) + 1;

        // Ensures that all numbers aren't duplicates
        while (usedNumber.includes(pokemonId)) {
          pokemonId = Math.floor(Math.random() * pokemonCount) + 1;
        }

        getPokemonData(pokemonId);
        promises.push(getPokemonData(pokemonId));
        usedNumber.push(pokemonId);
      }

      Promise.all(promises).then((results) => {
        const filteredResults = results.filter(
          (res): res is { name: string; imgURL: string; clicked: boolean } =>
            res !== null
        );
        setPokemonData(filteredResults);
        console.log("promises completed");
      });
    }
  }, [pokemonCount]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleClick = (index: number) => {
    const clickedPokemon = listOfPokemonData[index];

    // If it's already clicked, reset all
    if (clickedPokemon.clicked) {
      if (currentScore > highScore) {
        setHighScore(currentScore);
      }
      setCurrentScore(0);

      // Reset all clicked states to false
      const resetData = listOfPokemonData.map((pokemon) => ({
        ...pokemon,
        clicked: false,
      }));

      setPokemonData(shuffleArray(resetData));
      return;
    }

    setCurrentScore((prev) => prev + 1);
    const updatedData = listOfPokemonData.map((pokemon, idx) => {
      if (idx === index) {
        return { ...pokemon, clicked: true };
      }
      return pokemon;
    });

    setPokemonData(shuffleArray(updatedData));
  };

  return (
    <div>
      <div id="header">
        <div>
          <h1>Pokemon Memory Cards</h1>
          <p>
            Get points by clicking on images, but don't click the same one twice
          </p>
        </div>
        <div id="score">
          <h1>Current Score: {currentScore}</h1>
          <h1>High Score: {highScore}</h1>
        </div>
      </div>
      <div id="grid">
        {listOfPokemonData.map((pokemon, index) => (
          <Card
            key={pokemon.name}
            name={pokemon.name}
            imgURL={pokemon.imgURL}
            clicked={pokemon.clicked}
            onclick={() => handleClick(index)}
          ></Card>
        ))}
      </div>
    </div>
  );
}

export default App;
