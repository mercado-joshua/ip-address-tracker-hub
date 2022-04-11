const trackInfo = () => {
    const CONFIG = {
        IP_ACCESS_KEY: '',
        LEAFLET_ACCESS_TOKEN: ''
    };
    
    const form = document.querySelector('[data-js-tracker-form]');
    const ip = document.querySelector('[data-js-ip-address]');

    // configure leaflet.js
    const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

    const map = L.map('map').setView([ 0, 0 ], 1);

    const tileURL = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ CONFIG.LEAFLET_ACCESS_TOKEN }`;

    const tiles = L.tileLayer(tileURL, {
        attribution: attribution,
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:  CONFIG.LEAFLET_ACCESS_TOKEN 
    });

    tiles.addTo(map);

    const marker = L.marker([ 0, 0 ]).addTo(map); // set default marker

    // [5] - assigns and displays information
    const postInfo = (data) => {
        const { city, country, region, timezone, lat, lng } = data.location;
        
        console.log(data);
        const ip = document.querySelector('[data-js-ip-info]');
        const location = document.querySelector('[data-js-location-info]');
        const time = document.querySelector('[data-js-timezone-info]');
        const isp = document.querySelector('[data-js-isp-info]');

        // update DOM
        ip.textContent = data.ip;
        location.textContent = `${city}, ${country}, ${region}`;
        time.textContent = timezone;
        isp.textContent = data.isp;

        marker.setLatLng([ lat, lng ]); // update marker location
    }; 
    
    // [4] - gets the data and display info in the browser
    const getInfo = async (url) => {
        const response = await fetch(url);
        const json = await response.json();
        postInfo(json); 
    };

    // [3] - returns url to fetch data
    const buildRequestURL = (apiKey = '', ipAddress = '') => {
        return `https://ip-geolocation.whoisxmlapi.com/api/v1?apiKey=${apiKey}&ipAddress=${ipAddress}`;
    };
    
    
    // [2] - this will fetch data from the provided url
    const processInfo = async (apiKey, ipAddress) => {
        const requestURL = buildRequestURL(apiKey, ipAddress);
        await getInfo(requestURL);
    };

    // [1] - this will run first after the form is submitted
    const submitForm = () => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const value = ip.value.trim();

            // gets the form info
            processInfo(CONFIG.IP_ACCESS_KEY, value);  
        });
    };  

    submitForm();
};

document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'complete') trackInfo();
});