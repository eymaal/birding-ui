<script>
    import { onMount } from "svelte";

    let ready = false;
    let userSightings = [];
    let userName = JSON.parse(localStorage.getItem('user'));
    let userType = JSON.parse(localStorage.getItem("userType"));
    onMount(async () => {
        const res = await fetch("http://localhost:8080/api/userSightings?userName="+userName, {
			method: "GET",
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-type': 'application/json'
            }
		})
        .then((response) => {
            return response.json();
        })
        .then((response) => {          
            userSightings = response;
            ready = true;
        })
        .catch((error) => {
            console.log(error);
        })
    });

</script>


<div class="user-container flex h-full justify-center items-center">
    {#if ready}
        <div class="flex h-full w-full justify-center">
            <div class="overflow-x-auto overflow-scroll calc-height max-height-40">
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
                            {#if userType == "ADMIN" || userType == "MODERATOR"}
                                <td>Approver</td>
                            {/if}
                        </tr>
                    </thead>
                    <tbody>
                        {#each userSightings as sighting, i}
                            <tr class = "{sighting.checked? "bg-base-200" : ""}">                                
                                <td>{i+1}</td>
                                <td>{sighting.bird.commonName}</td>
                                <td>{sighting.date.toString().substr(0, 10)}</td>
                                <td>{sighting.latitude}</td>
                                <td>{sighting.longitude}</td>
                                <td>{sighting.quantity}</td>
                                <td>{sighting.creator.username}</td>
                                {#if userType == "ADMIN" || userType == "MODERATOR"}
                                    <td>{sighting.approver?sighting.approver:"Auto-Approved"}</td>
                                {/if}
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div class="card-container flex p-2 pb-4 gap-2 w-full md:hidden">
                    {#each userSightings as sighting}
                        <div class="card card-bordered border {sighting.checked? "border-neutral" : ""} card-compact bg-base-100 shadow-lg w-80">        
                            <div class="card-body justify-between">
                                <div class="contents">  
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
                                    {#if userType == "ADMIN" || userType == "MODERATOR"}
                                        <div class = "flex justify-between gap-4">
                                            <div class="sighting-label left text-secondary">Approver</div>
                                            <div class="sighting-label right">{sighting.approver? sighting.approver : "N.A"}</div>
                                        </div>        
                                    {/if}
                                </div>
                            </div>
                        </div>         
                    {/each}
                </div>
            </div>
        </div>
    {:else}
        <div class="card w-96 bg-error text-primary-content">
            <div class="card-body text-error-content">
                <h2 class="card-title">0 Sightings added</h2>
                <p>You have not added any sightings yet.</p>
            </div>
        </div>
    {/if}
</div>