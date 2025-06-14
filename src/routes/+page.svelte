<script>
  import { onMount } from "svelte";
  let remaining = 0;
  let full = false;

  onMount(async () => {
    const res = await fetch("/api/remaining");
    const data = await res.json();

    remaining = data.remaining;
    full = remaining <= 0;
  });
</script>

<h1>🎧 Nuevo single de Duki 🔥</h1>

{#if full}
  <p style="color: red; font-size: 1.2rem;">
    😢 El cupo está lleno. ¡Gracias por tu interés!
  </p>
{:else}
  <p style="font-size: 1.2rem;">
    🚨 Quedan <strong>{remaining}</strong> cupos disponibles.
  </p>
{/if}

{#if full}
  <a href="/accessed"><button>Ver detalles</button></a>
{:else}
  <a href="/access-preview"><button>Escuchar preview</button></a>
{/if}

<style>
  button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    background-color: #ff4eda;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #e03ec7;
  }
</style>
