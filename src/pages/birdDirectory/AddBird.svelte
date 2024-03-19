<script>
    import Messagestore from "../../MessageStore";
    
    let userName = JSON.parse(localStorage.getItem('user'));
    let files;
    let fileClass = "file-input-info";
    let fileText = "Supported types: .png .jpg, .jpeg";
    let fileUploading = false;
    let avibase = "";
    let imageRef = "";

    let msg = {
		content: "",
		type: "",
		action: "",
		path: "",
	};

    let bird = {
        commonName: "",
        scientificName: "",
        family: "",
        classification: "",
        taxonomicGrouping: ""
    }

    let birdText = {
        commonName: "",
        scientificName: "",
        family: "",
        classification: "",
        taxonomicGrouping: "",
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
                    bird.imageRef = response[0].fileUrl;
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

    let resetFields = () => {
        Object.keys(bird).forEach(key => bird[key] = "");
        Object.keys(birdText).forEach(key => birdText[key] = "");
        avibase = "";
        imageRef = "";
    }

    let addSpecies = async () => {
        
        Object.keys(bird).filter((key) => bird[key].length==0).forEach((key) => birdText[key]="Field cannot be empty");
        if(Object.keys(bird).filter((key) => bird[key].length==0).length>0) return;
        bird.avibase = avibase;
        bird.imageRef = imageRef;

        const res = await fetch("http://localhost:8080/api/newBird?userName="+userName, {
			method: "POST",
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-type': 'application/json'
            },
			body: JSON.stringify(bird),
		})
		.then((response) => {
			if (response.status!=201) {
				msg.type = "alert-error";
				return response.json();
			} else {
				msg.content = "Bird Species was added!";
				msg.type = "alert-success";
                resetFields();
                document.querySelector("#fetch-birds")?.click();
				return response.json();
			}
		})
		.then((res) => {
			if(res.message) {	
				msg.content = res.message;
				birdText.commonName = res.message;
				birdText.scientificName= "";
			}
		})
		.catch((error) => {
			console.log(error);
			msg.type = "alert-error";
			msg.content = "Request cannot be sent";
		})
		.finally(() => {
			Messagestore.update(() => msg);
            document.querySelector('#addBirdModal').close();
		});
    }
</script>

<form method="dialog" class="modal-box">
    <h3 class="font-bold text-lg">Add Species</h3>
    <p class="py-4">Enter details of new species and click on Add.</p>
    <div class="form-control">
        <label for="commonName" class="label">
            <span class="label-text">Common Name</span>
        </label>
        <input type="text" placeholder="Enter common name" class="input input-bordered {birdText.commonName.length>0?'input-error':''}" name="commonName" bind:value={bird.commonName}/>
        <span class="label-text-alt text-error">{birdText.commonName}</span>
    </div>
    <div class="form-control">
        <label for="scientificName" class="label">
            <span class="label-text">Scientific Name</span>
        </label>
        <input type="text" placeholder="Enter scientific name" class="input input-bordered {birdText.scientificName.length>0?'input-error':''}" name="scientificName" bind:value={bird.scientificName}/>
        <span class="label-text-alt text-error">{birdText.scientificName}</span>
    </div>
    <div class="form-control">
        <label for="family" class="label">
            <span class="label-text">Family</span>
        </label>
        <input type="text" placeholder="Enter family" class="input input-bordered {birdText.family.length>0?'input-error':''}" name="family" bind:value={bird.family}/>
        <span class="label-text-alt text-error">{birdText.family}</span>
    </div>
    <div class="form-control">
        <label for="classification" class="label">
            <span class="label-text">Classification</span>
        </label>
        <input type="text" placeholder="Enter classification" class="input input-bordered {birdText.classification.length>0?'input-error':''}" name="classification" bind:value={bird.classification}/>
        <span class="label-text-alt text-error">{birdText.classification}</span>
    </div>
    <div class="form-control">
        <label for="taxonomicGrouping" class="label">
            <span class="label-text">Order</span>
        </label>
        <input type="text" placeholder="Enter family" class="input input-bordered {birdText.taxonomicGrouping.length>0?'input-error':''}" name="taxonomicGrouping" bind:value={bird.taxonomicGrouping}/>
        <span class="label-text-alt text-error">{birdText.taxonomicGrouping}</span>
    </div>
    <!-- <div class="form-control w-full">
        <label for="Image upload" class="label">
            <span class="label-text">Select image of sighting</span>
        </label>
        <div class="join w-full relative">
            <div class="loading-container absolute top-0 left-0 flex items-center justify-center w-full h-full backdrop-blur-sm {fileUploading?"":"hidden"}">
                <span class="loading loading-infinity loading-lg"></span>
            </div>
            <input type="file" class="file-input {fileClass} file-input-bordered join-item w-full" accept=".png, .jpg, .jpeg" bind:files/>
            <button class="btn join-item btn-neutral" on:click|stopPropagation|preventDefault={uploadImage}>Upload</button>
        </div>
        <label for= "file-upload" class="label">
            <span class="label-text-alt">{fileText}</span>
            <span class="label-text-alt">Max. 1MB</span>
        </label>
    </div> -->
    <div class="form-control">
        <label for="avibase" class="label">
            <span class="label-text">Avibase</span>
        </label>
        <input type="text" placeholder="Enter Avibase URL" class="input input-bordered" name="avibase" bind:value={avibase}/>
    </div>
    <div class="modal-action">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-primary" on:click|preventDefault={addSpecies}>Add</button>
        <button class="btn">Close</button>
    </div>
</form>