<script>    
    import showMap from "../../showMap";
    import BottomNav from "../../util/BottomNav.svelte";
    import showNavbar from "../../showNavbar";
    import DeleteProfile from "../../util/DeleteProfile.svelte";

    showMap.update((value) => true);
    showNavbar.update((value) => true);

</script>
<!-- <BottomNav/> -->
<DeleteProfile/>

<style>
    
</style>