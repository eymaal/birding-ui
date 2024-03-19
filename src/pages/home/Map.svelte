<script>
    import showMap from "../../showMap";
    import { onMount } from "svelte";
    import MessageStore from "../../MessageStore";
    import SightingModal from "../sighting/SightingModal.svelte";
    import Location from "../../location";
    import { fade, fly } from "svelte/transition";
    import splash from "../../assets/birdSplash.webp";

    let loading = true;
    let container;
    let map;
    let markers = [];
    let marker;
    let zoom = 15;
    let center = { lat: 52.6213476029294, lng: -1.1245918723967987 }; 
    let pos;   
    let displayMap;
    let AdvancedMarker;
    let AdvancedPinElement;
    let marker1;    

    showMap.subscribe((value)=> {
        displayMap = value;
    })
    let msg = {
		content: "",
		type: "",
		action: "",
		path: "",
	};
    let loc = {
        lat: "",
        lng: ""
    }   

    let infoWindow = new google.maps.InfoWindow({
        pixelOffset:new google.maps.Size(0, -38)
    });
    
    function placeMarker(location, commonName, creator, src, approver, qty) {
        const pinGlyph = new AdvancedPinElement({
            borderColor: "#ea4336",
            background: "#fbbc04",
            glyphColor: ""    
        });
        marker = new AdvancedMarker({
            position: location,
            content: pinGlyph.element,
            title: commonName,
            id: commonName
        });
        marker.addListener('click', ({domEvent, latLng}) => {
            let content = `<div class = "flex flex-col dialog-container gap-2">`;            
            content += `<div class = "card-title">${commonName}</div>`;
            content += `<p>${qty} ${qty>1?"birds" : "bird"} sighted `;
            content += `by <i>${creator}</i></p>`;
            let userType = JSON.parse(localStorage.getItem("userType"));
            userType == "ADMIN" || userType == "MODERATOR" ? content += `<p>Approved by <i>${approver}</i></p>`: "";
            if(src!=null && src.length>0) {
                content += `<img class = "rounded-xl self-center" width = "180px" src="${src}"/>`;
            }
            content +=`</div>`;
            infoWindow.close();
            infoWindow.setContent(content);
            infoWindow.open(map);            
            infoWindow.setPosition(latLng);
            map.panTo(latLng);
        })
        markers.push(marker);
    }

    let handleGeoLocationError = () => {
        msg.type = "alert-error";
        msg.content = "GeoLocation service didn't work.";
        MessageStore.update(() => msg);
        console.log(msg.content);
    }

    let shiftToLocation = () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    setMarker1(pos);
                    map.panTo(pos);
                    map.setZoom(16);
                },
                () => {handleGeoLocationError();}
            )
        } else {
            () => { handleGeoLocationError();}
        }
    }

    let showMarkers = (markers) => {        
        markers.map(marker => marker.setMap(map));
    }

    let hideMarkers = (markers) => {
        markers.map(marker => marker.setMap(null));
    }

    let reloadSighting = () => {
        if(infoWindow) infoWindow.close();
        hideMarkers(markers);
        loadSightingMarkers();
    }

    let loadSightingMarkers = async () => {
        const res = await fetch("http://localhost:8080/api/v1/sightings", {
			method: "GET",
		})
        .then((response) => {
            return response.json();
        })
        .then((response) => {        
            response.map(sighting => {
                sighting.imageRef = sighting.imageRef?"https://storage.googleapis.com" + sighting.imageRef : "";
                let approver = sighting.approver?? 'Auto-Approver';
                placeMarker({lat: Number(sighting.latitude), lng: Number(sighting.longitude)}, sighting.bird.commonName, sighting.creator.username, sighting.imageRef, approver, sighting.quantity);
                showMarkers(markers);
            });
        })
        .catch((error) => {
            console.log(error);
        })
    }

    let setMarker1 = (coordinates) => {
        if(marker1 == null) {
            marker1 = new google.maps.Marker({
                position: coordinates,
                title: "You are here",
                map: map
            })
        } else {
            marker1.setPosition(coordinates);
        }        
        if(typeof coordinates.lat == "function"){
            loc.lat = coordinates.lat();
            loc.lng = coordinates.lng();
        } else{
            loc.lat = coordinates.lat;
            loc.lng = coordinates.lng;
        }
        Location.update(() => loc);
        map.panTo(coordinates);    
    }
  
    onMount(async () => {
        loading = true;
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        AdvancedMarker = AdvancedMarkerElement;
        const {PinElement} = await google.maps.importLibrary("marker");
        AdvancedPinElement = PinElement;
        map = new google.maps.Map(container, {
            zoom,
            center,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            mapId: "366838839baed4ec"
        });

        google.maps.event.addListener(map, "click", function (event) {
            setMarker1(event.latLng);
        });
        loadSightingMarkers();
    });
    $:{
        if (map) {
            setTimeout(()=> {
                loading = false;
            }, 2000);
        }
    }
</script>
  
<div id = "map" class="full-screen w-auto {displayMap? "" : "hidden"}" bind:this={container} />
<!-- bottom-16 -->
<div class="btn-container absolute right-0 bottom-0 z-10 m-2 mb-5 flex flex-col gap-2 {displayMap? "" : "hidden"}">
    <div class="tooltip tooltip-left tooltip-accent " data-tip="Reload Sightings">
        <button class="btn btn-circle btn-accent" id = "reload-sightings" on:click={reloadSighting}>
            <svg class = "h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.61061 20 7.46589 18.9525 6 17.2916M9 17H6V17.2916M18.2002 4V6.94416M18.2002 6.94416V6.99993L15.2002 7M6 20V17.2916" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </button>
    </div>
    <div class="tooltip tooltip-left tooltip-secondary " data-tip="Go to Location">
        <button class="btn btn-circle btn-secondary" on:click={shiftToLocation}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-8" fill="none" viewBox="0 0 70 75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="5" d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289l16,24 C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289C54.289,34.008,56,29.219,56,24 C56,10.746,45.254,0,32,0z M32,32c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z" /></svg>
        </button>
    </div>
    <SightingModal/>
</div>

{#if loading}
    <div id="loading-container" class="absolute z-20 top-0 h-screen w-screen bg-white flex justify-center items-center " out:fade={{ duration: 500 }}>
        <div class="animated-svg-container contents">
            <img src="{splash}" alt="" class = "h-2/4">        
        </div>
    </div>
{/if}
  
<style>
    .full-screen {
        height: 100vh;
    }
</style>
  