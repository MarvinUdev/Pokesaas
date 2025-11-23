//import des librairie
import { useState } from "react";

function App() {
  //déclaration des useState
  const [pokemons, setPokemons] = useState([]);
  const [team, setTeam] = useState([]);
  const [clickedId, setClickedId] = useState(null);
  const [seenPokemons, setSeenPokemons] = useState([]);

  //Déclaration des fonctions
  async function generatePokemons(reset = false) {
    if (!reset && team.length >= 6) return;

    const newPokemons = [];

    // si reset → on repart sur un tableau vide
    const alreadySeen = reset ? [] : [...seenPokemons];

    while (newPokemons.length < 3) {
      const id = Math.floor(Math.random() * 1025) + 1;

      if (alreadySeen.includes(id)) continue;

      alreadySeen.push(id);

      const response = await fetch(
        `https://tyradex.vercel.app/api/v1/pokemon/${id}`
      );
      const data = await response.json();

      newPokemons.push(data);
    }

    setSeenPokemons(alreadySeen);
    setPokemons(newPokemons);
  }

  function selectPokemon(pokemon) {
    if (team.length >= 6) return;

    setClickedId(pokemon.pokedex_id); // active l’animation
    setTimeout(() => setClickedId(null), 200); // désactive après 0.2 sec

    setTeam([...team, pokemon]);
    generatePokemons();
  }

  return (
    <div>
      <h1>PokéSaaS - Randomizer</h1>
      <p>Jour 2 - Structure prête</p>

      <button onClick={generatePokemons} disabled={team.length >= 6}>
        Générer 3 Pokémon
      </button>
      <button
        onClick={() => {
          generatePokemons(true);
          setTeam([]);
          setSeenPokemons([]);
        }}
        disabled={team.length === 0}
      >
        Réinitialiser la run
      </button>

      <h2>Round : {team.length === 6 ? 6 : team.length + 1} / 6</h2>

      <div>
        {team.length < 6 && (
          <div style={{ display: "flex", gap: "10px" }}>
            {pokemons.map((p) => (
              <div
                key={p.pokedex_id}
                onClick={() => selectPokemon(p)}
                style={{
                  margin: "20px 0",
                  cursor: "pointer",
                  transform:
                    clickedId === p.pokedex_id ? "scale(1.1)" : "scale(1)",
                  transition: "transform 0.2s",
                }}
              >
                <h3>{p.name.fr}</h3>
                <img src={p.sprites.regular} alt={p.name.fr} />

                <p>{p.types.map((t) => t.name).join(" / ")}</p>

                <div>
                  {p.types.map((t) => (
                    <img
                      key={t.name}
                      src={t.image}
                      alt={t.name}
                      style={{ width: "40px", marginRight: "8px" }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <h2>Ton équipe :</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {team.map((t) => (
            <div key={t.pokedex_id} style={{ textAlign: "center" }}>
              <img src={t.sprites.regular} alt={t.name.fr} width="80" />
              <p>{t.name.fr}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
