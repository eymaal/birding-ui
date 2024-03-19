<script>
    import { onMount } from "svelte";
    
    let userName = JSON.parse(localStorage.getItem('user'));
    let keys = ["SIGHTING", "USER", "MODERATOR", "ADMIN"];
    let emojis = ["🔭", "👤", "🕵🏽‍♂️", "🧑🏽‍💻"]; 
    let userStats = [];  
    let ready = false; 

    onMount( async () => {
        fetchBirdLeaderBoard();
    });

    let fetchBirdLeaderBoard = async () => {
        await fetch('http://localhost:8080/api/privilegedStats?username='+userName,{
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-type': 'application/json'
            },
            method: 'GET',
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => { 
            userStats = response;  
            ready = true;
        })
        .catch((error) => {
            console.log(error);
        })
    }
</script>

{#if ready}   
    <div class="bird-stat-container">
        <div class="menu-title self-start">Privileged Stats</div>
        <div class="stats max-sm:stats-vertical stats-horizontal shadow-lg max-w-fit"> 
            {#each keys as key, i}
                <div class="stat">
                    <div class="stat-title">{`${key}S`}</div>
                    <div class="stat-value max-sm:flex max-sm:justify-between text-secondary">
                        <span>{userStats[key]}</span>
                        <span>{emojis[i]}</span>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}