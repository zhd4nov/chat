export default {
  SOCKET_URL: process.env.NODE_ENV === 'production'
    ? `${document.location.protocol}//${document.location.host}`
    : 'http://localhost:8080',
}
