<script>
    import { onMount } from "svelte";
    import MessageStore from "../../MessageStore";

    let userName = JSON.parse(localStorage.getItem('user'));
    let userType = JSON.parse(localStorage.getItem('userType'));
    let ready = false;
    let users = [];
    let disableLockBtn = true;
    let disableDeleteBtn = true;
    let msg={
		content: "",
		type: "",
		action: "",
		path: ""
	}

    $:{
        disableLockBtn = users.filter((user) => user.locked!=user.tempLocked).length===0;
        disableDeleteBtn = users.filter((user) => user.isDelete).length===0;
    }

    let saveChanges = async() => {
        users.forEach((user) => {user.locked = user.tempLocked});

        await fetch('http://localhost:8080/api/updateUsers?userName='+userName,{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(users)
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => { 
            if(response.message) {
                msg.content = response.message;
                msg.type = "alert-error";
            } else if(response.success) {
                msg.content = response.success;
                msg.type = "alert-success";
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            fetchUsers();
            MessageStore.update(() => msg);
        })
    }

    let deleteUsers = async () => {       
        await fetch('http://localhost:8080/api/deleteUsers?userName='+userName,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(users.filter((user) => user.isDelete))
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => { 
            if(response.message) {
                msg.content = response.message;
                msg.type = "alert-error";
            } else if(response.success) {
                msg.content = response.success;
                msg.type = "alert-success";
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            fetchUsers();
            MessageStore.update(() => msg);
        })
    }

    let fetchUsers = async() => {
        await fetch('http://localhost:8080/api/users?userName='+userName,{
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
            users = response;  
            users.forEach(user => {
                user.tempLocked = user.locked;
                user.isDelete = false;
            });   
            disableLockBtn = true;     
            if(users.length>0) {
                ready = true;            
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    onMount(async () => {
        fetchUsers();
    })

</script>

{#if ready}
<div class="btn-container flex flex-row gap-2">
    <button class="btn btn-primary {disableLockBtn? "btn-disabled" : ""}" on:click={saveChanges}>Lock</button>
    <button class="btn btn-accent max-md:hidden {userType!="ADMIN"? "hidden" : ""} {disableDeleteBtn? "btn-disabled" : ""}" on:click={deleteUsers}>Delete</button>
    <button class="btn btn-neutral {disableLockBtn && disableDeleteBtn? "btn-disabled" : ""}" on:click={fetchUsers}>Cancel</button>    
</div>
<div class="flex h-full w-full justify-center">
    <div class="overflow-x-auto overflow-scroll calc-height max-height-40 w-full">
        <table class="table table-pin-rows table-pin-cols max-md:hidden" id = "sightingTable">
            <thead>
                <tr class = "text-secondary">
                    <td/>
                    <td>UserName</td>
                    <td>Name</td>
                    <td>Role</td>
                </tr>
            </thead>
            <tbody>
                {#each users as user}
                    <tr class = "{user.isDelete? "bg-orange-100" : user.locked!=user.tempLocked? "bg-base-200" : ""}">
                        <td class = "flex p-2">
                            <label class="swap p-2 hover:bg-base-200 rounded-full">                                
                                <input type="checkbox" bind:checked={user.tempLocked}/>                                
                                <svg class="swap-on stroke-red-600 drop-shadow-md w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="2"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                <svg class="swap-off stroke-current w-6 h-6" viewBox="0 0 24 24" fill = "none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="2"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.584 6C15.8124 4.2341 14.0503 3 12 3C9.23858 3 7 5.23858 7 8V10.0288M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C16.8802 10 17.7202 10 18.362 10.327C18.9265 10.6146 19.3854 11.0735 19.673 11.638C20 12.2798 20 13.1198 20 14.8V16.2C20 17.8802 20 18.7202 19.673 19.362C19.3854 19.9265 18.9265 20.3854 18.362 20.673C17.7202 21 16.8802 21 15.2 21H8.8C7.11984 21 6.27976 21 5.63803 20.673C5.07354 20.3854 4.6146 19.9265 4.32698 19.362C4 18.7202 4 17.8802 4 16.2V14.8C4 13.1198 4 12.2798 4.32698 11.638C4.6146 11.0735 5.07354 10.6146 5.63803 10.327C5.99429 10.1455 6.41168 10.0647 7 10.0288Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </label>
                            <label class="swap p-2 hover:bg-orange-200 rounded-full {userType!="ADMIN"? "hidden" : ""}">
                                <input type="checkbox" bind:checked={user.isDelete}/>
                                <svg class="swap-on stroke-red-600 drop-shadow-md w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                <svg class="swap-off stroke-current w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </label>

                        </td>
                        <td>{user.username}</td>
                        <td>{user.name}</td>
                        <td>{user.userType}</td>                        
                    </tr>
                {/each}
            </tbody>
        </table>
        <div class="card-container flex p-2 pb-4 gap-2 w-full md:hidden">
            {#each users as user}
                <div class="card card-bordered border {user.locked!=user.tempLocked? "border-neutral" : ""} card-compact bg-base-100 shadow-lg w-80">        
                    <div class="card-body justify-between"> 
                        <div class="contents">  
                            <div class="flex justify-between gap-4">
                                <h3 class="card-title">{user.username}</h3>
                                <label class="swap p-2 hover:bg-base-200 rounded-full">                                
                                    <input type="checkbox" bind:checked={user.tempLocked}/>                                
                                    <svg class="swap-on stroke-red-600 drop-shadow-md w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="2"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                    <svg class="swap-off stroke-current w-6 h-6" viewBox="0 0 24 24" fill = "none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="2"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.584 6C15.8124 4.2341 14.0503 3 12 3C9.23858 3 7 5.23858 7 8V10.0288M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C16.8802 10 17.7202 10 18.362 10.327C18.9265 10.6146 19.3854 11.0735 19.673 11.638C20 12.2798 20 13.1198 20 14.8V16.2C20 17.8802 20 18.7202 19.673 19.362C19.3854 19.9265 18.9265 20.3854 18.362 20.673C17.7202 21 16.8802 21 15.2 21H8.8C7.11984 21 6.27976 21 5.63803 20.673C5.07354 20.3854 4.6146 19.9265 4.32698 19.362C4 18.7202 4 17.8802 4 16.2V14.8C4 13.1198 4 12.2798 4.32698 11.638C4.6146 11.0735 5.07354 10.6146 5.63803 10.327C5.99429 10.1455 6.41168 10.0647 7 10.0288Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                </label>    
                            </div>
                            <div class = "flex justify-between gap-4">
                                <div class="sighting-label left text-secondary">Name</div>
                                <div class="sighting-label right">{user.name}</div>
                            </div>
                            <div class = "flex justify-between gap-4">
                                <div class="sighting-label left text-secondary">Role</div>
                                <div class="sighting-label right">{user.userType}</div>
                            </div>                           
                        </div>
                    </div>
                </div>         
            {/each}
        </div>
    </div>
</div>
{:else}
    <div class="h-full w-full flex justify-center items-center">
        <div class="card w-96 bg-neutral text-neutral-content">
            <div class="card-body text-neutral-content">
                <h2 class="card-title">Users</h2>
                <p>There are 0 users.</p>
            </div>
        </div>
    </div>
{/if}