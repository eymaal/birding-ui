<script>
    import { blur } from "svelte/transition";
    import showMap from "../../showMap";
    import showNavbar from "../../showNavbar";
    import MessageStore from "../../MessageStore";
    import { onMount } from "svelte";
    import LoginReminder from "../forum/LoginReminder.svelte";

    showMap.update((value) => false);
    showNavbar.update((value) => true);

    let token = JSON.parse(localStorage.getItem('token'));
    let content = "";
    let ready = false;
    let currentStep = 0;
    let msg = {
		content: "",
		type: "",
		action: "",
		path: "",
	};

    onMount( async () => {
        // JSON hosted by ajc99 with text for guide
        await fetch("https://api.jsonbin.io/v3/b/64f90553e4033326cbd33e2a")
        .then(response => {
            if(!response.ok)
                throw new Error(`Network Error! Code ${response.status}`);
            else {
                return response.json();
            }
        })
        .then(response => {
            content = response.record;
            ready = true;
        })
        .catch(error => {
            msg.type = "alert-error";
            msg.content = "error";
        })
        .finally(() => {
			MessageStore.update(() => msg);
		})
    })
</script>

<div class="guide-container gap-4 flex w-screen h-calc pt-20 justify-center items-center flex-col" transition:blur={{ amount: 10 }}>
    {#if token}
        {#if ready}            
            <ul class="steps steps-horizontal mt-4 mb-4 max-lg:ml-4 max-lg:mr-4 max-sm:hidden">
                {#each content as record, i}
                    {#if i!=0 && i!=content.length-1}
                        <li class="step {currentStep>=i? "step-primary" : ""}"></li>
                    {/if}
                {/each}
            </ul>
            <div class="justify-center items-center text-xl sm:hidden mt-4 mb-4 avatar-group">
                <div class="avatar placeholder">
                    <div class="w-12 bg-primary text-primary-content">
                        {#if currentStep==0 || currentStep==content.length-1}
                            <span>⭐</span>
                        {:else}
                            <span>{currentStep}</span>
                        {/if}
                    </div>
                </div>
            </div>
            <div class="carousel-container grow flex justify-center items-center relative w-full">
                <div class="carousel carousel-center max-w-90 p-4 space-x-4 bg-neutral rounded-box max-lg:max-w-md">      
                    <div class="carousel-item bg-neutral-content text-neutral p-4 max-w-md w-fit rounded-box flex-col gap-4">
                        <div class="emoji flex justify-center stroke-neutral fill-neutral">
                            {@html content[currentStep].symbol}
                        </div>
                        <div class="card-title">
                            {#if currentStep!=0 && currentStep!=content.length-1}{currentStep}. {/if}{content[currentStep].title}
                        </div>
                        <div class="content">{content[currentStep].content}</div>
                    </div>
                    <div class="!ml-0 absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <button on:click={()=>{currentStep--}} class="btn btn-circle btn-secondary {currentStep==0? "btn-disabled" : ""}">❮</button> 
                        <button on:click={()=>{currentStep++}} class="btn btn-circle btn-secondary {currentStep==content.length-1? "btn-disabled" : ""}">❯</button> 
                    </div>
                </div>        
            </div>
        {/if}
    {:else}
        <LoginReminder pageTitle="Birding Guide"/>
    {/if}
</div>

<style>
    .guide-container {
        height: 100vh;
        background-color: #ededed;
        background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%236e0b75' fill-opacity='0.09' fill-rule='evenodd'/%3E%3C/svg%3E");
        position: absolute;
    }
    .max-w-90 {
        max-width: calc(90vw - 2rem);
    }
</style>

