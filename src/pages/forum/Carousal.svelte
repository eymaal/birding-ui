<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import NewPost from "./NewPost.svelte";

    let ready = false;
    let userName = JSON.parse(localStorage.getItem('user'));
    let postModal;
    let posts = [];
    
    let openModal = () => {
        postModal.showModal();
    }

    let fetchPosts = async () => {
        const res = await fetch('http://localhost:8080/api/posts?userName='+userName,{
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
            posts = response;
            ready = true;
        })
        .catch((error) => {
            console.log(error);
        })
    }

    onMount( async () => {
        fetchPosts();
    })
</script>

{#if ready}
    {#if posts.length>0}
        <div class="carousel-container">
            <div class="carousel carousel-center max-w-90 p-4 space-x-4 bg-neutral rounded-box" transition:fly="{{ y: 100, duration: 200 }}">
                {#each posts as post}
                <div class="carousel-item">
                    <div class="post-container text-amber-50 relative flex flex-col md:flex-row gap-4">
                        <img src="https://storage.googleapis.com{post.imageRef}" alt = "" class="rounded-box" />
                        <div class="post-text flex w-56 justify-center h-full p-2 flex-col md:justify-between md:pt-8 md:pb-5">
                            <div class = "mb-2">
                                <h3 class="title">{post.title}</h3>
                                <span class = "author text-sm text-accent">{post.author}</span>
                            </div>
                            <div class = "text-sm max-w-prose flex flex-row sm:flex-col max-w-60">{post.content}</div>  
                            <div class="tags max-md:hidden opacity-50">{post.tags}</div>                  
                        </div>
                    </div>
                </div> 
                {/each}
            </div>
        </div>
    {:else}
        <div class="card-container p-12">
            <div class="card shadow-xl bg-neutral text-neutral-content" transition:fly="{{ y: 100, duration: 200 }}">
                <div class="card-body items-center text-center">
                    <h2 class="card-title">:(</h2>
                    <p>There are no posts yet!</p>
                </div>
            </div>
        </div>
    {/if}
    <div class="btn-container absolute right-0 bottom-0 z-10 m-2 mb-5 flex flex-col gap-2">
        <button class="btn rounded-full btn-primary max-md:hidden" on:click={openModal}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 25 25" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12H12M12 12H18M12 12V18M12 12V6" /></svg>New Post
        </button>
        <div class="tooltip tooltip-left tooltip-primary md:hidden" data-tip="New Post">
            <button class="btn btn-circle btn-primary" on:click={openModal}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 25 25" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12H12M12 12H18M12 12V18M12 12V6" /></svg>
            </button>
        </div>
    </div>
{:else}
    <div class="h-screen w-screen flex justify-center content-center">
        <span class="loading loading-infinity w-16 "></span>
    </div>
{/if}
<div class="tooltip tooltip-left tooltip-accent hidden" data-tip="Reload Forum">
    <button id = "reloadForum" class="btn btn-circle btn-accent" on:click={fetchPosts}>
        <svg class = "h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.61061 20 7.46589 18.9525 6 17.2916M9 17H6V17.2916M18.2002 4V6.94416M18.2002 6.94416V6.99993L15.2002 7M6 20V17.2916" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
    </button>
</div>

<dialog id="newPostModal" bind:this={postModal} class="modal modal-bottom sm:modal-middle">
    <NewPost/>
</dialog>
    
    <style>
    .max-w-90 {
        max-width: 90vw;
    }
    
</style>