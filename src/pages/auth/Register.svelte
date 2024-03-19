<script>
	import { push } from "svelte-spa-router";
	import { fly } from "svelte/transition";
	import Messagestore from "../../MessageStore";
	import showMap from "../../showMap";
	import showNavbar from "../../showNavbar";

	const register_description = "For The Leicestershire and Rutland Ornithological Society";
	showMap.update((value) => false);
	showNavbar.update((value) => false);
	let user = {
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	};

	let confirmPassword = "";
	let email_text="", pass_text="", confirmPass_text="";

	let msg = {
		content: "",
		type: "",
		action: "",
		path: "",
	};

	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_\-\.!^*?@#$%])(?=.{8,})\S*$/;		

	async function register() {
		pass_text = confirmPass_text = "";
		if (user.email.length == 0 || user.password.length == 0 || confirmPassword.length == 0 || user.password!=confirmPassword) {
			if (user.email.length == 0) email_text = "Enter email id.";
			if (user.password.length == 0) pass_text = "Enter password.";
			if (confirmPassword.length == 0) confirmPass_text = "Enter confirm password.";
			if(user.password!=confirmPassword) pass_text = confirmPass_text = "Passwords do not match."
			return;
		}
		if(!passwordRegex.test(user.password)) {
			pass_text = confirmPass_text = "Password should be of 8 characters minimum with uppercase, lowercase, 1 digit and 1 symbol at least ";
			return;
		}

		const res = await fetch("http://localhost:8080/api/v1/register", {
			method: "POST",
			headers:new Headers({'Content-Type': 'application/json'}),
			body: JSON.stringify(user),
		})
		.then((response) => {
			if (response.status!=201) {
				msg.type = "alert-error";
				return response.json();
			} else {
				msg.content = "Registration Successful!";
				msg.type = "alert-success";
				push("/login");
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
		});
	}
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row-reverse" transition:fly="{{ y: 100, duration: 200 }}">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Birding</h1>
			<h4 class="text-2xl ">with Google Maps</h4>
			<p class="py-6">{register_description}</p>
		</div>
		<div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
			<div class="card-body">
				<form on:submit|stopPropagation|preventDefault={register} class="contents">
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
					<div class="form-control">
						<label for="login" class="label justify-end">
							<a href="#/login" class="label-text-alt link link-hover">Have an account already? Click here.</a>
						</label>
					</div>
					<div class="form-control">
						<button type="submit" class="btn btn-primary">Register</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.input-error::placeholder {
		color: hsl(var(--er));
	}
</style>
