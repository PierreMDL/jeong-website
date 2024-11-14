<script lang="ts">
    import { PUBLIC_PHONE_NUMBER_1, PUBLIC_PHONE_NUMBER_2 } from '$env/static/public';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

    export let data: PageData;

    let message: string;
    let locating = false;
    let longitude: number;
    let latitude: number;
    let smsBody: string;
    let lastSentLongLat: [number, number];

    onMount(async () => {
        if (navigator.geolocation) {
            locating = true;
            void navigator.geolocation.watchPosition(
                function(currentPosition) {
                    longitude = currentPosition.coords.longitude;
                    latitude = currentPosition.coords.latitude;
                    locating = false;
                    sendMessage();
                },
                function(error) {
                    console.log(error);
                    locating = false;
                },
                {
                    enableHighAccuracy: true
                }
            );
        }
    });

    async function sendMessage(): Promise<void> {
        fetch('/message', {
            method: 'POST',
            body: JSON.stringify({
                sessionId: data.sessionId,
                long: longitude,
                lat: latitude,
                tagNumber: data.tagNumber,
                message: message
            })
        });
    }

    $: if(longitude && latitude) { smsBody = encodeURI(`?&body=Please keep this location:\nlong: ${longitude}\nlat: ${latitude}\n`); }
    $: phoneNumber1 = {
        formatted: PUBLIC_PHONE_NUMBER_1,
        tel: `tel:${PUBLIC_PHONE_NUMBER_1.replaceAll(' ', '')}`,
        sms: `sms:${PUBLIC_PHONE_NUMBER_1.replaceAll(' ', '')}${smsBody ? smsBody : ''}`
    }
    $: phoneNumber2 = {
        formatted: PUBLIC_PHONE_NUMBER_2,
        tel: `tel:${PUBLIC_PHONE_NUMBER_2.replaceAll(' ', '')}`,
        sms: `sms:${PUBLIC_PHONE_NUMBER_2.replaceAll(' ', '')}${smsBody ? smsBody : ''}`
    }
</script>

<div class="content">
    <!-- Intro -->
    <section id="intro">
        <h1 class="child">Hi I'm Jeong</h1>
        <img class="child"src="/jeong.png" alt="A gray cat">
        <p class="child">In my neighbourhood I'm also called Chatouille, Potok, Mademoiselle de la Vibrisse, Slutty Ninja or Chica</p> 
    </section>

    <!-- Status and Map -->
    <section id="map">
        <p>Right now I'm not lost, just roaming around. I'm generally around this area:</p>
        <iframe
            class="embedded-map"
            loading="lazy"
            allow="geolocation"
            title="Borgarvefsjá"
            src="https://borgarvefsja.reykjavik.is/borgarvefsja/?x=357555.0&y=408196.8&z=4&gId=1729353065358"
        ></iframe>
        <!-- TODO -->
        <p>Did you spot me? Send my position so my caretakers know my area better!</p>
        <button on:click={sendMessage} disabled={lastSentLongLat && (lastSentLongLat[0] === longitude && lastSentLongLat[1] === latitude)}>
            Turn on GPS and click here
            {#if locating}
            <img
                class="spinning"
                height="15em"
                src="/arrow-rotate-clockwise-svgrepo-com.svg"
                alt="An arrow circling clockwise around a point"
            />
            {/if}
        </button>
    </section>

    <!-- Contact -->
    <section id="contact">
        <div>
            <p>If anything seems off, please contact my caretakers at either of these numbers:</p>
            <ul>
                <li>
                    <a href="{phoneNumber1.tel}">{phoneNumber1.formatted}</a> <button on:click={() => location.href = phoneNumber1.sms}>SMS</button>
                </li>
                <li>
                    <a href="{phoneNumber2.tel}">{phoneNumber2.formatted}</a> <button on:click={() => location.href = phoneNumber2.sms}>SMS</button>
                </li>
            </ul>
        </div>
        <div>
            <!-- <p>You can also send them a message:</p> -->
            <label for="message-area">You can also send them a message:</label>
            <br/>
            <textarea
                id="message-area"
                placeholder="Your message here"
                bind:value={message}
                style="width: 100%"
                rows="15"
            ></textarea>
            <br/>
            <button disabled={!message} on:click={sendMessage}>Send</button>
        </div>
        <p>If you're a neighbour and I visit you regularly, they would like to hear from you!</p>
    </section>
</div>

<style scoped>
.content {
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    scroll-snap-type: y mandatory;
    scroll-snap-stop: always;
}

section {
    height: 100vh;
    margin: auto;
    max-width: 1000px;
    padding-left: 2vw;
    padding-right: 2vw;
    /* padding: 2vh 2vw; */
    align-content: center;
    scroll-snap-align: start;
}

#intro {
    display: flex;
    flex-flow: column wrap;
    justify-content: space-around;
    align-items: center;
    /* gap: 2vw; */
}
.child {
    @media (orientation: landscape) {
        max-width: 40%;
        margin: 10px;
    }
}
#intro :nth-child(2) {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    @media (orientation: landscape) {
        order: -1;
    }
}

#map {
    display: flex;
    flex-direction: column;
}
.embedded-map {
    flex-grow: 1;
    /*
    pointer-events: none to prevent scrolling the map instead of the page
    But that disables iframe pointer capture entirely.
    */
    /* pointer-events: none;  */
    /* width: 90%; */
}

@keyframes rotation {
    from {transform: rotate(0deg);}
    to {transform: rotate(359deg);}
}
.spinning {
    display: inline-block;
    animation: rotation .6s infinite linear;
}
</style>