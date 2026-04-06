import axios from 'axios';

const MY_BACKEND_API = "http://localhost:5000/api"; 

export const getGen1Pokemon = async () => {
  try {
    const response = await axios.get(`${MY_BACKEND_API}/pokemon`);
    return response.data.map((p, index) => {
      const id = index + 1;
      return {
        name: p.name,
        id: id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
      };
    });
  } catch (error) {
    console.error("Error fetching from my database:", error);
    return [];
  }
};

export const getPokemonDetails = async (name) => {
  try {
    // stats, moves, and abilities from actual DB
    const response = await axios.get(`${MY_BACKEND_API}/pokemon/${name}`);
    const data = response.data;
    
    // get image from API to save space
    const imageRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const imageUrl = imageRes.data.sprites.other['official-artwork'].front_default;
    
    return {
      name: data.name,
      types: data.type2 ? [data.type1, data.type2] : [data.type1],
      image: imageUrl,
      id: data._id, 
      availableMoves: data.allowedMoves.map(m => m.name).sort(),
      selectedMoves: ["", "", "", ""],
      availableAbilities: data.allowedAbilities.map(a => a.name).sort(),
      selectedAbility: "" 
    };
  } catch (error) {
    console.error("Error fetching details:", error);
    return null;
  }
};