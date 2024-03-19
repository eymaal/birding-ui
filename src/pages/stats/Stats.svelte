<script>
    import BirdStats from "./BirdStats.svelte";
    import PrivilegedStats from "./PrivilegedStats.svelte";
    import UserStats from "./UserStats.svelte";
    import { fly } from "svelte/transition";

    let userType = JSON.parse(localStorage.getItem('userType'));

    let resetNavbarZindex = () => {
        document.querySelector('.navbar').classList.add('z-50');
    }
    resetNavbarZindex();
</script>

<div class="stat-container card bg-base-100 w-screen bottom-0 absolute z-20 bg-pattern p-6 inv-shadow-xl" transition:fly="{{ y: 100, duration: 200 }}">
    <div class="card-title self-center">Statistics</div>
    <div class="stat-container max-h-bar overflow-y-scroll w-full flex flex-col items-center gap-4 pb-4 max-sm:flex-row max-sm:justify-around lg:flex-wrap lg:flex-row lg:justify-center max-sm:items-start max-sm:flex-wrap">    
        <BirdStats/>
        <UserStats/>
        {#if userType=="MODERATOR" || userType=="ADMIN"}
            <PrivilegedStats/>
        {/if}
    </div>
</div>

<style>
    .max-h-bar {
        max-height: calc(100vh - 10rem);
    }
    .inv-shadow-xl {
        box-shadow: 0px -20px 25px 5px rgba(0,0,0,0.10);
    }
</style>