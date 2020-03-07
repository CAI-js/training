
function lsSet(name, data) {
  return localStorage.setItem(`cai-js:${name}`, JSON.stringify(data))
}
function lsGet(name) {
  const result = localStorage.getItem(`cai-js:${name}`)
  return result ? JSON.parse(result) : result
}

export {lsSet, lsGet}