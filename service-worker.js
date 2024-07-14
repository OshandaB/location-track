self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'getLocationSync') {
    event.waitUntil(getLocationAndNotify());
  }
});

function getLocationAndNotify() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          const timestamp = new Date(position.timestamp).toString();
          
          self.registration.showNotification('Location Update', {
            body: `Latitude: ${latitude}\nLongitude: ${longitude}\nAccuracy: ${accuracy} meters\nTimestamp: ${timestamp}`,
            icon: 'icon.png'
          });

          console.log('Background position obtained:', position);
          resolve();
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      reject(new Error('Geolocation not supported'));
    }
  });
}
