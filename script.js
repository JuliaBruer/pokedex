let i = 1;
let end = 22;
let morePokemons = 20;

let currentPokemon;
let currentPokemonSpecies;
let pokemonRessource;

let allPokemonsName = [];
let allPokemonsImg = [];
let allPokemonsTyp = [];
let allPokemonsHeight = [];
let allPokemonsWeight = [];
let allPokemonsBaseExperience = [];
let allPokemonsHp = [];
let allPokemonsAttack = [];
let allPokemonsDefense = [];
let allPokemonsSpecialAttack = [];
let allPokemonsSpecialDefense = [];
let allPokemonsSpeed = [];

/** This function is started when the page is called via html body onload. */
function init() {
    searchPokemon();
    loadPokemon();
    cardsColor(i);
}

/** This function fetches Pokémon data, extracts specific attributes, and populates arrays with the information for a range of Pokémon. */
async function loadPokemon() {
        for (i; i < end; i++) {
            await loadPokemonFromUrl();
            allPokemonsName.push(currentPokemon['name']);
            allPokemonsImg.push(currentPokemon['sprites']['other']['home']['front_shiny']);
            allPokemonsTyp.push(currentPokemon['types'][0]['type']['name']);
            allPokemonsHeight.push(currentPokemon['height']);
            allPokemonsWeight.push(currentPokemon['weight']);
            allPokemonsBaseExperience.push(currentPokemon['base_experience']);
            allPokemonsHp.push(currentPokemon['stats'][0]['base_stat']);
            allPokemonsAttack.push(currentPokemon['stats'][1]['base_stat']);
            allPokemonsDefense.push(currentPokemon['stats'][2]['base_stat']);
            allPokemonsSpecialAttack.push(currentPokemon['stats'][3]['base_stat']);
            allPokemonsSpecialDefense.push(currentPokemon['stats'][4]['base_stat']);
            allPokemonsSpeed.push(currentPokemon['stats'][5]['base_stat']);
        }
}

/** This function accesses APIs based on specified URLs and then renders Pokémon cards. */
async function loadPokemonFromUrl() {
    let pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${i}/`;
    let limitUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    let pokemonResponse = await fetch(pokemonUrl);
    let speciesResponse = await fetch(speciesUrl);
    let limitResponse = await fetch(limitUrl);
    currentPokemon = await pokemonResponse.json();
    currentPokemonSpecies = await speciesResponse.json();
    pokemonRessource = await limitResponse.json();

    renderPokemonCards();
}

/** This function creates Pokémon cards with details based on the stored data and renders this data in HTML. */
function renderPokemonCards() {
    let pokemonCardsHTML = '';

    for (let i = 0; i < allPokemonsName.length; i++) {
        pokemonCardsHTML += generatePokemonCardsHTML(i);
    }

    document.getElementById('pokemon-cards').innerHTML = pokemonCardsHTML;
}

/**
 * This function generates the HTML code for a Pokémon card.
 * @param {number} i - Index of the Pokémon.
 */
function generatePokemonCardsHTML(i) {
    let name = allPokemonsName[i].charAt(0).toUpperCase() + allPokemonsName[i].slice(1);
    let number = `#${String(i + 1).padStart(3, '0')}`;
    let img = allPokemonsImg[i];
    let typ = allPokemonsTyp[i];
    let color = cardsColor(typ);

    return `
        <div class="pokedex-card ${color}" onclick="openPokemonDetails(${i})">
            <div class="pokedex-header">
                <h3>${name}</h3>
                <span class="pokedex-number">${number}</span>
            </div>
            <div class="pokedex-typ">${typ}</div>
            <div>
                <img class="pokedex-img" src="${img}">
            </div>
        </div>
    `;
}

/** 
 * This function generates the color accordingly based on the Pokémon type. 
 * @param {string} typ - The type of the Pokémon.
*/
function cardsColor(typ) {
    switch (typ) {
        case 'grass':
            return 'grass-bg';
        case 'fire':
            return 'fire-bg';
        case 'water':
            return 'water-bg';
        case 'bug':
            return 'bug-bg';
        case 'normal':
            return 'normal-bg';
        case 'electric':
            return 'electric-bg';
        case 'poison':
            return 'poison-bg';
        default:
            return 'default-bg';
    }
}

/** 
 * This function reveals detailed information about a specific Pokémon and updates the displayed content accordingly. 
 * @param {number} i - Index of the Pokémon.
 */
