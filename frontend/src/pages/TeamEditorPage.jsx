import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Uncomment when ready to link to backend

const TeamEditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { user } = useAuth(); // Uncomment to get the logged-in user ID for the database
  
  // Retrieve the team passed from the Builder page
  const [team, setTeam] = useState(location.state?.draftedTeam || []);
  const [teamName, setTeamName] = useState("My Awesome Team");

  // If someone navigates here directly without drafting, send them back
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

  const saveTeamToDatabase = async () => {
    // Basic validation before saving
    const isTeamValid = team.every(p => 
      p.selectedAbility !== "" && 
      p.selectedMoves.every(m => m !== "") &&
      new Set(p.selectedMoves).size === 4 // Ensures 4 unique moves
    );

    if (!isTeamValid) {
      alert("Please ensure every Pokémon has 4 unique moves and 1 ability selected!");
      return;
    }

    /* THIS IS WHERE YOUR MERN CRUD MAGIC HAPPENS
      Uncomment and adjust this fetch call when your backend routes are ready.
    */
    
    // try {
    //   const response = await fetch('/api/teams', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       ownerId: user._id, 
    //       teamName: teamName,
    //       members: team 
    //     })
    //   });
    //   if (response.ok) {
    //     alert("Team successfully saved to MongoDB!");
    //     navigate('/profile'); // Or wherever you want them to go after saving
    //   }
    // } catch (error) {
    //   console.error("Failed to save team", error);
    // }
    
    console.log("Team ready to send to database:", { teamName, members: team });
    alert("Check the console to see the JSON data ready for MongoDB!");
  };

  return (
    <main style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>2. Configure Moves & Abilities</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <input 
          type="text" 
          value={teamName} 
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Name your team..."
          style={{ padding: '10px', fontSize: '18px', width: '300px', textAlign: 'center' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {team.map((pokemon, pIndex) => (
          <div key={pIndex} style={{ border: '2px solid #007bff', borderRadius: '10px', padding: '15px', backgroundColor: '#f8f9fa' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <img src={pokemon.image} alt={pokemon.name} style={{ width: '80px', height: '80px', backgroundColor: '#fff', borderRadius: '50%' }} />
              <h3 style={{ textTransform: 'capitalize', margin: 0 }}>{pokemon.name}</h3>
            </div>

            {/* ABILITY SELECTION */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Ability:</label>
              <select 
                value={pokemon.selectedAbility} 
                onChange={(e) => handleAbilityChange(pIndex, e.target.value)}
                style={{ width: '100%', padding: '8px', textTransform: 'capitalize' }}
              >
                <option value="">-- Select Ability --</option>
                {pokemon.availableAbilities.map(ability => (
                  <option key={ability} value={ability}>{ability}</option>
                ))}
              </select>
            </div>

            {/* MOVES SELECTION */}
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>4 Unique Moves:</label>
              {[0, 1, 2, 3].map((slotIndex) => {
                const availableOptions = pokemon.availableMoves.filter(
                  move => !pokemon.selectedMoves.includes(move) || pokemon.selectedMoves[slotIndex] === move
                );

                return (
                  <div key={slotIndex} style={{ marginBottom: '8px' }}>
                    <input
                      list={`moves-list-${pIndex}-${slotIndex}`}
                      placeholder={`Move ${slotIndex + 1}`}
                      value={pokemon.selectedMoves[slotIndex]}
                      onChange={(e) => handleMoveChange(pIndex, slotIndex, e.target.value)}
                      style={{ width: '100%', padding: '8px', textTransform: 'capitalize' }}
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

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button 
          onClick={saveTeamToDatabase}
          style={{ padding: '15px 40px', fontSize: '20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Save Team to Database
        </button>
      </div>

    </main>
  );
};

export default TeamEditorPage;