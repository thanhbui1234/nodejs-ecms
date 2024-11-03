import { log } from 'console'
import mongoose, { set } from 'mongoose'
import os from 'os'
const _second = 5000

export const countConnect = () => {
  const numConnecTion = mongoose.connections.length
  console.log(`Number of connections: ${numConnecTion}`)
}

export const checkOverload = () => {
  setInterval(() => {
    const numcore = os.cpus().length

    // Check memory
    const memory = process.memoryUsage().heapUsed / 1024 / 1024
    const memoryTotal = os.totalmem() / 1024 / 1024
    log('Total memory: ', memoryTotal, 'MB')
    console.log('Memory used: ', memory, 'MB')

    // Example: maximum number of connections
    const maxConnection = numcore * 5

    if (numcore > maxConnection) {
      console.log('Overload connection')
    }
  }, _second)
}
