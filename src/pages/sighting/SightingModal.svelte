<script>
    import { push } from "svelte-spa-router";
    import AddSighting from "./AddSighting.svelte";
    import Location from "../../location";

    let sightingModal;    
    let loc;
    let isLoggedIn;
    Location.subscribe((location) => {loc = location});
    const redirectToLogin = () => {
        sightingModal.close();
        push('/login');
    }
    const openModal = () => {        
        isLoggedIn = localStorage.getItem('token')!==null;
        sightingModal.showModal();
    }
</script>
<div class="tooltip tooltip-left tooltip-primary " data-tip="Add Sighting">
    <button class="btn btn-circle btn-primary" on:click={openModal}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 25 25" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12H12M12 12H18M12 12V18M12 12V6" /></svg>
    </button>
</div>

<dialog id="sightingModal" class="modal modal-bottom sm:modal-middle" bind:this={sightingModal}>
    <form method="dialog" class="modal-box">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        {#if isLoggedIn}
            {#if loc.lat!="" && loc.lng!=""}
                <AddSighting/>
            {:else}
            <h3 class="font-bold text-lg">Pick Location</h3>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <p class="py-4">You need to pick a location before adding a sighting. Click on the 'X' icon and drop a marker on the required location.</p>                    
            {/if}
        {:else}
            <h3 class="font-bold text-lg">Log In</h3>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <p class="py-4">You need to be logged in to add a sighting. Click <a on:click={redirectToLogin} class="link link-accent">here</a> to log in.</p>
        {/if}
    </form>
    <form method="dialog" class="modal-backdrop">
        <button>close</button> 
    </form>
</dialog>