import getGeoLocation from '../modules/geolocation'
import { postData } from "./postData";

const maps = async (userData) => {
  let geolocation = await getGeoLocation()
  console.log(userData)
  let currentPosition = {
    lat: geolocation.coords.latitude,
    lng: geolocation.coords.longitude
  }

  let map, infoWindow

  map = new google.maps.Map(myMap, { center: currentPosition, zoom: 15, })

  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");
  locationButton.textContent = "Ubicación Actual";
  locationButton.classList.add('btn','btn-primary', 'mt-3');
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton)

  locationButton.addEventListener('click', async () => {
    let newPos = await getGeoLocation()
    let currentPosition = {
      lat: newPos.coords.latitude,
      lng: newPos.coords.longitude
    }
    const marker = new google.maps.Marker({
      position: currentPosition,
      map: map,
      //animation: google.maps.Animation.DROP,
      icon: `${userData.cloud}/w_32,h_32,c_fill,g_face,r_max/${userData.avatar}`
    });

    const center = new google.maps.LatLng(currentPosition.lat, currentPosition.lng);
  // using global variable:
    map.panTo(center);
    const currentZoom = map.getZoom()
    console.log(currentZoom)
    currentZoom != 15 ? map.setZoom(15) : null
  })
}


export default maps