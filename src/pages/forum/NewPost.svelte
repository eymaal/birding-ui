<script>
    import Messagestore from "../../MessageStore";  

    let msg = {
		content: "",
		type: "",
		action: "",
		path: "",
	};
    let post = {
        author: "",
        title: "",
        content: "",
        tags: "",
        imageRef: ""        
    }
    let user = JSON.parse(localStorage.getItem('user'));
    let files;
    let fileClass = "file-input-info";
    let fileText = "Supported types: .png .jpg, .jpeg";
    let fileUploading = false;
    let contentText = "";
    let titleText = "";

    let resetData = () => {
        titleText = "";
        contentText = "";
        files = null;
        post.author = "";
        post.title = "";
        post.content = "";
        post.tags = "";
        post.imageRef = "";
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
                    post.imageRef = response[0].fileUrl;
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

    let postWorthy = () => {
        if(post.title.length==0) {
            titleText = "Title cannot be empty.";
            return false;
        }
        if(post.content.length>100) {
            contentText = "Content too long!";
            return false;
        }
        return true;
    }

    let submitPost = async () => {
        if(postWorthy()){
            post.author = user;
            const res = await fetch('http://localhost:8080/api/newPost?userName='+user,{
                method: 'POST',
                body: JSON.stringify(post),
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                    'Content-type': 'application/json'
                }
            })
            .then((response) => {
                if (response.status!=201) {
                    msg.type = "alert-error";
                    msg.content = response.message;
                    return response.json();
                } else {
                    resetData();
                    document.querySelector('#reloadForum').click();
                    document.querySelector('#newPostModal').close();
                    msg.content = "Post was added";
                    msg.type = "alert-success";
                    if(response.message) msg.content = response.message;
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
    }

</script>

<form method="dialog" class="modal-box">
    <h3 class="font-bold text-lg">New Post</h3>
    <div class="form-control">
        <label for="title" class="label">
            <span class="label-text">Title</span>
        </label>
        <input type="text" placeholder="Enter post title" class="input input-bordered {titleText.length>0?'input-error':''}" name="title" bind:value={post.title}/>
        <span class="label-text-alt text-error">{titleText}</span>
    </div>
    <div class="form-control">
        <label for="content" class="label">
            <span class="label-text">Content</span>
        </label>    
        <textarea placeholder="Enter content" class="textarea textarea-bordered w-full {post.content.length>100? "textarea-error":""}" bind:value={post.content}></textarea>
        <label for="content" class="label">
            <span class="label-text-alt {post.content.length>100? "text-error":""}">{contentText}</span>
            <span class="label-text-alt {post.content.length>100? "text-error":""}">{post.content.length}/100</span>
        </label>
    </div>
    <div class="form-control">
        <label for="tags" class="label">
            <span class="label-text">Tags</span>
        </label>
        <input type="text" placeholder="Enter keywords separated by spaces" class="input input-bordered" name="tags" bind:value={post.tags}/>
    </div>    
    <div class="form-control w-full">
        <label for="Image upload" class="label">
            <span class="label-text">Select image</span>
        </label>
        <div class="join w-full relative">
            <div class="loading-container absolute top-0 left-0 flex items-center justify-center w-full h-full backdrop-blur-sm {fileUploading?"":"hidden"}">
                <span class="loading loading-infinity loading-lg"></span>
            </div>
            <input type="file" id ="file-input" class="file-input {fileClass} file-input-bordered join-item w-full" accept=".png, .jpg, .jpeg" bind:files/>
            <button class="btn join-item btn-neutral" on:click|stopPropagation|preventDefault={uploadImage}>Upload</button>
        </div>
        <label for= "file-upload" class="label">
            <span class="label-text-alt">{fileText}</span>
            <span class="label-text-alt">Max. 1MB</span>
        </label>
    </div>    
    <div class="modal-action">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-primary" on:click|preventDefault={submitPost}>Post</button>
        <button class="btn" on:click={resetData}>Cancel</button>
    </div>
</form>