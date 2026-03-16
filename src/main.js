// ─── Year en el footer ───────────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear()

// ─── Colores por tipo de Pokémon ──────────────────────────────────────────────
const TYPE_COLORS = {
  normal:   '#9E9E9E', fire:     '#F4511E', water:    '#2196F3',
  electric: '#FFC107', grass:    '#4CAF50', ice:      '#80DEEA',
  fighting: '#C62828', poison:   '#8E24AA', ground:   '#A1887F',
  flying:   '#7E57C2', psychic:  '#E91E63', bug:      '#827717',
  rock:     '#78909C', ghost:    '#4527A0', dragon:   '#1565C0',
  dark:     '#37474F', steel:    '#546E7A', fairy:    '#D81B60',
}

// ─── Nombres de stats en español ─────────────────────────────────────────────
const STAT_NAMES = {
  hp:               'HP',
  attack:           'Ataque',
  defense:          'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense':'Def. Esp.',
  speed:            'Velocidad',
}

// ─── Elementos del DOM ────────────────────────────────────────────────────────
const btn           = document.getElementById('btn-surprise')
const btnText       = document.getElementById('btn-text')
const placeholder   = document.getElementById('pokemon-placeholder')
const display       = document.getElementById('pokemon-display')
const pokemonId     = document.getElementById('pokemon-id')
const pokemonImg    = document.getElementById('pokemon-img')
const pokemonName   = document.getElementById('pokemon-name')
const pokemonTypes  = document.getElementById('pokemon-types')
const pokemonStats  = document.getElementById('pokemon-stats')

// ─── Fetch Pokémon aleatorio ──────────────────────────────────────────────────
async function fetchRandomPokemon() {
  const MAX_POKEMON = 898
  const id = Math.floor(Math.random() * MAX_POKEMON) + 1

  btn.disabled = true
  btnText.textContent = '⏳ Buscando...'

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    if (!res.ok) throw new Error('Error al obtener Pokémon')
    const data = await res.json()

    renderPokemon(data)
  } catch (err) {
    console.error(err)
    btnText.textContent = '⚠ Inténtalo de nuevo'
  } finally {
    btn.disabled = false
    btnText.textContent = '↺ Otro Pokémon'
  }
}

// ─── Renderizar Pokémon ───────────────────────────────────────────────────────
function renderPokemon(data) {
  // ID y nombre
  pokemonId.textContent   = `#${String(data.id).padStart(3, '0')}`
  pokemonName.textContent = capitalize(data.name)

  // Imagen (artwork oficial o sprite fallback)
  const artwork = data.sprites.other?.['official-artwork']?.front_default
               || data.sprites.front_default
  pokemonImg.src = artwork
  pokemonImg.alt = data.name

  // Tipos
  pokemonTypes.innerHTML = data.types.map(t => {
    const type  = t.type.name
    const color = TYPE_COLORS[type] || '#888'
    return `<span class="type-badge" style="background:${color}">${capitalize(type)}</span>`
  }).join('')

  // Stats
  pokemonStats.innerHTML = data.stats.map(s => {
    const name  = STAT_NAMES[s.stat.name] || s.stat.name
    const val   = s.base_stat
    const pct   = Math.min(Math.round((val / 255) * 100), 100)
    return `
      <div class="stat-row">
        <span class="stat-label">${name}</span>
        <span class="stat-val">${val}</span>
        <div class="stat-bar-bg">
          <div class="stat-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>`
  }).join('')

  // Mostrar card
  placeholder.style.display = 'none'
  display.style.display     = 'flex'

  // Animación de entrada
  display.classList.remove('pop-in')
  void display.offsetWidth
  display.classList.add('pop-in')
}

// ─── Utils ────────────────────────────────────────────────────────────────────
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// ─── Event listeners ──────────────────────────────────────────────────────────
btn.addEventListener('click', fetchRandomPokemon)