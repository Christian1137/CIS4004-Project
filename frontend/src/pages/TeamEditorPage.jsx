import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TeamEditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [team, setTeam] = useState(location.state?.draftedTeam || []);
  
  // Grab the teamName from the previous page, or default it
  const [teamName, setTeamName] = useState(location.state?.teamName || "");

  if (team.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>No team drafted!</h2>
        <button onClick={() => navigate('/team')}>Go back to Team Builder</button>
      </div>
    );
  }

  const handleMoveChange = (pokemonIndex, moveSlotIndex, moveValue) => {
    const updatedTeam = [...team];
    updatedTeam[pokemonIndex].selectedMoves[moveSlotIndex] = moveValue.toLowerCase();
    setTeam(updatedTeam);
  };

  const handleAbilityChange = (pokemonIndex, abilityValue) => {
    const updatedTeam = [...team];
    updatedTeam[pokemonIndex].selectedAbility = abilityValue.toLowerCase();
    setTeam(updatedTeam);
  };

  const handleRandomizeAll = () => {
    const confirm = window.confirm("This will randomize abilities and moves for your entire team. Proceed?");
    if (!confirm) return;

    const randomizedTeam = team.map(pokemon => {
      const randomAbility = pokemon.availableAbilities.length > 0
        ? pokemon.availableAbilities[Math.floor(Math.random() * pokemon.availableAbilities.length)]
        : "";

      const shuffledMoves = [...pokemon.availableMoves].sort(() => 0.5 - Math.random());
      const randomMoves = [
        shuffledMoves[0] || "",
        shuffledMoves[1] || "",
        shuffledMoves[2] || "",
        shuffledMoves[3] || ""
      ];

      return {
        ...pokemon,
        selectedAbility: randomAbility,
        selectedMoves: randomMoves
      };
    });

    setTeam(randomizedTeam);
  };

  const saveTeamToDatabase = async () => {
    if (!teamName || teamName.trim() === "") {
      alert("Please enter a name for your team before saving!");
      return; 
    }

    // get user ID
    const loggedInUserId = localStorage.getItem('currentUserId');

    if (!loggedInUserId) {
      alert("Error: You must be logged in to save a team!");
      return;
    }

    // moves and abilities must be filled
    const isTeamValid = team.every(p => 
      p.selectedAbility !== "" && 
      p.selectedMoves.every(m => m !== "") &&
      new Set(p.selectedMoves).size === 4 
    );

    if (!isTeamValid) {
      alert("Please ensure every Pokémon has 4 unique moves and 1 ability selected!");
      return;
    }

    try {
        const formattedRoster = await Promise.all(team.map(async (p) => {
        const res = await fetch(`/api/pokemon/${p.name}`);
        const dbData = await res.json();
        const abilityId = dbData.allowedAbilities.find(a => a.name === p.selectedAbility)?._id;
        const moveIds = p.selectedMoves.map(moveName => {
           return dbData.allowedMoves.find(m => m.name === moveName)?._id;
        });

        return {
          pokemonId: p.id, 
          chosenAbility: abilityId,
          equippedMoves: moveIds
        };
      }));

      
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: loggedInUserId, 
          teamName: teamName,
          roster: formattedRoster 
        })
      });
      
      if (response.ok) {
        alert("Team successfully saved to MongoDB!");
        navigate('/view-team'); 
      } else {
        const errorData = await response.json();
        alert("Failed to save: " + errorData.message);
      }
    } catch (error) {
      console.error("Failed to save team", error);
      alert("Server error while saving team.");
    }
  };

  return (
    <main style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box' }}>
      <h1 style={{ textAlign: 'center' }}>Select Moves & Abilities</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <input 
          type="text" 
          value={teamName} 
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Name your team..."
          style={{ padding: '10px', fontSize: '18px', width: '90%', maxWidth: '400px', textAlign: 'center', borderRadius: '8px', border: '2px solid #ccc' }}
        />
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>

          <button 
            onClick={() => navigate('/team-build', { state: { draftedTeam: team, teamName: teamName } })}
            style={{ padding: '12px 25px', fontSize: '16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Back to Drafting
          </button>

          <button 
            onClick={handleRandomizeAll}
            style={{ padding: '12px 25px', fontSize: '16px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Randomize All
          </button>
          
          <button 
            onClick={saveTeamToDatabase}
            style={{ padding: '12px 25px', fontSize: '16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          >
            Save Team
          </button>
        </div>
      </div>

      {/* EDITOR GRID (100% Width) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', width: '100%' }}>
        {team.map((pokemon, pIndex) => (
          <div key={pIndex} style={{ border: '2px solid #007bff', borderRadius: '10px', padding: '20px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              <img src={pokemon.image} alt={pokemon.name} style={{ width: '75px', height: '75px', backgroundColor: '#fff', borderRadius: '50%', border: '1px solid #ccc' }} />
              <h3 style={{ textTransform: 'capitalize', margin: 0 }}>{pokemon.name}</h3>
            </div>

            {/* ability */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Ability:</label>
              <select 
                value={pokemon.selectedAbility} 
                onChange={(e) => handleAbilityChange(pIndex, e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  textTransform: 'capitalize', 
                  boxSizing: 'border-box', 
                  borderRadius: '6px',
                  border: '1px solid #aaa'
                }}
              >
                <option value="">-- Select Ability --</option>
                {pokemon.availableAbilities.map(ability => (
                  <option key={ability} value={ability}>{ability}</option>
                ))}
              </select>
            </div>

            {/* moves */}
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}> Moveset :</label>
              {[0, 1, 2, 3].map((slotIndex) => {
                const availableOptions = pokemon.availableMoves.filter(
                  move => !pokemon.selectedMoves.includes(move) || pokemon.selectedMoves[slotIndex] === move
                );

                return (
                  <div key={slotIndex} style={{ marginBottom: '10px' }}>
                    <input
                      list={`moves-list-${pIndex}-${slotIndex}`}
                      placeholder={`Select Move ${slotIndex + 1}...`}
                      value={pokemon.selectedMoves[slotIndex]}
                      onChange={(e) => handleMoveChange(pIndex, slotIndex, e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        textTransform: 'capitalize', 
                        boxSizing: 'border-box', 
                        borderRadius: '6px',
                        border: '1px solid #aaa'
                      }}
                    />
                    <datalist id={`moves-list-${pIndex}-${slotIndex}`}>
                      {availableOptions.map(move => <option key={move} value={move} />)}
                    </datalist>
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </main>
  );
};

export default TeamEditorPage;