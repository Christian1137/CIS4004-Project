import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getPokemonDetails } from '../services/pokeapi';

const ViewTeamPage = () => {
  // NEW: Store ALL teams, and track which one is currently selected
  const [allTeams, setAllTeams] = useState([]);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      const loggedInUserId = localStorage.getItem('currentUserId');

      if (!loggedInUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/team/get/${loggedInUserId}`);

        // NEW: Save the whole array instead of just response.data[0]
        if (response.data && response.data.length > 0) {
          setAllTeams(response.data);
        }
      } catch (error) {
        console.error("Error fetching team from database:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Team Data...</h2>;

  // Guard clause: If the array is empty, they have no teams
  if (allTeams.length === 0) return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>You don't have any teams saved yet!</h2>
      <button onClick={() => navigate('/team-build')} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        Go Draft a Team
      </button>
    </div>
  );

  const currentTeam = allTeams[activeTeamIndex];

  const handleEditTeam = async () => {
    setIsEditing(true);
    try {
      const reconstructedTeam = await Promise.all(
        currentTeam.roster.map(async (member) => {
          const details = await getPokemonDetails(member.pokemonId.name);
          details.selectedAbility = member.chosenAbility.name;
          details.selectedMoves = member.equippedMoves.map(m => m.name);
          while(details.selectedMoves.length < 4) details.selectedMoves.push("");
          return details;
        })
      );
      navigate('/team-build', { 
        state: { draftedTeam: reconstructedTeam, teamName: currentTeam.teamName, teamId: currentTeam._id } 
      });
    } catch (err) {
      console.error("Error reconstructing team", err);
      alert("Failed to load team for editing.");
    }
    setIsEditing(false);
  };

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>

      {/* select team */}
      <div style={{ textAlign: 'center', marginBottom: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', border: '1px solid #dee2e6' }}>
        <label htmlFor="team-select" style={{ fontWeight: 'bold', fontSize: '18px', marginRight: '15px' }}>
          Select a Team to View:
        </label>
        <select
          id="team-select"
          value={activeTeamIndex}
          onChange={(e) => setActiveTeamIndex(Number(e.target.value))}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '2px solid #007bff', cursor: 'pointer', minWidth: '250px' }}
        >
          {allTeams.map((team, index) => (
            <option key={team._id} value={index}>
              {team.teamName} ({team.roster.length} Pokémon)
            </option>
          ))}
        </select>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={async () => {
            if (window.confirm("Are you sure you want to delete this team?")) {
              try {
                await axios.delete(`/api/team/delete/${currentTeam._id}`);
                window.location.reload();
              } catch (err) {
                console.error("Failed to delete team", err);
              }
            }
          }}
          style={{ background: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Delete This Team
        </button>
        <button 
          onClick={handleEditTeam}
          disabled={isEditing}
          style={{ background: '#ffc107', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: isEditing ? 'wait' : 'pointer', fontWeight: 'bold', marginLeft: '10px' }}
        >
          {isEditing ? 'Loading Editor...' : 'Edit This Team'}
        </button>
      </div>

      <h1 style={{ textAlign: 'center', textTransform: 'capitalize', fontSize: '36px', marginBottom: '40px' }}>
        {currentTeam.teamName}
      </h1>

      {/* team grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px', width: '100%' }}>
        {currentTeam.roster.map((member, index) => (
          <div
            key={index}
            onClick={() => setSelectedMember(member)}
            style={{
              border: '3px solid #007bff',
              borderRadius: '20px',
              padding: '20px 20px',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
              textAlign: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={`https://img.pokemondb.net/sprites/home/normal/${member.pokemonId.name}.png`}
              alt={member.pokemonId.name}
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'contain'
              }}
            />
            <h2 style={{ textTransform: 'capitalize', margin: '10px 0 5px 0', fontSize: '22px', color: '#000' }}>
              {member.pokemonId.name}
            </h2>
          </div>
        ))}
      </div>

      {/* stats and moves popup */}
      {selectedMember && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '15px',
            width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
            position: 'relative'
          }}>

            <button
              onClick={() => setSelectedMember(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              X
            </button>

            <h2 style={{ textTransform: 'capitalize', textAlign: 'center', fontSize: '32px', margin: '0 0 10px 0', color: '#007bff' }}>
              {selectedMember.pokemonId.name}
            </h2>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
              <span style={{ background: '#eee', padding: '5px 15px', borderRadius: '20px', textTransform: 'capitalize', fontWeight: 'bold' }}>Type 1: {selectedMember.pokemonId.type1}</span>
              {selectedMember.pokemonId.type2 && (
                <span style={{ background: '#eee', padding: '5px 15px', borderRadius: '20px', textTransform: 'capitalize', fontWeight: 'bold' }}>Type 2: {selectedMember.pokemonId.type2}</span>
              )}
            </div>

            {/* stats */}
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Base Stats</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontWeight: 'bold' }}>
                <span style={{ color: '#28a745' }}>HP: {selectedMember.pokemonId.hp}</span>
                <span style={{ color: '#dc3545' }}>Attack: {selectedMember.pokemonId.attack}</span>
                <span style={{ color: '#17a2b8' }}>Defense: {selectedMember.pokemonId.defense}</span>
                <span style={{ color: '#6f42c1' }}>Sp. Atk: {selectedMember.pokemonId.specialAttack}</span>
                <span style={{ color: '#fd7e14' }}>Sp. Def: {selectedMember.pokemonId.specialDefense}</span>
                <span style={{ color: '#e83e8c' }}>Speed: {selectedMember.pokemonId.speed}</span>
              </div>
            </div>

            {/* abilities */}
            <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
              <h3 style={{ margin: '0 0 5px 0', textTransform: 'capitalize' }}>Ability: {selectedMember.chosenAbility.name}</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>{selectedMember.chosenAbility.description}</p>
            </div>

            {/* moves */}
            <h3 style={{ margin: '0 0 10px 0' }}>Equipped Moves</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedMember.equippedMoves.map((move, i) => (
                <div key={i} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: '16px' }}>{move.name}</div>
                  <div style={{ fontSize: '12px', textAlign: 'right' }}>

                    <span style={{ textTransform: 'capitalize', color: '#333', display: 'block', fontWeight: '600' }}>Type: {move.element}</span>
                    <span style={{ display: 'block' }}>Power: {move.power === 0 ? '-' : move.power} | Acc: {move.accuracy}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </main>
  );
};

export default ViewTeamPage;