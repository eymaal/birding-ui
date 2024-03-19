<script>
    import Messagestore from "../../MessageStore";

    let userName = JSON.parse(localStorage.getItem('user'));
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_\-\.!^*?@#$%])(?=.{8,})\S*$/;	
    let msg = {
		content: "",
		type: "",
		action: "",
		path: "",
	};

    let user = {
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	};

    let resetFields = () => {
       Object.keys(user).forEach(key => user[key] = "");
       confirmPassword = "";
       email_text = "";
       pass_text = "";
       confirmPass_text = "";
    }

    let confirmPassword = "";
	let email_text="", pass_text="", confirmPass_text="";
    
    let addMod = async () => {
        if (user.email.length == 0 || user.password.length == 0 || confirmPassword.length == 0 || user.password!=confirmPassword) {
			if (user.email.length == 0) email_text = "Enter email id.";
			if (user.password.length == 0) pass_text = "Enter password.";
			if (confirmPassword.length == 0) confirmPass_text = "Enter confirm password.";
			if(user.password!=confirmPassword) pass_text = confirmPass_text = "Passwords do not match."
			return;
		}
        if(!passwordRegex.test(user.password)) {
            pass_text = confirmPass_text = "Password should be of 8 characters minimum with uppercase, lowercase, 1 digit and 1 symbol at least";
            return;
        }
        const res = await fetch("http://localhost:8080/api/addModerator?userName="+userName, {
			method: "POST",
			headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-type': 'application/json'
            },
			body: JSON.stringify(user),
		})
		.then((response) => {
			if (response.status!=201) {
				msg.type = "alert-error";
				return response.json();
			} else {
				msg.content = "Moderator is added!";
				msg.type = "alert-success";
                resetFields();
                document.querySelector('#refresh-mod').click();
				return response.json();
			}
		})
		.then((res) => {
			if(res.message) {	
				msg.content = res.message;
				email_text = res.message;
				pass_text = confirmPass_text = "";
			}
		})
		.catch((error) => {
			console.log(error);
			msg.type = "alert-error";
			msg.content = "Request cannot be sent";
		})
		.finally(() => {
			Messagestore.update(() => msg);
            document.querySelector('#add-mod-modal').close();
		});
    }
</script>

<form method="dialog" class="modal-box">
    <h3 class="font-bold text-lg">New Moderator</h3>
    <p class="py-4">Add details for the new moderator.</p>
    <div class="form-control">
        <label for="firstName" class="label">
            <span class="label-text">First Name</span>
        </label>
        <input type="text" placeholder="first name" class="input input-bordered" name="firstName" bind:value={user.firstName}/>
    </div>
    <div class="form-control">
        <label for="lastName" class="label">
            <span class="label-text">Last Name</span>
        </label>
        <input type="text" placeholder="last name" class="input input-bordered" name="lastName" bind:value={user.lastName}/>
    </div>
    <div class="form-control">
        <label for="email" class="label">
            <span class="label-text">Email</span>
        </label>
        <input type="email" placeholder="email" class="input input-bordered {email_text.length>0?'input-error':''}" name="email" bind:value={user.email}/>
        <span class="label-text-alt text-error">{email_text}</span>
    </div>
    <div class="form-control">
        <label for="password" class="label">
            <span class="label-text">Password</span>
        </label>
        <div class="join">
            <input type="password" placeholder="password" class="input input-bordered join-item w-full {pass_text.length>0?'input-error':''}" name="password" bind:value={user.password} id = "password"/>						
        </div>
        <span class="label-text-alt text-error">{pass_text}</span>
    </div>
    <div class="form-control">
        <label for="password" class="label">
            <span class="label-text">Confirm Password</span>
        </label>
        <div class="join">
            <input type="password" placeholder="confirm password" class="input input-bordered join-item w-full {confirmPass_text.length>0?'input-error':''}" name="confirmPassword" bind:value={confirmPassword} id = "confirmPassword"/>
        </div>						
        <span class="label-text-alt text-error">{confirmPass_text}</span>
    </div>
    <div class="modal-action">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-primary" on:click|stopPropagation|preventDefault={addMod}>Add Mod</button>
        <button class="btn">Cancel</button>
    </div>
</form>