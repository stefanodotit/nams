const getPath = (rawUrl) => {
  if(typeof(rawUrl) !== 'string') {
    throw Error('"getPath" parameter must be a String')
  }
  const rawUrlSplitted = rawUrl.split('?')
  return {
    path: rawUrlSplitted[0],
    query: rawUrlSplitted[1] || ''
  }
}

module.exports = {
  getPath
}