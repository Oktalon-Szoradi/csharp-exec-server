import { spawn } from 'child_process'
import fs from 'fs'

const runCommand = (command, args, timeout = 5000, commandDescription = '') => {
  return new Promise((resolve, reject) => {
    const spawnedProcess = spawn(command, args)

    const data = {
      command,
      commandDescription: '',
      output: '',
      error: '',
      exitCode: null,
      timedOut: false
    }

    data.commandDescription = commandDescription

    switch (command) {
      case 'mcs':
        data.commandDescription = 'compilation'
        break
      case 'mono':
        data.commandDescription = 'execution'
        break
    }

    const timer = setTimeout(() => {
      spawnedProcess.kill()
      data.timedOut = true
      data.error += `Timeout.\nProcess was killed due to execution lasting longer than ${
        timeout / 1000
      } seconds.`
    }, timeout)

    spawnedProcess.stdout.on('data', chunk => {
      data.output += chunk
    })

    spawnedProcess.stderr.on('data', chunk => {
      data.error += chunk
    })

    spawnedProcess.on('close', code => {
      clearTimeout(timer)
      data.exitCode = code
      resolve(data)
    })
  })
}

const sanitize = async code => {
  // TODO: Research how to actually sanitize

  const blacklist = [
    'System.Collections',
    'System.ComponentModel',
    'System.Configuration',
    'System.Data',
    'System.Diagnostics',
    'System.Drawing',
    'System.Globalization',
    'System.IO',
    'System.Management',
    'System.Messaging',
    'System.Net',
    'System.Reflection',
    'System.Resources',
    'System.Runtime',
    'System.Runtime.InteropServices',
    'System.Security',
    'System.Security.Cryptography',
    'System.ServiceProcess',
    'System.Text',
    'System.Threading',
    'System.Timers',
    'System.Web',
    'System.Windows',
    'System.Xml'
  ]

  for (const item of blacklist) {
    if (code.includes(item)) {
      throw new Error(`Your code has been rejected to due containing blacklisted: ${item}`)
    }
  }

  return code
}

export const runCSharp = async (code, user) => {
  code = await sanitize(code)

  fs.writeFileSync(`/tmp/${user}.cs`, code)

  const compilation = await runCommand('mcs', [`/tmp/${user}.cs`])

  if (compilation.exitCode !== 0) {
    spawn('rm', [`/tmp/${user}.cs`])
    return compilation
  }

  const execution = await runCommand('mono', [`/tmp/${user}.exe`])

  spawn('rm', [`/tmp/${user}.cs`])
  spawn('rm', [`/tmp/${user}.exe`])

  return execution
}
