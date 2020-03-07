
function lsSet(name, data) {
  return localStorage.setItem(`cai-js:${name}`, JSON.stringify(data))
}
function lsGet(name) {
  return localStorage.getItem(`cai-js:${name}`)
}

export {lsSet, lsGet}