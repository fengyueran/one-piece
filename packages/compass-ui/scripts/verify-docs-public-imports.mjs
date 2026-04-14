import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageName = '@xinghunm/compass-ui'
const scriptFile = fileURLToPath(import.meta.url)
const scriptDir = dirname(scriptFile)
const packageDir = resolve(scriptDir, '..')
const docsDir = resolve(packageDir, 'docs')
const packageJsonPath = resolve(packageDir, 'package.json')
const readmePath = resolve(packageDir, 'README.md')

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

const exportedSpecifiers = Object.keys(packageJson.exports ?? {}).map((exportKey) =>
  exportKey === '.' ? packageName : `${packageName}${exportKey.slice(1)}`,
)

const allowedSpecifiers = new Set(exportedSpecifiers)

const importPattern =
  /\b(?:import|export)\b[\s\S]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)|\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g
const internalPathPattern = /^@xinghunm\/compass-ui\/(?:src|dist)(?:\/|$)/
const internalAliasPattern =
  /^(?:@\/|~\/|src\/|dist\/|\.\/src\/|\.\/dist\/|\.\.\/src\/|\.\.\/dist\/)/

const collectMarkdownFiles = (directory) => {
  const entries = readdirSync(directory, { withFileTypes: true })

  return entries.flatMap((entry) => {
    const entryPath = join(directory, entry.name)

    if (entry.isDirectory()) {
      return collectMarkdownFiles(entryPath)
    }

    if (entry.isFile() && extname(entry.name) === '.md') {
      return [entryPath]
    }

    return []
  })
}

const filesToCheck = [...collectMarkdownFiles(docsDir), readmePath]
const violations = []

for (const filePath of filesToCheck) {
  if (!statSync(filePath).isFile()) {
    continue
  }

  const source = readFileSync(filePath, 'utf8')
  const matches = source.matchAll(importPattern)

  for (const match of matches) {
    const specifier = match[1] ?? match[2] ?? match[3]
    if (!specifier) {
      continue
    }

    if (internalPathPattern.test(specifier)) {
      violations.push({
        filePath,
        specifier,
        reason: '命中了 src/dist 内部路径',
      })
      continue
    }

    if (specifier.startsWith(`${packageName}/`) && !allowedSpecifiers.has(specifier)) {
      violations.push({
        filePath,
        specifier,
        reason: '未在 package.json.exports 中声明的公开子路径',
      })
      continue
    }

    if (internalAliasPattern.test(specifier)) {
      violations.push({
        filePath,
        specifier,
        reason: '依赖仓库内部 alias 或源码路径',
      })
    }
  }
}

if (violations.length > 0) {
  console.error('文档公开导入校验失败：\n')

  for (const violation of violations) {
    console.error(`- ${relative(packageDir, violation.filePath)}`)
    console.error(`  import: ${violation.specifier}`)
    console.error(`  reason: ${violation.reason}`)
  }

  process.exit(1)
}

console.log('文档公开导入校验通过。')
console.log(`已检查 ${filesToCheck.length} 个 Markdown 文件。`)
console.log(`允许的公开路径：${Array.from(allowedSpecifiers).join(', ')}`)
