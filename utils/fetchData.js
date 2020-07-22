const axios = require('axios');
const fs = require('fs');

const getPokemonList = () => axios
    .get('https://pokeapi.co/api/v2/pokemon/?limit=151')
    .then(res => res.data)
    .then(res => res.results);

const getPokemonInfo = url => axios
    .get(url)
    .then(res => res.data)
    .then(res => ({ name: res.name, number: res.id, types: res.types.map(x => x.type.name) }));

(async () => {
    const pokemonList = await getPokemonList()
    const getPokemonPromises = pokemonList.map(poke => getPokemonInfo(poke.url));
    const pokemons = Promise.all(getPokemonPromises);
    pokemons.then(result => fs.writeFileSync('../data/pokemons.json', JSON.stringify(result)));
})();