<script>
    import { pop, push } from 'svelte-spa-router';
    import { fly } from 'svelte/transition';
    import Messagestore from '../../MessageStore';

    const description ="Enter your email id to receive your new password.";
    let email = "";

    let msg={
        content: "",
        type: "",
        action: "",
        path: ""
    }

    let goToLogin = () => {
        pop();
    }

    async function confirmPassword(){
        //call backend method to check if email exists.
    }
</script>
  
<div class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col lg:flex-row-reverse" transition:fly="{{ y: 100, duration: 200 }}">
        <div class="text-center lg:text-left">
        <h1 class="text-5xl font-bold">Birding</h1>
        <h4 class="text-2xl ">with Google Maps</h4>
        <p class="py-6">{description}</p>
        </div>
        <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div class="card-body">
                <form on:submit|stopPropagation|preventDefault={confirmPassword} class="contents">
                    <div class="form-control">
                        <label for="email" class="label">
                        <span class="label-text">Email</span>
                        </label>
                        <input type="text" placeholder="email" class="input input-bordered " name="email" bind:value={email}/>
                    </div>                
                    <div class="form-control">
                        <button type="submit" class="btn btn-primary">Reset Password</button>
                    </div>
                    <div class="form-control">
                        <button class="btn btn-neutral" on:click={goToLogin}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
  
  
<style>
</style>