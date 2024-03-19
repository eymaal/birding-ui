<script>
    import { push } from "svelte-spa-router";
    import { fly } from "svelte/transition";
    import showNavbar from "../showNavbar";
    let displayNavbar;
    let token = localStorage.getItem('token');
    let userType =  JSON.parse(localStorage.getItem('userType'));

    showNavbar.subscribe((value)=> {
        displayNavbar = value;
    })

    let switchContextFromDropDown = () => {
        // https://github.com/saadeghi/daisyui/issues/201
        if (typeof window !== "undefined") { document.activeElement.blur(); }
    }

    let goToHome = () => {
        push('/home');
        document.querySelector("#reload-sightings")?.click();
    }

    let goToDashboard = () => {
        push('/home');
        setTimeout(() => {
            switchContextFromDropDown();
            push('/dashboard');
        }, 100);
    }

    let goToPage = (page) => {
        push('/home');
        setTimeout(() => {
            switchContextFromDropDown();
            push(page);
        }, 100);
    }

    let logOut = () => {
        if(localStorage.getItem('token')!==null) {
            if(localStorage.getItem('user')!==null) {
                localStorage.removeItem('user');
            }
            if(localStorage.getItem('name')!==null) {
                localStorage.removeItem('name');
            }
            if(localStorage.getItem('userType')!==null) {
                localStorage.removeItem('userType');
            }
            localStorage.removeItem('token');
            push('/home');
            // https://github.com/saadeghi/daisyui/issues/201
            if (typeof window !== "undefined") { document.activeElement.blur(); }
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    }

    $:{
        token = displayNavbar? localStorage.getItem('token') : "";
    }

    let openConfirmDeleteModal = () => {
        push('/home');
        setTimeout(() => {
            document.querySelector('#confirmDeleteModal').showModal();
        }, 100);
    }
</script>

{#if displayNavbar}
    <div class="navbar bg-base-100 top-0 m-2 z-30 navbar-width rounded-full shadow-xl fixed" transition:fly={{ delay: 250, duration: 300, x: 0, y: -100, opacity: 0.5}}>
        <div class="navbar-start">
            <div class="dropdown">
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <label for="hamburger" tabindex="0" class="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16M4" /></svg>
                </label>
                <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li><button on:click={() => {goToPage('/home')}}>Home</button></li>
                    <li><button on:click={() => {goToPage('/bird-directory')}}>Bird Directory</button></li>
                    <li><button on:click={() => {goToPage('/birding-guide')}}>Birding Guide</button></li>
                    <li><button on:click={() => {goToPage('/forum')}}>Forum</button></li>
                    <li><button on:click={() => {goToPage('/stats')}}>Statistics</button></li>
                </ul>
            </div>
        </div>
        <div class="navbar-center">
            <button class="btn btn-ghost normal-case text-xl" on:click={goToHome}>Birding🦜</button>
        </div>
        <div class="navbar-end">
            <div class="dropdown dropdown-end">
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <label for="hamburger" tabindex="0" class="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="-1 0 24 23" stroke="currentColor"> <g id="Page-1" stroke="currentColor" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -2159.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#1342]"> </path> </g> </g> </g>
                </label>
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    {#if token}
                        <li tabindex="0"><button on:click={goToDashboard}>Dashboard</button></li>
                        {#if JSON.parse(localStorage.getItem('userType'))!="ADMIN"}                        
                            <!-- svelte-ignore missing-declaration -->
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <li><a on:click={openConfirmDeleteModal}>Delete Account</a></li>
                        {/if}
                        <!-- svelte-ignore missing-declaration -->
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <li><a id = "log-out" on:click={logOut}>Log out</a></li> 
                    {:else}                
                        <li tabindex="0"><a href="/#/login">Log in</a></li>                       
                    {/if}
                </ul>
            </div>
        </div>
    </div>
{/if}

<style>
    .navbar-width{
        width: calc(100vw - 1rem);
    }
</style>