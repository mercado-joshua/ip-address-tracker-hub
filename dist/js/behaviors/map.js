"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var trackInfo = function trackInfo() {
  var CONFIG = {
    IP_ACCESS_KEY: '',
    LEAFLET_ACCESS_TOKEN: ''
  };
  var form = document.querySelector('[data-js-tracker-form]');
  var ip = document.querySelector('[data-js-ip-address]'); // configure leaflet.js

  var attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
  var map = L.map('map').setView([0, 0], 1);
  var tileURL = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=".concat(CONFIG.LEAFLET_ACCESS_TOKEN);
  var tiles = L.tileLayer(tileURL, {
    attribution: attribution,
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: CONFIG.LEAFLET_ACCESS_TOKEN
  });
  tiles.addTo(map);
  var marker = L.marker([0, 0]).addTo(map); // set default marker
  // [5] - assigns and displays information

  var postInfo = function postInfo(data) {
    var _data$location = data.location,
        city = _data$location.city,
        country = _data$location.country,
        region = _data$location.region,
        timezone = _data$location.timezone,
        lat = _data$location.lat,
        lng = _data$location.lng;
    console.log(data);
    var ip = document.querySelector('[data-js-ip-info]');
    var location = document.querySelector('[data-js-location-info]');
    var time = document.querySelector('[data-js-timezone-info]');
    var isp = document.querySelector('[data-js-isp-info]'); // update DOM

    ip.textContent = data.ip;
    location.textContent = "".concat(city, ", ").concat(country, ", ").concat(region);
    time.textContent = timezone;
    isp.textContent = data.isp;
    marker.setLatLng([lat, lng]); // update marker location
  }; // [4] - gets the data and display info in the browser


  var getInfo = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
      var response, json;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch(url);

            case 2:
              response = _context.sent;
              _context.next = 5;
              return response.json();

            case 5:
              json = _context.sent;
              postInfo(json);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getInfo(_x) {
      return _ref.apply(this, arguments);
    };
  }(); // [3] - returns url to fetch data


  var buildRequestURL = function buildRequestURL() {
    var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var ipAddress = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    return "https://ip-geolocation.whoisxmlapi.com/api/v1?apiKey=".concat(apiKey, "&ipAddress=").concat(ipAddress);
  }; // [2] - this will fetch data from the provided url


  var processInfo = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(apiKey, ipAddress) {
      var requestURL;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              requestURL = buildRequestURL(apiKey, ipAddress);
              _context2.next = 3;
              return getInfo(requestURL);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function processInfo(_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }(); // [1] - this will run first after the form is submitted


  var submitForm = function submitForm() {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var value = ip.value.trim(); // gets the form info

      processInfo(CONFIG.IP_ACCESS_KEY, value);
    });
  };

  submitForm();
};

document.addEventListener('readystatechange', function (event) {
  if (event.target.readyState === 'complete') trackInfo();
});