String.prototype.replaceAll = function (from, to) { return this.split(from).join(to); }
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const applyTemplate = template => stored => item => template
    .replaceAll('{{ID}}', item.id)
    .replaceAll('{{NUMBER}}', item.number.toString().padStart(3, '0'))
    .replaceAll('{{NAME}}', item.name)
    .replaceAll('{{CLASSES}}', stored.find(num => num === item.number) ? item.types.join(' ') : [...item.types, 'hidden'].join(' '))
    .replaceAll('{{TYPES}}', item.types.join(' | '))
    .replaceAll('{{IMAGE}}', `/images/${item.number}.png`);

const responseToJson = response => response.json();
const map = fn => arr => arr.map(fn);

const onFormSubmit = evt => {
    const hidden = document.querySelector('#pokequizNumber');
    const number = hidden.value;

    const txtField = document.querySelector('#pokequizName');
    const name = txtField.value.toLowerCase();

    if (number && name) {
        fetch(`/api/pokemons/${number}`)
            .then(responseToJson)
            .then(poke => {
                if (poke.name === name) {
                    const stored = JSON.parse(localStorage.getItem('pokemons') || "[]");
                    const toStore = [...new Set([...stored, parseInt(number)])];
                    localStorage.setItem('pokemons', JSON.stringify(toStore));

                    const card = document.querySelector(`.card[data-id="${poke.id}"]`);
                    card.scrollIntoView();
                    card.classList.remove('hidden');
                    populateQuiz();
                }
            });
    }
    else {
        populateQuiz();
    }

    evt.preventDefault();
    return false;
};

const populateQuiz = () => {
    const randomNumber = getRandomInt(1, 151);
    fetch(`/api/pokemons/${randomNumber}`)
        .then(responseToJson)
        .then(poke => {
            const image = document.querySelector('#pokequizImage');
            const hidden = document.querySelector('#pokequizNumber');
            const name = document.querySelector('#pokequizName');

            image.src = `/images/${poke.number}.png`
            hidden.value = poke.number;
            name.value = "";
            name.focus();
        });
};


(() => {

    //POKEDEX
    const pokemonCardTemplate = document.querySelector('template#pokeCard').innerHTML;
    const stored = JSON.parse(localStorage.getItem('pokemons') || "[]");
    const applyPokemonCardTemplate = applyTemplate(pokemonCardTemplate)(stored);
    const listElement = document.querySelector('ul.pokedex');

    fetch('/api/pokemons')
        .then(responseToJson)
        .then(map(applyPokemonCardTemplate))
        .then(cards => listElement.innerHTML = cards.join('\n'))


    //POKEQUIZ
    populateQuiz();
    const form = document.querySelector('form');
    form.addEventListener('submit', onFormSubmit);
})();


