export const isInIframe = window.self !== window.top

export const jsonSafeParse = (data: string|object) => {
  if (typeof data === 'string') {
    try {
      const obj = JSON.parse(data)
      if (typeof obj === 'object' && obj) {
        return obj
      }
    } catch (e) {
      return data
    }
  }
  return data
}
