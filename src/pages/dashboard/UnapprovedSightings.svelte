<script>
    import { onMount } from "svelte";
    import MessageStore from "../../MessageStore";

    let userName = JSON.parse(localStorage.getItem('user'));
    let ready = false;
    let unmoderratedSightings = [];
    let approvalList = [];
    let disableApproveBtn = true;
    let imgSrc = "";
    let imgModal;
    let discardModal;
    let modalSighting = {
        observer: "",
        bird: "",
        date: "",
        lat: "",
        lng: "",
        quantity: ""
    };
    let msg={
		content: "",
		type: "",
		action: "",
		path: ""
	}

    let fetchUnModeratedSightings = async () => {
        await fetch('http://localhost:8080/api/unmoderratedSightings?userName='+userName,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-type': 'application/json'
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => { 
            unmoderratedSightings = response;  
            if(Array.isArray(unmoderratedSightings)) {
                unmoderratedSightings.forEach(sighting => {
                    sighting.checked = false;
                });        
                if(unmoderratedSightings.length>0) {
                    ready = true;            
                }
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    onMount(async () => {
        fetchUnModeratedSightings();     
    })

    let approveSelected = () => {
        approvalList = [];
        unmoderratedSightings.filter((sighting) => sighting.checked===true).forEach((sighting) => approvalList.push(sighting.id));
        approve();
    }

    let approveAll = () => {
        approvalList = [];
        unmoderratedSightings.forEach((sighting) => approvalList.push(sighting.id));
        approve();
    }

    let approve = async () => {
        await fetch('http://localhost:8080/api/approveSightings?userName='+userName,{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(approvalList)
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => { 
            if(response.message) {
                msg.content = response.message;
                msg.type = "alert-error";
            } else {
                msg.content = "Sightings were approved";
                msg.type = "alert-success";
                fetchUnModeratedSightings();
            }
        })
        .catch((error) => {
            console.log(error);
        })        
        .finally(() => {
            MessageStore.update(() => msg);
        })
    }

    let confirmDiscard = () => {
        discardModal.showModal();
    }

    let discardSighting = async () => {
        let discardList = [];
        unmoderratedSightings.filter((sighting) => sighting.checked===true).forEach((sighting) => discardList.push(sighting.id));
        await fetch('http://localhost:8080/api/discardSightings?userName='+userName,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(discardList)
        })
        .then((response) => {
            if(response.message) {
                msg.content = response.message;
                msg.type = "alert-error";
                return response.json();
            } else {
                msg.content = "Sightings were discarded";
                msg.type = "alert-success";
                fetchUnModeratedSightings();
                if(unmoderratedSightings.length===0) ready = false;
            }
        })
        .then((response) => { 
            if(response?.message) {
                msg.content = response.message;
                msg.type = "alert-error";
            }
        })
        .catch((error) => {
            console.log(error);
        })        
        .finally(() => {
            MessageStore.update(() => msg);
        })
    }

    let showImageModal = (src, sighting) => {
        imgSrc = src;
        modalSighting.bird = sighting.bird.commonName;
        modalSighting.observer = sighting.creator.username;
        modalSighting.lat = sighting.latitude;
        modalSighting.lng = sighting.longitude;
        modalSighting.date = sighting.date.toString().substr(0, 10);
        modalSighting.quantity = sighting.quantity;
        imgModal.showModal();
    } 

    $:{
        disableApproveBtn = unmoderratedSightings.filter((sighting) => sighting.checked===true).length===0;
    }

</script>

{#if ready}
    <div class="btn-container flex flex-row gap-2">
        <button class="btn btn-primary {disableApproveBtn? "btn-disabled" : ""}" on:click={approveSelected}>Approve</button>
        <button class="btn btn-neutral" on:click={approveAll}>Approve All</button>
        <button class="btn btn-warning {disableApproveBtn? "btn-disabled" : ""}" on:click={confirmDiscard}>Delete</button>
    </div>
    <div class="flex h-full w-full justify-center">
        <div class="overflow-x-auto overflow-scroll calc-height max-height-40 w-full pt-2 pb-2">
            <table class="table table-pin-rows table-pin-cols max-md:hidden" id = "sightingTable">
                <thead>
                    <tr class = "text-secondary">
                        <td/>
                        <td>Bird Name</td>
                        <td>Date</td>
                        <td>Latitude</td>
                        <td>Longitude</td>
                        <td>Quantity</td>
                        <td>Observer</td>
                        <td>Image</td>
                    </tr>
                </thead>
                <tbody>
                    {#each unmoderratedSightings as sighting}
                        <tr class = "{sighting.checked? "bg-base-200" : ""}">
                            <td><input type="checkbox" bind:checked={sighting.checked} class="checkbox" /></td>
                            <td>{sighting.bird.commonName}</td>
                            <td>{sighting.date.toString().substr(0, 10)}</td>
                            <td>{sighting.latitude}</td>
                            <td>{sighting.longitude}</td>
                            <td>{sighting.quantity}</td>
                            <td>{sighting.creator.username}</td>
                            <td><button on:click={() => showImageModal(sighting.imageRef, sighting)} class="btn btn-link {sighting.imageRef?"":"hidden"}">View</button></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <div class="card-container flex p-2 pb-4 gap-2 w-full md:hidden">
                {#each unmoderratedSightings as sighting}
                    <div class="card card-bordered border {sighting.checked? "border-neutral" : ""} card-compact bg-base-100 shadow-lg w-80">        
                        <div class="card-body justify-between"> 
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div class="contents {sighting.imageRef? "cursor-pointer" : ""}" on:click={() => {sighting.imageRef? showImageModal(sighting.imageRef, sighting) : ""}}>  
                                <div class="flex justify-between gap-4">
                                    <h3 class="card-title">{sighting.bird.commonName}</h3>
                                    <input type="checkbox" bind:checked={sighting.checked} class="checkbox" on:click|stopPropagation={()=>{}}/>
                                </div>
                                <div class = "flex justify-between gap-4">
                                    <div class="sighting-label left text-secondary">Date</div>
                                    <div class="sighting-label right">{sighting.date.toString().substr(0, 10)}</div>
                                </div>
                                <div class = "flex justify-between gap-4">
                                    <div class="sighting-label left text-secondary">Latitude</div>
                                    <div class="sighting-label right">{sighting.latitude}</div>
                                </div>
                                <div class = "flex justify-between gap-4">
                                    <div class="sighting-label left text-secondary">Longitude</div>
                                    <div class="sighting-label right">{sighting.longitude}</div>
                                </div>
                                <div class = "flex justify-between gap-4">
                                    <div class="sighting-label left text-secondary">Quantity</div>
                                    <div class="sighting-label right">{sighting.quantity}</div>
                                </div>
                                <div class = "flex justify-between gap-4">
                                    <div class="sighting-label left text-secondary">Observer</div>
                                    <div class="sighting-label right">{sighting.creator.username}</div>
                                </div>                                 
                            </div>
                        </div>
                    </div>         
                {/each}
            </div>
        </div>
    </div>
    
    <dialog id="imgModal" bind:this="{imgModal}" class="modal">
        <form method="dialog" class="modal-box flex flex-col gap-4 w-auto">
            <h3 class="font-bold text-lg flex justify-between">{modalSighting.bird}
                <button class="btn btn-sm btn-circle btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </h3>
            <div class="modal-container gap-4 flex flex-col pl-4 pr-4 max-h-80 overflow-y-scroll">
                <div class = "flex justify-between gap-4">
                    <div class="sighting-label left text-secondary">Date</div>
                    <div class="sighting-label right">{modalSighting.date}</div>
                </div>
                <div class = "flex justify-between gap-4">
                    <div class="sighting-label left text-secondary">Latitude</div>
                    <div class="sighting-label right">{modalSighting.lat}</div>
                </div>
                <div class = "flex justify-between gap-4">
                    <div class="sighting-label left text-secondary">Longitude</div>
                    <div class="sighting-label right">{modalSighting.lng}</div>
                </div>
                <div class = "flex justify-between gap-4">
                    <div class="sighting-label left text-secondary">Quantity</div>
                    <div class="sighting-label right">{modalSighting.quantity}</div>
                </div>
                <div class = "flex justify-between gap-4">
                    <div class="sighting-label left text-secondary">Observer</div>
                    <div class="sighting-label right">{modalSighting.observer}</div>
                </div>       
                <img class = "rounded-xl" src = "{"https://storage.googleapis.com"+ imgSrc}" alt = ""/>    
                <div class="carousel rounded-box">
                    <div class="carousel-item w-full">    
                    </div>
                </div>
            </div>            
          </form>
    </dialog>

    <dialog id="discardModal" class="modal" bind:this={discardModal}>
        <form method="dialog" class="modal-box flex flex-col gap-4 w-auto">
            <h4 class="text-lg">Are you sure you want to discard?</h4>
            <div class="modal-action">                
                <button class="btn btn-primary" on:click={discardSighting}>Discard</button>
                <button class="btn">Cancel</button>
            </div>
        </form>
    </dialog>

{:else}
    <div class="h-full w-full flex justify-center items-center">
        <div class="card w-96 bg-neutral text-neutral-content">
            <div class="card-body text-neutral-content">
                <h2 class="card-title">Unapproved Sightings</h2>
                <p>There are 0 sightings pending for approval.</p>
            </div>
        </div>
    </div>
{/if}


<style>
    .sighting-label {
        font-size: 0.875rem;
    }
    .max-height-40 {
        max-height: 40vh;
    }
    .max-h-80 {
        max-height: 80vh;
    }
</style>