function openPokemonDetails(i) {
    document.getElementById('pokemon-container').classList.remove('d-none'); 
    renderPokemonHeader(i);
    renderPokemonAbout(i);
    renderPokemonStats(i);
    renderPokemonMoves(i);
}

/**
 * This function constructs the header and layout for displaying detailed information about a specific Pokémon.
 * @param {number} i - Index of the Pokémon.
 */
function renderPokemonHeader(i) {
    let name = allPokemonsName[i].charAt(0).toUpperCase() + allPokemonsName[i].slice(1);
    let typ = allPokemonsTyp[i];
    let hideLeftArrow = i === 0 ? 'd-none' : '';
    let hideRightArrow = i === allPokemonsName.length - 1 ? 'd-none' : '';

    let headerHTML = generatePokemonHeaderHTML(i, name, typ, hideLeftArrow, hideRightArrow);
    let detailsHTML = generatePokemonDetailsHTML(allPokemonsImg[i]);

    document.getElementById('pokemon-container').innerHTML = '';
    document.getElementById('pokemon-container').innerHTML += headerHTML + detailsHTML;
}

/**
 * This function generates the HTML layout for the header section displaying a specific Pokémon's details.
 * @param {number} i - Index of the Pokémon.
 * @param {string} name - Name of the Pokémon.
 * @param {string} typ - Type of the Pokémon.
 * @param {string} hideLeftArrow - CSS class for hiding the left arrow (empty string or 'd-none').
 * @param {string} hideRightArrow - CSS class for hiding the right arrow (empty string or 'd-none').
 */
function generatePokemonHeaderHTML(i, name, typ, hideLeftArrow, hideRightArrow) {
    let color = cardsColor(typ);
    return `
        <div class="pokemon-details ${color}">
            <div class="close-content">
                <div class="close-container" onclick="closeContainer()">
                    <img src="./img/close.ico" alt="close">
                </div>
            </div>

            <div class="left-arrow-content">
                <div class="left-arrow-container ${hideLeftArrow}" id="left-arrow-container" onclick="openPokemonDetails(${i - 1})">
                    <img src="./img/arrow-left.ico" alt="arrow left">
                </div>
            </div>

            <div class="details-header">
                <h3 class="pokemon-name">${name}</h3>
                <div class="pokemon-typ">${typ}</div>
                <div class="pokeball-container">
                    <img class="pokeball" src="./img/pokeball.png" alt="pokeball">
                </div>
            </div>

            <div class="right-arrow-content">
                <div class="right-arrow-container ${hideRightArrow}" onclick="openPokemonDetails(${i + 1})">
                    <img src="./img/arrow-right.ico" alt="arrow right">
                </div>
            </div>
        </div>
    `;
}

/**
 * This function generates the HTML layout for displaying detailed information about a specific Pokémon.
 * @param {string} img - URL of the Pokémon's image.
 */
function generatePokemonDetailsHTML(img) {
    return `
        <div class="information-container">
            <div class="pokemon-img-container">
                <img class="pokemon-img" src="${img}">
            </div>

            <div class="information-content">
                <div class="tab">
                    <button class="tablinks btn-animation" onclick="openTabs(event, 'about')">ABOUT</button>
                    <button class="tablinks btn-animation" onclick="openTabs(event, 'stats')">STATS</button>
                    <button class="tablinks btn-animation" onclick="openTabs(event, 'moves')">MOVES</button>
                </div>
                
                <div id="about" class="tabcontent about">
                    <h4>ABOUT</h4>
                </div>
                
                <div id="stats" class="tabcontent stats">
                    <h4>STATS</h4>
                </div>
                
                <div id="moves" class="tabcontent moves">
                    <h4>MOVES</h4>
                </div>
            </div>
        </div>
    `;
}

/** 
 * This function manages tabbed content by hiding/displaying sections based on user interaction and applying the active class to the selected tab. 
 * @param {event} event - The event triggered by the user interaction.
 * @param {string} pokemonDetails - The ID of the tab content to be displayed.
 */
function openTabs(event, pokemonDetails) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(pokemonDetails).style.display = "block";
    event.currentTarget.className += " active";
}

/** 
 * This function populates the 'about' section with a table displaying a specific Pokémon's attributes. 
 * @param {number} i - Index of the Pokémon.
 */
