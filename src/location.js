import { writable } from "svelte/store";

const Location = writable({
    lat: "",
    lng: "",
})

export default Location;