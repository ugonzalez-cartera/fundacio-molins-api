import { app } from './src/app.js'

console.info('Starting server...')

// Start the application
app.start().then(() => {
  console.info('Server started successfully!')
}).catch(error => {
  console.error('Failed to start application:', error)
  process.exit(1)
})
