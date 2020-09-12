export const get = (endpoint, isAuthenticated = true, clearIfNotAllowed = true) => {
  return request(endpoint, 'GET', null, isAuthenticated, clearIfNotAllowed)
}

export const request = (endpoint, method, data, isAuthenticated = true, clearIfNotAllowed = true) => {
  const config = {
    method,
    headers: { 'content-type': 'application/json' }
  }

  if (isAuthenticated) config.headers['authorization'] = window.localStorage.getItem('user_token')

  if (/^POST$|^PUT$/g.test(method)) config.body = JSON.stringify(data)

  return window.fetch(endpoint, config).then(response => {
    if (response.status === 401 && clearIfNotAllowed) window.localStorage.clear()
    if (response.ok) return response.json()
    else return Promise.reject(response.statusText)
  }).then(json => {
    return (json.success || json.sucesso)
      ? Promise.resolve(json)
      : Promise.reject(json)
  })
}
