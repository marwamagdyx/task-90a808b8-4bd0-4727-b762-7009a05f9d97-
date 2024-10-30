<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { browser } from '$app/environment';
    import type { Map, Marker } from 'leaflet';
    import { fade } from 'svelte/transition';

    let mapElement: HTMLDivElement;
    let map: Map;
    let marker: Marker;
    let feedback = '';
    let showFeedback = false;
    let currentLocation = ''; 
    let isLocating = false;


    const dispatch = createEventDispatcher();  

    const defaultPosition = {
        lat: 51.505,
        lng: -0.09,
    };

    const showFeedbackMessage = (message: string) => {
        feedback = message;
        showFeedback = true;
        setTimeout(() => {
            showFeedback = false;
        }, 3000);
    };

    const storePinLocation = (position: { lat: number; lng: number }) => {
        try {
            localStorage.setItem('pinLocation', JSON.stringify(position));
            showFeedbackMessage('Location saved');
        } catch (error) {
            console.error('Error storing pin location:', error);
            showFeedbackMessage('Error saving location');
        }
    };

    const getPinLocation = (): { lat: number; lng: number } => {
        try {
            const saved = localStorage.getItem('pinLocation');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error getting pin location:', error);
        }
        return defaultPosition;
    };

    function debounce<T extends (...args: any[]) => any>(
        func: T,
        wait: number
    ): (...args: Parameters<T>) => void {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        return function (this: any, ...args: Parameters<T>) {
            const context = this;

            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                timeoutId = undefined;
                func.apply(context, args);
            }, wait);
        };
    }

    const debouncedStore = debounce((position: { lat: number; lng: number }) => {
        storePinLocation(position);
    }, 300);


    const confirmLocation = () => {
        if (marker) {
            const position = marker.getLatLng();
            storePinLocation({ lat: position.lat, lng: position.lng });
            showFeedbackMessage(`Location confirmed at: (${position.lat.toFixed(4)}, ${position.lng.toFixed(4)})`);
        }
    };

    const recenterMap = () => {
        if (map && marker) {
            const position = marker.getLatLng();
            map.setView([position.lat, position.lng], map.getZoom());
        }
    };

    onMount(async () => {
        if (browser) {
            const L = await import('leaflet');

            let savedPosition = getPinLocation();

            const mapOptions: L.MapOptions = {
                zoomControl: false,
                doubleClickZoom: false,
                touchZoom: true,
                dragging: true,
                zoomAnimation: true
            };

            map = L.map(mapElement, mapOptions).setView(
                [savedPosition.lat, savedPosition.lng],
                13
            );

            L.control.zoom({ position: 'bottomright' }).addTo(map);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);

            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin"></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
            });

            marker = L.marker([savedPosition.lat, savedPosition.lng], {
                draggable: true,
                icon
            }).addTo(map);

            if (L.Browser.touch) {
                map.on('touchstart', () => {
                    map.dragging.enable();
                });

                map.on('touchend', () => {
                    setTimeout(() => {
                        map.dragging.enable();
                    }, 100);
                });
            }

            marker.on('dragend', () => {
                const position = marker.getLatLng();
                debouncedStore({ lat: position.lat, lng: position.lng });
            });

            map.on('click', (e) => {
                const { lat, lng } = e.latlng;
                marker.setLatLng([lat, lng]);
                debouncedStore({ lat, lng });
            });

            const updateCurrentLocation = () => {
                const center = map.getCenter();
                currentLocation = `Latitude: ${center.lat.toFixed(4)}, Longitude: ${center.lng.toFixed(4)}`;
            };

            map.on('move', updateCurrentLocation);
            map.on('zoom', updateCurrentLocation);
            updateCurrentLocation();

            // Notify parent component that map is ready
            dispatch('mapReady');
        }
        if (browser) {
        window.addEventListener('resize', () => {
            setTimeout(() => {
                map.invalidateSize();
            }, 200);
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                map.invalidateSize();
            }, 200);
        });
    }
});
    </script>

<div class="map-container">
    <div class="location-header">
        {currentLocation}
    </div>
    {#if showFeedback}
        <div class="feedback-message" transition:fade={{ duration: 200 }}>
            {feedback}
        </div>
    {/if}
    <div bind:this={mapElement} class="w-full h-full z-0"></div>

    <div class="map-buttons">
        <button 
            type="button"
            on:click={confirmLocation} 
            class="confirm-btn"
        >
            Confirm
        </button>
        <button 
            type="button"
            on:click={recenterMap} 
            class="recenter-btn"
        >
            Center
        </button>
    </div>
</div>

<style>
   .map-container {
    width: 100%;
    height: 100%;
    position: relative;
    touch-action: pan-x pan-y; /* Allow map panning */
    z-index: 0; /* Ensure proper stacking context */
}

    .location-header {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.85);
        color: #f5f5f5;
        padding: 8px 16px;
        border-radius: 20px;
        z-index: 1000;
        font-size: 14px;
        display: flex;
        align-items: center;
        white-space: nowrap;
    }

    .feedback-message {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.85);
    color: #f5f5f5;
    padding: 8px 16px;
    border-radius: 20px;
    z-index: 3000; /* Increased z-index to be above buttons */
    font-size: 14px;
    transition: all 0.3s ease;
    white-space: nowrap;
    pointer-events: none; /* Allows clicks to pass through */
}

    .map-buttons {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 1500; 
    pointer-events: auto; 
    touch-action: manipulation;
    width: calc(100% - 32px); 
    justify-content: center;
}
.confirm-btn,
.recenter-btn {
    padding: 10px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-appearance: none; 
    user-select: none;
    position: relative;
    z-index: 1500; 
    min-height: 44px; 
}


    :global(.leaflet-container) {
        height: 100%;
        width: 100%;
    }

    :global(.custom-marker) {
        background: transparent;
        border: none;
    }

    :global(.marker-pin) {
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        background: #c41e3a;
        position: absolute;
        transform: rotate(-45deg);
        left: 50%;
        top: 50%;
        margin: -15px 0 0 -15px;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
        transition: transform 0.2s ease-in-out;
    }

    :global(.marker-pin::after) {
        content: '';
        width: 14px;
        height: 14px;
        margin: 8px 0 0 8px;
        background: #fff;
        position: absolute;
        border-radius: 50%;
    }

    :global(.custom-marker:hover .marker-pin) {
        transform: rotate(-45deg) scale(1.1);
    }

    @media (max-width: 768px) {
        .location-header {
            top: 5px;
            font-size: 12px;
            padding: 6px 12px;
        }

        .feedback-message {
        bottom: 80px; 
        font-size: 12px;
        padding: 6px 12px;
        position: fixed; 
        z-index: 3000; 
    }

        .map-buttons {
            bottom: 20px;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
            padding: 0 16px;
            position: fixed;
        z-index: 2000;
        }

        .confirm-btn,
    .recenter-btn {
        flex: 1;
        min-width: 80px;
        max-width: 120px;
        padding: 12px 8px;
        font-size: 13px;
        min-height: 44px; 
    }
    }
</style>