<script>
	import { push } from "svelte-spa-router";
	import { fly } from "svelte/transition";

	export let content;
	export let type;
	export let action;
	export let path;

	$: content && reset();

	let reset = () => {
		setTimeout(resetMessage, 1500);
	};

	let closeAlert = () => {
		if (path.length > 0) {
			setTimeout(() => {
				push(path);
				path = "";
			}, 1000);
		}
		resetMessage();
	};

	let resetMessage = () => {
		content = "";
		type = "";
		action = "";
	};
</script>

{#if content != ""}
	<div id="notification" class="fixed top-0 left-0 z-[1000] w-full">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="alert {type} shadow-lg mx-auto my-4 cursor-pointer" on:click={closeAlert} transition:fly={{ y: -200, duration: 600 }}>
			<div class="self-start flex gap-1">
				{#if type == "alert-error"}
					<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				{:else if type == "alert-success"}
					<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				{:else if (type = "alert-warning")}
					<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
					</svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				{/if}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span>{content}</span>
			</div>
		</div>
	</div>
{/if}

<style>
	#notification > .alert {
		width: calc(100vw - 32px);
	}
</style>
