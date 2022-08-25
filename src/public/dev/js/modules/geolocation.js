const options = {
  enableHighAccuracy: true, //default false
  timeout: 5000, //default 0
  maximumAge: 0 // default 0
}

/**
 * Retorna una promesa con las coordenadas actuales
 * @returns {Promise}
 */
const getGeoLocation = async () => {
  // Si el navegador no soporta HTML5
  if (!navigator.geolocation) {
    return "La geolocalización no esté disponible"
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

export default getGeoLocation