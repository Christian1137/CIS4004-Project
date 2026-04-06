import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Uncomment when ready to link to backend

const TeamEditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { user } = useAuth(); // Uncomment to get the logged-in user ID
  
  const [team, setTeam] = useState(location.state?.draftedTeam || []);
  const [teamName, setTeamName] = useState("My Starter Team");

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
    // warning to override moves
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
    
    const isTeamValid = team.every(p => 
      p.selectedAbility !== "" && 
      p.selectedMoves.every(m => m !== "") &&
      new Set(p.selectedMoves).size === 4 
    );

    if (!isTeamValid) {
      alert("Please ensure every Pokémon has 4 unique moves and 1 ability selected!");
      return;
    }

    /* UPDATED MERN CRUD FETCH CALL
      This is structured to exactly match your new mongoose Team schema!
    */
    
    // try {
    //   // Map the frontend 'team' state into the 'roster' format your backend expects
    //   const formattedRoster = team.map(p => ({
    //     pokemonId: p.id, // This is the MongoDB _id from your pokeapi.js!
    //     // Note: Your backend expects ObjectIds for Moves and Abilities. 
    //     // Because we currently hold string names here, you will need to look up these 
    //     // ObjectIds by name in your Express route before saving the team.
    //     equippedMoves: p.selectedMoves, 
    //     chosenAbility: p.selectedAbility 
    //   }));
    //
    //   const response = await fetch('http://localhost:5000/api/team', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       userId: user.userId, // Pulling from your login response
    //       teamName: teamName,
    //       roster: formattedRoster 
    //     })
    //   });
    //   
    //   if (response.ok) {
    //     alert("Team successfully saved to MongoDB!");
    //     navigate('/profile'); 
    //   }
    // } catch (error) {
    //   console.error("Failed to save team", error);
    // }
    
    console.log("Team ready to send to database:", { teamName, roster: team });
    alert("Check the console to see the JSON data ready for MongoDB!");
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
            onClick={() => navigate('/team', { state: { draftedTeam: team } })}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {team.map((pokemon, pIndex) => (
          <div key={pIndex} style={{ border: '2px solid #007bff', borderRadius: '10px', padding: '15px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              <img src={pokemon.image} alt={pokemon.name} style={{ width: '80px', height: '80px', backgroundColor: '#fff', borderRadius: '50%', border: '1px solid #ccc' }} />
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
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>4 Unique Moves (Type to Search):</label>
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