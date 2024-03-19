<script>
    import { onMount } from "svelte";
    import Fuzzy from "svelte-fuzzy";
    import Location from "../../location";    
    import Messagestore from "../../MessageStore";    

    let options = {keys: ["commonName"]};
    let msg = {
		content: "",
		type: "",
		action: "",
		path: "",
	};
    let data = [];
    let query = "";
    let formatted = [];
    let species;
    let chosenBird = "";
    let chosenBirdError = "";
    let latitudeError = "";    
    let longitudeError = "";
    let files;    
    let fileClass = "file-input-info";
    let fileText = "Supported types: .png .jpg, .jpeg";
    let fileUploading = false;
    let date = new Date();
    let overrideLocation = false;
    let today = date.getFullYear().toString().padStart(4, '0') + '-' + (date.getMonth()+1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
    const longitudeRegex = /^-?((1[0-7][0-9]|[0-9]{1,2})(\.\d+)?|180(\.0+)?)$/;
    const latitudeRegex = /^-?([1-8]?[0-9](\.\d+)?|90(\.0+)?)$/;
    let sighting = {
        date: today,
        quantity: 1,
        birdSpecies: "",
        userEmail: "",
        latitude: "",
        longitude: "",
        imageRef: ""
    }

    Location.subscribe((location) => {
        sighting.latitude = location.lat;
        sighting.longitude = location.lng;        
    })

    let resetData = () => {
        sighting.date = today;
        sighting.quantity = 1;
        sighting.imageRef = "";
        sighting.birdSpecies = "";
        chosenBird = "";
        chosenBirdError = "";
        latitudeError = "";
        longitudeError = "";
        query = "";
        files = null;
        fileClass = "file-input-info";
        fileText = "Supported types: .png .jpg, .jpeg";
        document.querySelector('#file-input').value = "";
    }

    let uploadImage = async () => {
        fileUploading = true;
        if(isFileUploadable()) {
            let data = new FormData();
            data.append('files', files[0]);
            const res = await fetch('http://localhost:8080/api/upload',{
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                }
            })
            .then((response) => {
                if (response.status!=201) {
                    msg.type = "alert-error";
                    msg.content = response.message;
                    chosenBirdError = "";
                } else {
                    msg.content = "Image was uploaded";
                    msg.type = "alert-success";
                    fileClass = "file-input-success";
                    fileText = "Image was uploaded";
                }
                return response.json();
            })
            .then((response) => {
                if(response[0].fileUrl && response[0].fileUrl.length>0) {
                    sighting.imageRef = response[0].fileUrl;
                }
            })
            .catch((error) => {
                console.log(error);
                msg.type = "alert-error";
                msg.content = "Image cannot be uploaded";
                fileClass = "file-input-error";
                files = "";
            })
            .finally(() => {
                Messagestore.update(() => msg);
                fileUploading = false;
            });
        }
    }

    let isFileUploadable = () => {
        if(files==null) {
            fileText = "Select a file";
            fileClass = "file-input-error";
            fileUploading = false;
            return false;
        } 
        let fileNameArray = files[0].name.split(".");
        let supportedFileTypes = ['jpg', 'jpeg', 'png'];
        if(!supportedFileTypes.includes(fileNameArray[fileNameArray.length-1].toLowerCase())){
            fileText = "File type not supported";
            fileClass = "file-input-error";
            fileUploading = false;
            return false;
        }
        if(files[0].size>1048576) {
            fileText = "File size is too big.";
            fileClass = "file-input-error";
            fileUploading = false;
            return false;
        }
        fileText = "Supported types: .png .jpg, .jpeg";
        fileClass = "file-input-info";
        return true;
    }

    onMount(async () => {
        const res = await fetch('http://localhost:8080/api/v1/birds',{
            method: 'GET',
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            data = response;            
        })
        .catch((error) => {
            console.log(error);
        })
    });

    let setBird = (event) => {
        chosenBird = event.target.previousElementSibling.innerText;        
    }

    let submitSighting = async () => {
        if(chosenBird=="") {
            chosenBirdError = "Bird species has not been chosen.";
            return;
        } else {
            chosenBirdError = "";
        }

        if(!latitudeRegex.test(sighting.latitude)) {
            latitudeError = "Error in coordinates!";
            return;
        } else {
            latitudeError = "";
        }

        if(!longitudeRegex.test(sighting.longitude)) {
            longitudeError = "Error in coordinates!";
            return;
        } else {
            longitudeError = "";
        }
        
        sighting.userEmail = JSON.parse(localStorage.getItem('user'));
        sighting.birdSpecies = chosenBird;
        const res = await fetch('http://localhost:8080/api/newSighting',{
            method: 'POST',
            body: JSON.stringify(sighting),
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-type': 'application/json'
            }
        })
        .then((response) => {
            if (response.status!=201) {
                msg.type = "alert-error";
                msg.content = response.message;
                chosenBirdError = "";
                return response.json();
            } else {
                resetData();
                document.querySelector('#sightingModal').close();
                msg.content = "Sighting was added";
                msg.type = "alert-success";
            }
        })
        .catch((error) => {
            console.log(error);
            msg.type = "alert-error";
            msg.content = "Request cannot be sent";
        })
        .finally(() => {
            Messagestore.update(() => msg);
        });
    }

