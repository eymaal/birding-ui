<script>
    import ModControl from "./ModControl.svelte";
    import MySightings from "./MySightings.svelte";
    import UnapprovedSightings from "./UnapprovedSightings.svelte";
    import UserControl from "./UserControl.svelte";

    let currentTab = 1;    

    let sections = [
        "Unapproved Sightings",
        "My Sightings",
        "User Control",
        "Moderator Control"
    ]

</script>
<div class="tab-container flex justify-center mb-3">
    <select class="select select-bordered w-full max-w-xs md:hidden" bind:value={currentTab}>        
        {#each sections as section, i}
            <option value = "{i+1}">{section}</option>
        {/each}
    </select>
    <div class="tabs small-tabs max-md:hidden">
        {#each sections as section, i}
            <button class="tab tab-bordered {currentTab==i+1? "tab-active" : ""}" on:click={() => currentTab = i+1}>{section}</button>     
        {/each}        
    </div>
</div>

<div class="unapproved-sighting-container {currentTab==1? "" : "hidden"}">
    <UnapprovedSightings/>
</div>
<div class="user-control-container {currentTab==2? "" : "hidden"}">
    <MySightings/>
</div>
<div class="user-control-container {currentTab==3? "" : "hidden"}">
    <UserControl/>
</div>
<div class="user-control-container {currentTab==4? "" : "hidden"}">
    <ModControl/>
</div>

<style>
    @media not all and (min-width: 600px) {
        .small-tabs {
            width: 100%;
            height: 2.5rem;
            gap: 0;
            flex-shrink: 0;
            flex-direction: column;
            align-content: flex-start;
            overflow-x: scroll;
        }
    }
</style>