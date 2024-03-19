<script>
    import { onMount } from "svelte";
    import showMap from "../../showMap";
    import { fly } from "svelte/transition";
    import AddBird from "./AddBird.svelte";
    showMap.update((value) => false);
    let birds = [];
    let ready = false;
    let addModal;
    let userType = JSON.parse(localStorage.getItem('userType'));

    let openBirdModal = () => {
        addModal.showModal();
    }

    let fetchBirdSpecies = async () => {
        const res = await fetch('http://localhost:8080/api/v1/birds',{
            method: 'GET',
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            birds = response;
            ready = true;
        })
        .catch((error) => {
            console.log(error);
        })
    }

    onMount(async () => {
        fetchBirdSpecies();
    })
</script>
{#if ready}
    <button class="hidden btn" on:click={fetchBirdSpecies} id = "fetch-birds">Update</button>
    <div class="flex h-full w-full p-4 justify-center mt-16 realtive" transition:fly="{{ y: 100, duration: 400 }}">
        <div class="overflow-x-auto overflow-scroll calc-height">
            <table class="table table-pin-rows table-pin-cols max-md:hidden">
                <thead>
                    <tr class = "text-secondary">
                        <td/>
                        <td>Common Name</td>
                        <td>Scientific Name</td>
                        <td>Family</td>
                        <td>Classification</td>
                        <td>Order</td>
                        <td>Avibase URL</td>
                    </tr>
                </thead>
                <tbody>
                    {#each birds as bird, i}
                        <tr>
                            <td>{i + 1}</td>
                            <td>{bird.commonName}</td>
                            <td>{bird.scientificName}</td>
                            <td>{bird.family}</td>
                            <td>{bird.classification}</td>
                            <td>{bird.taxonomicGrouping}</td>
                            <td class = "{bird.avibase? "" : "hidden"}"><a target="_blank" class="btn btn-sm btn-outline btn-secondary" href="{bird.avibase}">Details</a></td>
                        </tr>                    
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="card-container grid gap-4 w-full md:hidden">
            {#each birds as bird}
                <div class="card bg-base-100 shadow-xl w-80">        
                    <div class="card-body justify-between">
                        <div class="contents">                    
                            <h3 class="card-title">{bird.commonName}</h3>            
                            <div class="flex flex-col gap-4">
                                <div>
                                    <div class="bird-label left text-secondary">Common Name</div>
                                    <div class="bird-label right">{bird.commonName}</div>
                                </div>
                                <div>
                                    <div class="bird-label left text-secondary">Scientific Name</div>
                                    <div class="bird-label right">{bird.scientificName}</div>
                                </div>
                                <div>
                                    <div class="bird-label left text-secondary">Family</div>
                                    <div class="bird-label right">{bird.family}</div>
                                </div>
                                <div>
                                    <div class="bird-label left text-secondary">Classification</div>
                                    <div class="bird-label right">{bird.classification}</div>
                                </div>
                                <div>
                                    <div class="bird-label left text-secondary">Order</div>
                                    <div class="bird-label right">{bird.taxonomicGrouping}</div>
                                </div>
                            </div>
                        </div>
                        <div class="card-actions justify-end">
                            <a target="_blank" class="btn btn-secondary" href="{bird.avibase}">Avibase</a>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        <div class = "btn-container fixed right-0 bottom-0 z-10 m-2 mr-3 mb-5 flex flex-col gap-2 {userType=="ADMIN" || userType=="MODERATOR"? "" : "hidden"}">
            <div class="tooltip tooltip-left tooltip-primary " data-tip="Add Species">
                <button class="btn btn-circle btn-primary" on:click={openBirdModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 25 25" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12H12M12 12H18M12 12V18M12 12V6" /></svg>
                </button>
            </div>
        </div>    
    </div>
{:else}
    <div class="h-screen w-screen flex justify-center content-center">
        <span class="loading loading-infinity w-16 "></span>
    </div>
{/if}

<dialog id="addBirdModal" bind:this={addModal} class="modal modal-bottom sm:modal-middle">
    <AddBird/>
</dialog>

<style>
    .bird-label {
        font-size: 0.875rem;
    }
    .card-container {
        grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    }
    .card-container .card {
        justify-self: center;
    }
    .calc-height {
        height: calc(100vh - 64px);
    }
</style>


