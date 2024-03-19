<script>
    import { push } from "svelte-spa-router";
    import { fly } from "svelte/transition";
    export let pageTitle;
</script>

<div class="card-container p-12">
    <div class="card shadow-xl bg-neutral text-neutral-content" transition:fly="{{ y: 100, duration: 200 }}">
        <div class="card-body items-center text-center">
            <h2 class="card-title">Log in!</h2>
            <p>You need to log in to view the {pageTitle}.</p>
            <div class="card-actions justify-end">
                <button on:click={() => {push('/login')}} class="btn btn-primary">Log in</button>
            </div>
        </div>
    </div>
</div>