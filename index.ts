import { app } from './src/app.js'

console.log('Starting server...')

// Start the application
app.start().then(() => {
  console.log('Server started successfully!')
}).catch(error => {
  console.error('Failed to start application:', error)
  process.exit(1)
})
