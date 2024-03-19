<script>
    import { onMount } from "svelte";
    
    let LeaderBoardEmoji = ["🥇", "🥈", "🥉"];
    let emoji = "🔭👤"; 
    let userStats = [];  
    let ready = false; 

    onMount( async () => {
        fetchBirdLeaderBoard();
    });

    let fetchBirdLeaderBoard = async () => {
        await fetch('http://localhost:8080/api/v1/userStats',{
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
        <div class="menu-title self-start">User Leaderboard</div>
        <div class="stats max-sm:stats-vertical stats-horizontal shadow-lg max-w-fit"> 
            {#each userStats as stat, i}
                <div class="stat">
                    <div class="stat-title">{LeaderBoardEmoji[i]} #{i+1}</div>
                    <div class="stat-value max-sm:flex max-sm:justify-between">
                        <span>{stat.submissions}</span>
                        <span>{emoji}</span>
                    </div>
                    <div class="stat-title max-sm:hidden">{stat.user.name}</div>
                    <div class="stat-desc">{stat.user.username}</div>
                </div>
            {/each}
        </div>
    </div>
{/if}