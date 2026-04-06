import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { useAuth } from '../context/AuthContext'; // Uncomment when your login is ready

const ViewTeamPage = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null); // Controls the pop-up modal
  
  const navigate = useNavigate();
  // const { user } = useAuth(); // Uncomment when ready
  
  // testing with hardcoded user
  const TEST_USER_ID = "69d412f57d3364cfcc48b557"; 

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/team/get/${TEST_USER_ID}`);
        
        if (response.data && response.data.length > 0) {
          setTeamData(response.data[0]); 
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
  
  if (!teamData) return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>You don't have a team saved yet!</h2>
      <button onClick={() => navigate('/team-build')} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Go Draft a Team</button>
    </div>
  );

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
      <h1 style={{ textAlign: 'center', textTransform: 'capitalize', fontSize: '36px', marginBottom: '40px' }}>
        {teamData.teamName}
      </h1>


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        {teamData.roster.map((member, index) => (
          <div 
            key={index} 
            onClick={() => setSelectedMember(member)}
            style={{ 
              border: '2px solid #007bff', 
              borderRadius: '12px', 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              cursor: 'pointer', 
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img 
              src={`https://img.pokemondb.net/sprites/home/normal/${member.pokemonId.name}.png`} 
              alt={member.pokemonId.name} 
              style={{ width: '120px', height: '120px' }} 
            />
            <h2 style={{ textTransform: 'capitalize', margin: '10px 0 0 0' }}>{member.pokemonId.name}</h2>
            {/* UPDATED: Darker color (#333) for better readability */}
            <p style={{ margin: '5px 0', color: '#333', fontWeight: '500' }}>Click to view stats</p>
          </div>
        ))}
      </div>


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