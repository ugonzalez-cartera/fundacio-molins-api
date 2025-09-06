import { app } from './src/app.js'

// Start the application
app.start().catch(error => {
  console.error('Failed to start application:', error)
  process.exit(1)
})