function renderPokemonAbout(i) {
    let height = allPokemonsHeight[i];
    let weight = allPokemonsWeight[i];
    let baseExperience = allPokemonsBaseExperience[i];

        document.getElementById('about').innerHTML += `
            <table>
                <tr>
                    <td>HEIGHT:</td>
                    <td>${height}</td>
                </tr>
                <tr>
                    <td>WEIGHT:</td>
                    <td>${weight}</td>
                </tr>
                <tr>
                    <td>BASE EXPERIENCE:</td>
                    <td>${baseExperience}</td>
                </tr>
            </table>
        `;
}

/** 
 * This function populates the 'stats' section with a table displaying a specific Pokémon's attributes. 
 * @param {number} i - Index of the Pokémon.
 */
function renderPokemonStats(i) {
    let hp = allPokemonsHp[i];
    let attack = allPokemonsAttack[i];
    let defense = allPokemonsDefense[i];
    let specialAttack = allPokemonsSpecialAttack[i];
    let specialDefense = allPokemonsSpecialDefense[i];
    let speed = allPokemonsSpeed[i];

        document.getElementById('stats').innerHTML += `
            <table>
                <tr>
                    <td>HP:</td>
                    <td>${hp}</td>
                </tr>
                <tr>
                    <td>ATTACK:</td>
                    <td>${attack}</td>
                </tr>
                <tr>
                    <td>DEFENSE:</td>
                    <td>${defense}</td>
                </tr>
                <tr>
                    <td>SPECIAL ATTACK:</td>
                    <td>${specialAttack}</td>
                </tr>
                <tr>
                    <td>SPECIAL DEFENSE:</td>
                    <td>${specialDefense}</td>
                </tr>
                <tr>
                    <td>SPEED:</td>
                    <td>${speed}</td>
                </tr>
            </table>
        `;
}

/** 
 * This function fetches and displays a Pokemon's moves on the page in a styled container based on its type. 
 * @param {number} i - Index of the Pokémon.
*/
function renderPokemonMoves(i) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`)
        .then(response => response.json())
        .then(data => {
            let moves = data['moves'];
            let typ = allPokemonsTyp[i];
            let color = cardsColor(typ);

            let movesContainer = document.getElementById('moves');
            movesContainer.innerHTML = '';

            for (i = 0; i < moves.length; i++) {
                let moveName = moves[i]['move']['name'];
                movesContainer.innerHTML += `
                <div class="move-container ${color}">
                    <p class="move-name">${moveName}</p>
                </div>
                `;
            }
        })
}

/** This function closes the Pokémon container by adding the class display none. */
function closeContainer() {
    document.getElementById('pokemon-container').classList.add('d-none'); 
}

/** This function filters the Pokémon in the input field in the header. */
function searchPokemon() {
    let input = document.getElementById('search-pokemon').value.toLowerCase();

    let result = document.getElementById('pokemon-cards');
    result.innerHTML = '';

    let pokemonFound = false;

    for (let i = 0; i < allPokemonsName.length; i++) {
        let searchPokemon = allPokemonsName[i];
        if (searchPokemon.toLowerCase().includes(input)) {
            showSingleCard(i);
            pokemonFound = true;
        }
    }

    if (!pokemonFound) {
        result.innerHTML = 'Sorry, no Pokémon found.';
    }
}

/** 
 * This function displays the individual Pokémon cards that were filtered with the search function. 
 * @param {number} i - Index of the Pokémon.
*/
function showSingleCard(i) {
    let name = allPokemonsName[i].charAt(0).toUpperCase() + allPokemonsName[i].slice(1);
    let number = `#${String(i + 1).padStart(3, '0')}`;
    let img = allPokemonsImg[i];
    let typ = allPokemonsTyp[i];
    let color = cardsColor(typ);

    document.getElementById('pokemon-cards').innerHTML += `
        <div class="pokedex-card ${color}" onclick="openPokemonDetails(${i})">
            <div class="pokedex-header">
                <h3>${name}</h3>
                <span class="pokedex-number">${number}</span>
            </div>
            <div class="pokedex-typ">${typ}</div>
            <div>
                <img class="pokedex-img" src="${img}">
            </div>
        </div>
    `;
}

/** This function scrolls when you click on the arrow up to top. */
function scrollToTop() {
    window.scrollTo({
        top:0,
        behavior: 'smooth'
    });
}

/** This function loads 20 more Pokémons when you click the load more button.*/
function loadMorePokemons() {
    end += morePokemons;
    loadPokemon();
}