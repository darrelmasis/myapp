const postData = async (uri, method, data) => {
  const header = new Headers()
  header.append('Content-Type', 'application/json')

  const postData = {
    method: method,
    headers: header,
    body: JSON.stringify(data)
  }

  const response = await (await fetch(uri, postData)).json()
  return response
};

export {postData}