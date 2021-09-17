const get = async () => {

  const options = {
    enableHighAccuracy: true, //default false
    timeout: 5000, //default 0
    maximumAge: 0 // default 0
  }

  if(!navigator.geolocation) {
    console.warn('La geolocalización no está disponible');
  } else {
    const currentPosition = () => {
      return new Promise((resolve, reject) => {
        return navigator.geolocation.getCurrentPosition(resolve, reject, options)
      })
    }

    try {
      const data = await currentPosition()
      return data
    } catch (error) {
      console.log(error)
    }
  }
}

export default get