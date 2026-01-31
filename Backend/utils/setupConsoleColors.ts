import chalk from 'chalk'

const origError = console.error
console.error = (error: unknown) => {
  origError(chalk.red(String(error)))
}

const origInfo = console.info
console.info = (info: unknown) => {
  origInfo(chalk.blue(String(info)))
}
