document.querySelector('button').onclick = () => {
  const ip = document.querySelector('input').value;
  getIpInfo(ip);
};

document.querySelector('input').onkeydown = (e) => {
  if (e.key === 'Enter') {
    getIpInfo(e.target.value);
  }
};

const initMap = () => {
  var mymap = L.map('mapid').setView([20, 20], 13);

  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2FrYXNpZGFuaWVsIiwiYSI6ImNrcmh0dDdxZTJwMmUydnF1NHZ3ZWFuZzcifQ.U7-SduifSknJvQADTQDVEg',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/dark-v10',
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        'pk.eyJ1Ijoia2FrYXNpZGFuaWVsIiwiYSI6ImNrcmh0dDdxZTJwMmUydnF1NHZ3ZWFuZzcifQ.U7-SduifSknJvQADTQDVEg',
    }
  ).addTo(mymap);

  document.querySelector('.leaflet-control-zoom').style.display = 'none';
  document.querySelector('.leaflet-control-container').style.opacity = '0';

  return function (lat, lng) {
    mymap.flyTo([lat, lng], 13);
    var circle = L.circle([lat, lng], {
      color: 'rgba(0, 173, 255,0.5)',
      fillColor: 'rgba(0, 173, 255)',
      fillOpacity: 0.2,
      radius: 1000,
    }).addTo(mymap);
  };
};

const drawMap = initMap();

async function getClientIp() {
  const res = await fetch('https://api.ipify.org/?format=json');
  const data = await res.json();
  return data.ip;
}

const getIpInfo = (ip) => {
  fetch(
    `https://geo.ipify.org/api/v1?apiKey=at_tqr7wGRZ8DA0TXbzSYBuW8rC8cBht&domain=${ip}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (!data.code) {
        document.querySelector('.ipValue').innerText = data.ip;
        document.querySelector(
          '.locationValue'
        ).innerText = `${data.location.country}, ${data.location.region},\n${data.location.city}`;
        document.querySelector(
          '.timezoneValue'
        ).innerText = `UTC ${data.location.timezone}`;
        document.querySelector('.ispValue').innerText = data.isp;
        const lat = data.location.lat;
        const lng = data.location.lng;
        drawMap(lat, lng);
      } else {
        showError();
      }
    });
};

getClientIp().then((ip) => getIpInfo(ip));

const showError = () => {
  const errorElement = document.createElement('div');
  errorElement.innerText = 'Inserta a valid IP/Domain.';
  errorElement.style.padding = '20px';
  errorElement.style.color = '#fff';
  errorElement.style.background = 'rgba(255, 0, 0, 0.438)';
  errorElement.style.position = 'absolute';
  errorElement.style.top = '30px';
  errorElement.style.left = '50%';
  errorElement.style.transform = 'translateX(-50%)';
  document.querySelector('body').appendChild(errorElement);
  setTimeout(() => {
    errorElement.remove();
  }, 2000);
};
