<script>
    import { onMount } from "svelte";
    
    let birdLeaderBoardEmoji = ["🥇", "🥈", "🥉"];
    let emoji = "🐦"; 
    let birdStats = [];  
    let ready = false; 

    onMount( async () => {
        fetchBirdLeaderBoard();
    });

    let fetchBirdLeaderBoard = async () => {
        await fetch('http://localhost:8080/api/v1/birdStats',{
            method: 'GET',
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => { 
            birdStats = response;  
            ready = true;
        })
        .catch((error) => {
            console.log(error);
        })
    }
</script>

{#if ready}   
    <div class="bird-stat-container">
        <div class="menu-title self-start">Bird Leaderboard</div>
        <div class="stats max-sm:stats-vertical stats-horizontal shadow-lg max-w-fit"> 
            {#each birdStats as birdStat, i}
                <div class="stat">
                    <div class="stat-title">{birdLeaderBoardEmoji[i]} #{i+1}</div>
                    <div class="stat-value max-sm:flex max-sm:justify-between">
                        <span>{birdStat.quantity}</span>
                        <span>{emoji}</span>
                    </div>
                    <div class="stat-title max-sm:stat-desc">{birdStat.bird.commonName}</div>
                    <div class="stat-desc max-sm:hidden">{birdStat.bird.scientificName}</div>
                </div>
            {/each}
        </div>
    </div>
{/if}