</script>

<Fuzzy {query} {data} {options} bind:formatted/>

<form class="contents" on:submit|preventDefault={submitSighting}>
    <div class="form-control w-full">
        <h3 class = "card-title">Add new Sighting</h3>
        <div class="form-control w-full">
            <label for="latitude" class="label">
                <span class="label-text">Latitude</span>
            </label>
            <input type="text" placeholder="Enter latitude" class="input input-bordered w-full {latitudeError.length>0? 'input-error': ''} {overrideLocation? "" : "input-disabled"}" disabled={!overrideLocation} bind:value={sighting.latitude} />
            <span class="label-text-alt text-error">{latitudeError}</span>
        </div>  
        <div class="form-control w-full">
            <label for="longitude" class="label">
                <span class="label-text">Longitude</span>
            </label>
            <input type="text" placeholder="Enter Longitude" class="input input-bordered w-full {longitudeError.length>0? 'input-error': ''} {overrideLocation? "" : "input-disabled"}" disabled={!overrideLocation} bind:value={sighting.longitude} />
            <span class="label-text-alt text-error">{longitudeError}</span>
        </div>  
        <div class="form-control">
            <label class="cursor-pointer label justify-between">
                <span class="label-text">Override Location</span> 
                <input type="checkbox" class="toggle toggle-neutral" bind:checked={overrideLocation} />
            </label>
        </div>
        <div class="form-control w-full">
            <label for="bird-species" class="label">
                <span class="label-text">Select bird by common name</span>
            </label>
            <input type="text" placeholder="Begin typing for results" class="input input-bordered w-full {chosenBirdError.length>0? 'input-error': ''}" bind:value={query} />
            <span class="label-text-alt text-error">{chosenBirdError}</span>
        </div>        
        <ul class="search-results mt-2 mb-2 rounded-xl menu w-full {query.length>3? '': 'hidden'}">
            {#each formatted.slice(0,5) as item}
                {#each item as line}
                    <li>
                        <label class="label cursor-pointer">
                            <span class="label-text overflow-width">
                                {#each line as {matches, text, key}}
                                    {#if matches}
                                        <mark>{text}</mark>
                                    {:else}
                                        {text}
                                    {/if}
                                {/each}
                            </span>
                            <input type="radio" name="species" class="radio checked:bg-primary" bind:group={species} on:click={setBird}/>
                        </label>
                    </li>
                {/each}
            {/each}
        </ul>                                       
        <div class="form-control w-full">
            <label for="readingDate" class="label">
            <span class="label-text">Enter date of sighting</span>
            </label>
            <input required type="date" bind:value={sighting.date} class="input input-bordered" id="sightingDate"/>
        </div>
        <div class="form-control w-full">
            <label for="Image upload" class="label">
                <span class="label-text">Enter quantity</span>
            </label>
            <input type="number" class="input input-bordered w-full" placeholder="Enter number of birds viewed" bind:value={sighting.quantity} min="1" max="100"/>
        </div>  
        <div class="form-control w-full">
            <label for="Image upload" class="label">
                <span class="label-text">Select image of sighting</span>
            </label>
            <div class="join w-full relative">
                <div class="loading-container absolute top-0 left-0 flex items-center justify-center w-full h-full backdrop-blur-sm {fileUploading?"":"hidden"}">
                    <span class="loading loading-infinity loading-lg"></span>
                </div>
                <input type="file" id = "file-input" class="file-input {fileClass} file-input-bordered join-item w-full" accept=".png, .jpg, .jpeg" bind:files/>
                <button class="btn join-item btn-neutral" on:click|stopPropagation|preventDefault={uploadImage}>Upload</button>
            </div>
            <label for= "file-upload" class="label">
                <span class="label-text-alt">{fileText}</span>
                <span class="label-text-alt">Max. 1MB</span>
            </label>
        </div>
        <div class="form-control">
            <button class="btn btn-primary mt-5">Submit Sighting</button>
        </div>
    </div> 
</form>

<style>
    .search-results{
        box-shadow: #32325d40 0 13px 27px -5px, #0000004d 0 8px 16px -8px;
    }

    .overflow-width {
        max-width: calc(100vw - 8rem);
        text-overflow: ellipsis;
        overflow: hidden;
        height: 1.25rem;
    }
</style>