import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptFile = fileURLToPath(import.meta.url)
const scriptDir = dirname(scriptFile)
const packageDir = resolve(scriptDir, '..')
const repoRoot = resolve(packageDir, '..', '..')
const consumerDir = resolve(packageDir, 'test-consumer')

const run = (step, args, cwd) => {
  try {
    execFileSync('pnpm', args, {
      cwd,
      stdio: 'inherit',
    })
  } catch (error) {
    throw new Error(`${step} failed`, { cause: error })
  }
}

const tempDir = mkdtempSync(join(tmpdir(), 'compass-ui-pack-'))
const tempConsumerDir = resolve(tempDir, 'test-consumer')

try {
  run('build', ['--filter', '@xinghunm/compass-ui', 'build'], repoRoot)
  run('publint', ['dlx', 'publint', packageDir], repoRoot)
  run('pack', ['--dir', packageDir, 'pack', '--pack-destination', tempDir], repoRoot)

  const tarballName = readdirSync(tempDir).find((fileName) => fileName.endsWith('.tgz'))
  if (!tarballName) {
    throw new Error('pack failed: no tarball generated')
  }

  const tarballPath = resolve(tempDir, tarballName)

  cpSync(consumerDir, tempConsumerDir, { recursive: true })

  run('consumer install', ['install', '--no-lockfile'], tempConsumerDir)
  run('consumer add tarball', ['add', '--save-exact', tarballPath], tempConsumerDir)
  run('consumer typecheck', ['exec', 'tsc', '--noEmit'], tempConsumerDir)
} finally {
  rmSync(tempDir, { recursive: true, force: true })
}
