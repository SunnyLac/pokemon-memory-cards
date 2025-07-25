import React from 'react';
import {useState, useEffect} from 'react';
import './App.css';

interface pokemonData {
  name: string;
  sprites: {
    front_default: string;
  };
}

function createCardData(data: pokemonData){
  let name = data.name;
  let imgURL = data.sprites.front_default;

  if (name && imgURL){
    return {
      "name": name,
      "imgURL" : imgURL,
      "clicked" : false
    };

  }
  else{
    console.log("error");
    return null;
  }
}

function getPokemonData(id : Number){
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  .then(response => response.json())
  .then(createCardData);
}



function App() {
  const [pokemonCount, setPokemonCount] = useState<number | null>(null);
  const [listOfPokemonData, setPokemonData] = useState<{ name: string; imgURL: string; clicked: boolean; }[]>([]);

  // Gets the current number of pokemons that exist
  useEffect(()=>{
    async function fetchPokemonCount(){
      const response = await fetch(`https://pokeapi.co/api/v2//pokemon-species/?limit=0`);
      const data = await response.json();
      setPokemonCount(data.count);
    }
    fetchPokemonCount();
  },[]);

  // Generate 12 random numbers and get the pokemons data for them
  useEffect(()=>{
    if (pokemonCount !== null){
      const promises = [];
      let usedNumber: number[] = [];
      for (let i = 0; i < 12; i++){
        let pokemonId : number = (Math.floor(Math.random() * pokemonCount))+1;
        
        // Ensures that all numbers aren't duplicates
        while (usedNumber.includes(pokemonId)){
          pokemonId = (Math.floor(Math.random() * pokemonCount))+1;
        };

        getPokemonData(pokemonId);
        promises.push(getPokemonData(pokemonId));
        usedNumber.push(pokemonId);
      }

      Promise.all(promises).then((results)=>{
        const filteredResults = results.filter((res): res is { name: string; imgURL: string; clicked: boolean } => res !== null);
        setPokemonData(filteredResults);
        console.log("promises completed");
      })
    }
  },[pokemonCount])
  
  return (
    <div>
      {listOfPokemonData.map(pokemon => (
        <div key={pokemon.name}>
          <h3>{pokemon.name}</h3>
          <img src={pokemon.imgURL} alt={pokemon.name} />
        </div>
      ))}
    </div>
  );
}

export default App;
