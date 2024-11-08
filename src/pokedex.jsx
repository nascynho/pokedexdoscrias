import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

 
  const getPokemons = async (id) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return {
        name: response.data.name,
        image: response.data.sprites.front_default,
        types: response.data.types.map(type => type.type.name).join(', '),
        stats: response.data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', '),
        id: response.data.id,
      };
    } catch (error) {
      console.error(`Error fetching Pokémon ${id}:`, error);
      return null;
    }
  };

  const fetchPokemons = async (offset = 0, limit = 20) => {
    setLoading(true);  
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
      const data = response.data.results;
      const pokemonsData = await Promise.all(data.map(pokemon => getPokemons(pokemon.url.split('/')[6])));
      setPokemons(prev => [...prev, ...pokemonsData]);  
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

 
  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // modo escuro (opcional)
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  
  useEffect(() => {
    fetchPokemons();  
  }, []);

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <h1>Pokedex dos crias</h1>

 
      <button onClick={toggleDarkMode}>Modo escuro</button>

   
      <input
        type="text"
        placeholder="Procure o Pokémon"
        value={searchQuery}
        onChange={handleSearchChange}
      />

     
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <ul>
         
          {filteredPokemons.map(item => (
            <li key={item.id}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>Types: {item.types}</p>
              <p>Stats: {item.stats}</p>
            </li>
          ))}
        </ul>
      )}

    
      <button onClick={() => fetchPokemons(pokemons.length, 20)}>
        Carregue mais pokemons 
      </button>
    </div>
  );
}

export default App;
