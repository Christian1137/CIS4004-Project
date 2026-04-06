import React, { useState, useEffect } from 'react';
import { getGen1Pokemon, getPokemonDetails } from '../services/pokeapi';
import { useNavigate, useLocation } from 'react-router-dom';

const TeamBuilderPage = () => {
  const location = useLocation(); 
  const navigate = useNavigate();
  const [team, setTeam] = useState(location.state?.draftedTeam || []); 
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingPokemon, setLoadingPokemon] = useState(false);
  const [hoveredPokemon, setHoveredPokemon] = useState(null); 
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  

  useEffect(() => {
    const loadList = async () => {
      const list = await getGen1Pokemon();
      setPokemonList(list);
    };
    loadList();
  }, []);

  const filteredPokemon = pokemonList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToTeam = async (pokemonName) => {
    if (team.length >= 6 || loadingPokemon) return;

    if (team.some(member => member.name === pokemonName)) {
      alert(`${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)} is already on your team!`);
      return;
    }
    
    setLoadingPokemon(true);
    const details = await getPokemonDetails(pokemonName);
    
    if (details) {
      setTeam([...team, details]);
    }
    setLoadingPokemon(false);
  };

  const handleRemoveFromTeam = (index) => {
    const newTeam = [...team];
    newTeam.splice(index, 1);
    setTeam(newTeam);
  };
  const handleRandomTeam = async () => {
    if (pokemonList.length < 6 || loadingPokemon) return;
    
    // warning for replacing team
    if (team.length > 0) {
      const confirm = window.confirm("This will replace your current drafted team. Are you sure?");
      if (!confirm) return;
    }

    setLoadingPokemon(true);
    const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
    const randomSix = shuffled.slice(0, 6);

    const detailedTeam = await Promise.all(
      randomSix.map(p => getPokemonDetails(p.name))
    );
    setTeam(detailedTeam.filter(p => p !== null));
    setLoadingPokemon(false);
  };

  const handleProceedToEdit = () => {
    navigate('/edit-team', { state: { draftedTeam: team } });
  };

  return (
    <main style={{ padding: '20px 0', margin: '0 auto', textAlign: 'center', boxSizing: 'border-box' }}>
      <h1>Draft Your Team</h1>
      <p>Click a Pokémon to add them. Hover to see their name.</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name (e.g. 'Pikachu')"
          style={{ width: '100%', maxWidth: '400px', padding: '12px', fontSize: '18px', borderRadius: '8px', border: '2px solid #007bff', boxSizing: 'border-box' }}
        />
        
        <button 
          onClick={handleRandomTeam}
          disabled={loadingPokemon}
          style={{ padding: '12px 20px', fontSize: '16px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '8px', cursor: loadingPokemon ? 'wait' : 'pointer', fontWeight: 'bold' }}
        >
          Randomize Team
        </button>
      </div>

      <section style={{ backgroundColor: '#f8f9fa', border: '2px dashed #007bff', padding: '15px', borderRadius: '10px', marginBottom: '25px', width: '90%', maxWidth: '1000px', margin: '0 auto 25px auto' }}>
        <h2 style={{ margin: '0 0 10px 0' }}>Current Roster ({team.length}/6)</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', minHeight: '130px' }}>
          {team.map((pokemon, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', backgroundColor: '#fff', width: '110px' }}>
              <img src={pokemon.image} alt={pokemon.name} style={{ width: '80px', height: '80px' }} />
              <p style={{ textTransform: 'capitalize', fontWeight: 'bold', margin: '5px 0', fontSize: '14px' }}>{pokemon.name}</p>
              <button 
                onClick={() => handleRemoveFromTeam(index)}
                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontSize: '12px' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {team.length > 0 && (
          <button 
            onClick={handleProceedToEdit} 
            style={{ marginTop: '15px', padding: '10px 25px', fontSize: '16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Select Moves & Abilities
          </button>
        )}
      </section>

      {/* grid for all pokemon */}
      <section 
        style={{ opacity: team.length >= 6 ? 0.5 : 1, pointerEvents: team.length >= 6 ? 'none' : 'auto', display: 'flex', justifyContent: 'center' }}
        onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
      >
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, 120px)',
          justifyContent: 'center', 
          gap: '15px', 
          padding: '20px', 
          width: '100%', 
          maxWidth: '1200px' 
        }}>
          {filteredPokemon.map((p) => {
            const isAlreadyInTeam = team.some(member => member.name === p.name);

            return (
              <div 
                key={p.name} 
                onClick={() => handleAddToTeam(p.name)}
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '10px', 
                  cursor: 'pointer',
                  backgroundColor: isAlreadyInTeam ? '#e9ecef' : '#fff',
                  transition: 'transform 0.1s',
                  position: 'relative',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => { 
                  if(!isAlreadyInTeam) e.currentTarget.style.transform = 'scale(1.1)'; 
                  setHoveredPokemon(p); 
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = 'scale(1)'; 
                  setHoveredPokemon(null);
                }}
              >
                <img 
                  src={p.image} 
                  alt={p.name} 
                  style={{ width: '80px', height: '80px', opacity: isAlreadyInTeam ? 0.4 : 1 }} 
                />
                
                {isAlreadyInTeam && (
                   <span style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '14px', color: '#28a745', fontWeight: 'bold' }}>✔</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* show name on hover */}
      {hoveredPokemon && (
        <div style={{
          position: 'fixed',
          top: tooltipPos.y + 15, 
          left: tooltipPos.x + 15,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          pointerEvents: 'none', 
          zIndex: 9999, 
          textTransform: 'capitalize',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          #{hoveredPokemon.id} {hoveredPokemon.name}
        </div>
      )}

    </main>
  );
};

export default TeamBuilderPage;