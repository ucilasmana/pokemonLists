const pokemonListDivREST = document.getElementById('pokemonListREST');
const pokemonListDivGRAPH = document.getElementById('pokemonListGRAPH');
const modal = document.getElementById('modal');
const pokemonName= document.getElementById('pokemon-name');
const pokemonImg = document.getElementById('pokemon-img');
const pokemonTypes= document.getElementById('pokemon-type');
const pokemonAbilities= document.getElementById('pokemon-abilities');
const pokemonMoves= document.getElementById('pokemon-moves');

const closeModal = () =>{
  modal.classList.add('hidden')
  pokemonTypes.innerHTML=""
  pokemonAbilities.innerHTML=""
  pokemonMoves.innerHTML=""
} 

const createDIV = (image, name) =>{
  const pokemonDiv = document.createElement('div');
    pokemonDiv.classList.add("bg-white", "h-28", "rounded-lg", "shadow-xl", "flex", "flex-col", "items-center", "cursor-pointer")    
    pokemonDiv.innerHTML = `
    <div class="flex items-center bg-indigo-200  w-full h-20 rounded-t-lg">
     <img src="${image}" class="w-full h-16" alt="${name}">
    </div>
    <span class="mt-1 text-sm text-center capitalize">${name}</span>`;
  return pokemonDiv
}

const modalDetails=(image, name, abilities, types, moves)=>{
  pokemonName.innerHTML=name
  pokemonImg.src=image
  types.forEach(type=>{
    const span = document.createElement('span');
      span.classList.add('comma')
      span.innerHTML=type
      pokemonTypes.appendChild(span)
    })
    abilities.forEach(ability=>{
      const span = document.createElement('span');
      span.classList.add('comma')
      span.innerHTML=ability
      pokemonAbilities.appendChild(span)
    })
    moves.slice(0, 6).forEach(move=>{
      const span = document.createElement('span');
      span.classList.add('comma')
      span.innerHTML=move
      pokemonMoves.appendChild(span)
    })  
}

function displayPokemonListREST(pokemonList) {
  pokemonList.forEach(pokemon => {
    fetch(pokemon.url)
    .then(response => response.json())
    .then(pokemonData => {  
      let pokeImg= pokemonData.sprites.front_default
      let pokeName= pokemonData.name
      const div = createDIV(pokeImg, pokeName)
      pokemonListDivREST.appendChild(div) 

      div.addEventListener('click', () => { 
      //Modal-Details
      const pokeAbilities= []
      const pokeMoves= []
      const pokeTypes= []
      pokemonData.abilities.forEach(
        ability=>{
            pokeAbilities.push(ability.ability.name)
        })
      pokemonData.moves.forEach(
        move=>{
            pokeMoves.push(move.move.name)
        })
      pokemonData.types.forEach(
        type=>{
            pokeTypes.push(type.type.name)
        })
      modalDetails(pokeImg, pokeName, pokeAbilities, pokeTypes, pokeMoves)
      modal.classList.remove('hidden')
      })
    })
    .catch(error => console.error('Error:', error));
   })
}

function displayPokemonListGraph(pokemonList) {
    pokemonList.forEach(pokemon => {
      let pokeImg=pokemon.pokemon_v2_pokemonsprites[0].sprites.front_default
      let pokeName= pokemon.name
      const div = createDIV(pokeImg, pokeName)
      pokemonListDivGRAPH.appendChild(div)

      div.addEventListener('click', () => {
        const pokeAbilities= []
        const pokeMoves= []
        const pokeTypes= []
        pokemon.pokemon_v2_pokemonabilities.forEach(
          ability=>{
              pokeAbilities.push(ability.pokemon_v2_ability.name)
          })
        pokemon.pokemon_v2_pokemonmoves.forEach(
          move=>{
              pokeMoves.push(move.pokemon_v2_move.name)
          })
        pokemon.pokemon_v2_pokemontypes.forEach(
          type=>{
              pokeTypes.push(type.pokemon_v2_type.name)
          })    
        modalDetails(pokeImg, pokeName, pokeAbilities, pokeTypes, pokeMoves)
        modal.classList.remove('hidden')
      })
      })     
    }

//REST
async function fetchREST(url){
  try{
    const response = await fetch(url)
    const data = await response.json()
    displayPokemonListREST(data.results)
  }
  catch(error)
  {
    console.error('Error:', error)
  }
}
fetchREST('https://pokeapi.co/api/v2/pokemon?limit=15')


//GraphQL
async function fetchGraph(url){
  try{
    const response = await fetch(url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
          query {
            pokemon_v2_pokemon(limit: 15, offset: 15) {
              id
              name
              pokemon_v2_pokemonmoves(limit: 6) {
                pokemon_v2_move {
                  name
                }
              }
              pokemon_v2_pokemontypes(limit: 3){
                pokemon_v2_type {
                  name
                }
              }
              pokemon_v2_pokemonabilities(limit: 3) {
                pokemon_v2_ability {
                  name
                }
              }
              pokemon_v2_pokemonsprites {
                sprites
              }
            }
          }
          `,
        }),
      })
    const data = await response.json()
    displayPokemonListGraph(data.data.pokemon_v2_pokemon)
  }
  catch(error)
  {
    console.error('Error:', error)
  }
}
fetchGraph('https://beta.pokeapi.co/graphql/v1beta')

