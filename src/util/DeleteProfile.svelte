<script>
    import MessageStore from "../MessageStore";
    import { fade } from "svelte/transition";

    let confirmDeleteModal;
    let delConfirmError = false;
    let confirmText;
    let userName = JSON.parse(localStorage.getItem('user'));
    let msg = {
		content: "",
		type: "",
		action: "",
		path: "",
	};

    let deleteAccount = async () => {
        if(confirmText !="delete") {
            delConfirmError = true;
            return;
        }
        delConfirmError = false;
        const res = await fetch("http://localhost:8080/api/deleteProfile?userName="+userName, {
			method: "DELETE",
			headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-Type': 'application/json'
            },			
		})
		.then((response) => {
			if (response.status!=204) {
				msg.type = "alert-error";
				return response.json();
			} else {
				msg.content = "Deletion was successful! Logging you out.";
				msg.type = "alert-success";
                confirmDeleteModal.close();
                setTimeout(() => {
                    document.querySelector('#log-out').click();
                }, 500);				
			}
		})
		.catch((error) => {
			console.log(error);
			msg.type = "alert-error";
			msg.content = "Request cannot be sent";
		})
		.finally(() => {
			MessageStore.update(() => msg);
		});


    }
</script>

<dialog id="confirmDeleteModal" bind:this={confirmDeleteModal} class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3 class="font-bold text-lg">Delete Account</h3>
        <p class="py-4">Type "delete" to confirm your action</p>
        <input type="text" placeholder="Type delete" class="input input-bordered w-full {delConfirmError? "input-error" : ""}" bind:value={confirmText}/>
        {#if delConfirmError}
            <label for="deleteText" class="label text-error" transition:fade={{ duration: 200 }}>
                <span class="label-text-alt text-error">Enter phrase correctly!!</span>
            </label>
        {/if}
        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn btn-primary" on:click|preventDefault={deleteAccount}>Delete Account</button>
                <button class = "btn btn-neutral">close</button>
            </form>
        </div>
    </div>    
</dialog>