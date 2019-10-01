const urlHelper = require('../urlHelper')

describe('urlHelper', () => {
  describe('getPath(rawUrl:string): boolean', () => {
    it('should throw an Error if "rawUrl" is not a string', () => {
      const callGetPathWithObject = () => urlHelper.getPath({})
      const callGetPathWithNumber = () => urlHelper.getPath(123)
      const callGetPathWithArray = () => urlHelper.getPath([])
      const callGetPathWithString = () => urlHelper.getPath('')

      expect(callGetPathWithObject).toThrowError('"getPath" parameter must be a String')
      expect(callGetPathWithNumber).toThrowError('"getPath" parameter must be a String')
      expect(callGetPathWithArray).toThrowError('"getPath" parameter must be a String')
      expect(callGetPathWithString).not.toThrowError()
    })
    it('should return an object with "path" and "query" keys if "rawUrl" is a string', () => {
      const res = urlHelper.getPath('')
      expect(Object.keys(res)).toStrictEqual(['path','query'])
    })
    it('should return "rawUrl" without query string as "url" response key', () => {
      expect(urlHelper.getPath('https://www.musement.com').path).toBe('https://www.musement.com')
      expect(urlHelper.getPath('/18n/test').path).toBe('/18n/test')
      expect(urlHelper.getPath('?q=Rome').path).toBe('')
      expect(urlHelper.getPath('https://www.musement.com?q=Rome').path).toBe('https://www.musement.com')
      expect(urlHelper.getPath('/search?q=Rome').path).toBe('/search')
    })
    it('should return "rawUrl" query string as "query" response key', () => {
      expect(urlHelper.getPath('?q=Rome').query).toBe('q=Rome')
      expect(urlHelper.getPath('https://www.musement.com?q=Rome').query).toBe('q=Rome')
      expect(urlHelper.getPath('/search?q=Rome').query).toBe('q=Rome')
    })
    it('should return empty string as "query" response key if there\'s no query string in rawUrl', () => {
      expect(urlHelper.getPath('https://www.musement.com').query).toBe('')
      expect(urlHelper.getPath('/18n/test').query).toBe('')
    })
  })
})