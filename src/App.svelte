<script>
    import Router from "svelte-spa-router";
    import Register from "./pages/auth/Register.svelte";
    import Login from "./pages/auth/Login.svelte";
    import Home from "./pages/home/Home.svelte";
    import ForgotPassword from "./pages/auth/ForgotPassword.svelte";
    import Messages from "./util/Messages.svelte";
    import MessageStore from "./MessageStore";
    import Map from "./pages/home/Map.svelte";
    import BirdDirectory from "./pages/birdDirectory/BirdDirectory.svelte";
    import Navbar from "./util/Navbar.svelte";
    import Dashboard from "./pages/dashboard/Dashboard.svelte";
    import Forum from "./pages/forum/Forum.svelte";
    import Stats from "./pages/stats/Stats.svelte";
    import BirdingGuide from "./pages/birdingGuide/BirdingGuide.svelte";

    export let ready;

    const routes = {
        "/register": Register,
        "/login": Login,
        "/forgot-password": ForgotPassword,
        "/bird-directory": BirdDirectory,
        "/birding-guide": BirdingGuide,
        "/dashboard": Dashboard,
        "/forum" : Forum,
        "/stats" : Stats,
        "/home": Home,
        "/*": Home
    };

    export let message = {
        content: "",
        action: "",
        path: "",
        type: "",
    };

    MessageStore.subscribe((data) => {
        message = data;
    });
</script>

<svelte:head>
    <script
        defer
        async
        src="https://maps.googleapis.com/maps/api/js?key=***&callback=initMap">
    </script>
</svelte:head>

<Messages {...message} />
<Router {routes} />
<Navbar/>
{#if ready}
    <Map />
{/if}

<style>
    :global(body) {
        padding: 0;
    }
</style>
