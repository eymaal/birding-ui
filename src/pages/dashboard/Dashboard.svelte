<script>
    import showNavbar from "../../showNavbar";
    import Admin from "./Admin.svelte";
    import Moderator from "./Moderator.svelte";
    import User from "./User.svelte";
    import AdminSettings from "./AdminSettings.svelte";
    import { fly } from "svelte/transition";
    import { push } from "svelte-spa-router";
    showNavbar.update((value) => true);
    
    if(!localStorage.getItem('token')) push('/home');
    let userType = JSON.parse(localStorage.getItem('userType'));
    
    let userTypeClass = () => {
        if(userType === "USER") return "badge-accent";
        else if (userType === "MODERATOR") return "badge-secondary";
        else if (userType === "ADMIN") return "badge-primary";
        else return "";
    }
    
</script>

<div id = "profile" class="card w-full bg-base-100 inv-shadow-xl bottom-0 fixed z-20" transition:fly="{{ y: 100, duration: 200 }}">
    <div class="card-body relative">
        <h2 class="card-title justify-between">
            Hi {JSON.parse(localStorage.getItem('name'))}            
            <div class="badge {userTypeClass()}">{userType}</div>
        </h2>
        {#if userType=="USER"}
            <User/>
        {:else if userType == "MODERATOR"}
            <Moderator/>
        {:else if userType == "ADMIN"}
            <AdminSettings/>
            <Admin/>
        {:else}
            <div></div>
        {/if}        
    </div>
</div>

<style>
    .inv-shadow-xl {
        box-shadow: 0px -20px 25px 5px rgba(0,0,0,0.10);;
    }
    .half-height-map {
        height: 50vh !important;
    }
    #profile {
        min-height: 51vh;;
    }
</style>