import axios from 'axios';

const POKE_API_BASE = "https://pokeapi.co/api/v2";

export const getGen1Pokemon = async () => {
  try {
    const response = await axios.get(`${POKE_API_BASE}/pokemon?limit=151`);
    
    // Map through the results and attach the image URL manually for instant loading
    return response.data.results.map((p, index) => {
      const id = index + 1;
      return {
        name: p.name,
        id: id,
        // This is the direct link to the high-quality images on PokeAPI's GitHub
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
      };
    });
  } catch (error) {
    console.error("Error fetching Gen 1 list:", error);
    return [];
  }
};

// Keep your existing getPokemonDetails function exactly the same!
export const getPokemonDetails = async (nameOrId) => {
  try {
    const response = await axios.get(`${POKE_API_BASE}/pokemon/${nameOrId}`);
    const data = response.data;
    
    return {
      name: data.name,
      types: data.types.map(t => t.type.name),
      image: data.sprites.other['official-artwork'].front_default,
      id: data.id,
      availableMoves: data.moves.map(m => m.move.name.replace('-', ' ')).sort(),
      selectedMoves: ["", "", "", ""],
      availableAbilities: data.abilities.map(a => a.ability.name.replace('-', ' ')).sort(),
      selectedAbility: "" 
    };
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
    return null;
  }
};