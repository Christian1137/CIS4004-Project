import React, { useState } from 'react';

const TeamBuilderPage = () => {
  const [team, setTeam] = useState(Array(6).fill(null));

  const handleAddPokemon = (index) => {
    
    // for adding a pokemon
    const newTeam = [...team];
    newTeam[index] = { name: "Pikachu", types: ["Electric"], moves: [] };
    setTeam(newTeam);
  };

  return (
    <main className="team-builder">
      <h1>Build Your Pokémon Team</h1>
      <p>Select 6 Pokémon to see their total defensive effectiveness.</p>

      // inserting a team grid with some accessibility
      <section className="team-grid" role="region" aria-label="Pokémon Team Slots">
        {team.map((pokemon, index) => (
          <div 
            key={index} 
            className="pokemon-slot" 
            tabIndex="0" 
            role="button"
            aria-label={pokemon ? `Slot ${index + 1}: ${pokemon.name}` : `Slot ${index + 1}: Empty`}
          >
            {pokemon ? (
              <div className="pokemon-info">
                <h3>{pokemon.name}</h3>
                <p>Type: {pokemon.types.join('/')}</p>
              </div>
            ) : (
              <button 
                onClick={() => handleAddPokemon(index)}
                className="add-btn"
              >
                + Add Pokémon
              </button>
            )}
          </div>
        ))}
      </section>

      <div className="analysis-sctn">
        <button className="analyze-btn">Analyze the Type Effectiveness</button>
      </div>
    </main>
  );
};

export default TeamBuilderPage;
