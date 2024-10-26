<script lang="ts">
    import { PUBLIC_PHONE_NUMBER_1, PUBLIC_PHONE_NUMBER_2 } from '$env/static/public';

    let locating = false;
    let location: [number, number];
    let smsBody: string;
    function getLocation() {
        if (navigator.geolocation) {
            locating = true;
            navigator.geolocation.watchPosition(
                function(currentPosition) {
                    location = [currentPosition.coords.longitude, currentPosition.coords.latitude];
                    locating = false;
                },
                function(error) {
                    locating = false;
                }
            );
        }
    }
    $: if(location) { smsBody = encodeURI(`?&body=Please keep this location:\nlong: ${location[0]}\nlat: ${location[1]}\n`); }
    $: phoneNumber1Link = `sms:${PUBLIC_PHONE_NUMBER_1.replaceAll(' ', '')}${smsBody ? smsBody : ''}`;
    $: phoneNumber2Link = `sms:${PUBLIC_PHONE_NUMBER_2.replaceAll(' ', '')}${smsBody ? smsBody : ''}`;
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
            allow="geolocation"
            frameborder="0"
            scrolling="yes"
            marginheight="0"
            marginwidth="0"
            title="Borgarvefsjá"
            src="https://borgarvefsja.reykjavik.is/borgarvefsja/?x=357555.0&y=408196.8&z=4&gId=1729353065358"
        ></iframe>
    </section>

    <!-- Contact -->
    <section id="contact">
        <p>If anything seems off, please <button on:click={getLocation}>tap here</button> to get your location and contact my caretakers at either of these numbers:</p>
        <ul>
            <li>
                <a href="{phoneNumber1Link}">{PUBLIC_PHONE_NUMBER_1}</a>
                {#if locating}
                <img
                    class="spinning"
                    height="15em"
                    src="/arrow-rotate-clockwise-svgrepo-com.svg"
                    alt="A clockwise revolving arrow circling around a point"
                />
                {/if}            </li>
            <li>
                <a href="{phoneNumber2Link}">{PUBLIC_PHONE_NUMBER_2}</a>
                {#if locating}
                <img
                    class="spinning"
                    height="15em"
                    src="/arrow-rotate-clockwise-svgrepo-com.svg"
                    alt="A clockwise revolving arrow circling around a point"
                />
                {/if}
            </li>
        </ul>
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
    width: 90%;
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