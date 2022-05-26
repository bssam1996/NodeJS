const dev = process.env.NODE_ENV !== 'dev'

export const server = dev ? 'http://localhost:3000' : 'https://yourwebsite.com'