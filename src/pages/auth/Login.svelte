<script>
	import { push } from 'svelte-spa-router';
	import { fly } from 'svelte/transition';
	import Messagestore from '../../MessageStore';
    import showMap from '../../showMap';
	import showNavbar from '../../showNavbar';

	showNavbar.update((value) => false);
	showMap.update((value) => false);
	const login_description ="For The Leicestershire and Rutland Ornithological Society";
	let email_text = "";
	let pass_text = "";

	let user = {
		email: "",
		password: ""
	}

	let msg={
		content: "",
		type: "",
		action: "",
		path: ""
	}

	async function login(){
		if(user.email.length==0 || user.password.length==0){
		if(user.email.length==0) email_text = "Enter email id";
		if(user.password.length==0) pass_text = "Enter password";
		return;
		}

		const res = await fetch('http://localhost:8080/api/v1/authenticate',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		})
		.then((response) => {
			if(!response.ok){
				msg.type = "alert-error";
			} else {
				msg.content = "";
				msg.type = "";          
			}
			return response.json();
		})
		.then((response) => {
			if(response.message){
				msg.content = response.message;
				email_text = " ";
				pass_text = msg.content;
			}
			if(response.token){
				localStorage.setItem('user', JSON.stringify(user.email));
				localStorage.setItem('token', JSON.stringify(response.token))
				localStorage.setItem('userType', JSON.stringify(response.userType));
				localStorage.setItem('name', JSON.stringify(response.name));
				msg.content = "Log in successful.";
				msg.type = "alert-success";
				setTimeout(() => {
					push('/home');
					document.querySelector("#reload-sightings")?.click();
				}, 750);
			}
		})
		.catch((error) => {
			console.log(error);
			msg.type = "alert-error";
			msg.content = "Request cannot be sent";
		})
		.finally(() => {
			Messagestore.update(() => msg);
		})
 	}
</script>
	
<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row-reverse" transition:fly="{{ y: 100, duration: 200 }}">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Birding</h1>
			<h4 class="text-2xl ">with Google Maps</h4>
			<p class="py-6">{login_description}</p>
		</div>
		<div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
			<div class="card-body">
				<form on:submit|stopPropagation|preventDefault={login} class="contents">
					<div class="form-control">
						<label for="email" class="label">
							<span class="label-text">Email</span>
						</label>
						<input type="text" placeholder="email" class="input input-bordered {email_text.length>0? 'input-error':''}" name="email" bind:value={user.email}/>
						<span class="label-text-alt">{email_text}</span>
					</div>
					<div class="form-control">
						<label for="password" class="label">
							<span class="label-text">Password</span>
						</label>
						<input type="password" placeholder="password" class="input input-bordered {pass_text.length>0? 'input-error':''}" name="password" bind:value={user.password}/>
						<span class="label-text-alt text-error">{pass_text}</span>
					</div>
					<div class="form-control">
						<button type="submit" on:submit={login} class="btn btn-primary">Login</button>
					</div>
					<div class="form-control flex-row justify-between">
						<label for="forgotPassword" class="label justify-end">
							<!-- <a href="#/forgot-password" class="label-text-alt link link-hover link-neutral">Forgot Password?</a> -->
						</label>
						<label for="register" class="label justify-start">
							<a href="#/register" class="label-text-alt link link-hover">Not registered yet? Click here.</a>
						</label>
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