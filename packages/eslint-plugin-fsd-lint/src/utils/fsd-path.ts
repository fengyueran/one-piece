import { normalize, sep, resolve, dirname } from 'path'
import { LAYERS } from './constants'
import { FsdConfig } from './types'

export interface ParsedFileStructure {
  layer: (typeof LAYERS)[number] | null
  slice: string | null
  fileName: string
  fullPath: string[]
  layerIndex: number
  srcIndex: number
}

export type ImportKind = 'relative' | 'alias' | 'atAlias' | 'bare'

export interface ImportResolution {
  kind: ImportKind
  aliasPrefix?: string
  aliasTargetAbs?: string
  resolvedAbs: string
}

export function parseFileStructure(filePath: string, config?: FsdConfig): ParsedFileStructure {
  const normalizedPath = normalize(filePath)
  const pathSegments = normalizedPath.split(sep)
  const fileName = pathSegments[pathSegments.length - 1]

  let srcIndex = -1

  if (config?.srcRootDir) {
    const srcRootDir = normalize(config.srcRootDir)
    if (!srcRootDir.startsWith(sep) && !srcRootDir.match(/^[A-Za-z]:/)) {
      throw new Error(`srcRootDir must be an absolute path, got: ${config.srcRootDir}`)
    }

    if (normalizedPath.startsWith(srcRootDir + sep) || normalizedPath === srcRootDir) {
      // Do NOT filter empty segments; keep indices aligned with pathSegments
      const srcSegments = srcRootDir.split(sep)
      srcIndex = srcSegments.length - 1
    }
  } else {
    // Align behavior with resolveImportDetailed: choose the last occurrence of 'src'
    for (let i = pathSegments.length - 1; i >= 0; i--) {
      if (pathSegments[i] === 'src') {
        srcIndex = i
        break
      }
    }
  }

  const layerIndex = srcIndex + 1
  const layer = pathSegments[layerIndex] as (typeof LAYERS)[number] | null
  const slice = pathSegments[layerIndex + 1] || null

  return {
    layer,
    slice,
    fileName,
    fullPath: pathSegments,
    layerIndex,
    srcIndex,
  }
}

// Returns detailed import resolution info along with resolved absolute path
export function resolveImportDetailed(
  importPath: string,
  currentFilePath: string,
  config?: FsdConfig,
): ImportResolution {
  const currentDir = dirname(currentFilePath)

  // relative
  if (importPath.startsWith('.')) {
    return {
      kind: 'relative',
      resolvedAbs: resolve(currentDir, importPath),
    }
  }

  // configured aliases - choose longest match
  const aliases = config?.pathAliases
  if (aliases && typeof aliases === 'object') {
    const entries = Object.entries(aliases).sort((a, b) => b[0].length - a[0].length)
    for (const [alias, targetAbs] of entries) {
      if (importPath.startsWith(alias)) {
        const rel = importPath.substring(alias.length)
        return {
          kind: 'alias',
          aliasPrefix: alias,
          aliasTargetAbs: targetAbs,
          resolvedAbs: resolve(targetAbs, rel),
        }
      }
    }
  }

  // '@/': prefer config.srcRootDir if present
  if (importPath.startsWith('@/')) {
    const srcRootAbs = config?.srcRootDir
      ? normalize(config.srcRootDir)
      : (() => {
          const parts = currentDir.split(sep)
          const srcIdx = parts.lastIndexOf('src')
          if (srcIdx !== -1) {
            const projectRoot = parts.slice(0, srcIdx).join(sep)
            return resolve(projectRoot, 'src')
          }
          return ''
        })()

    if (srcRootAbs) {
      return {
        kind: 'atAlias',
        aliasPrefix: '@/',
        aliasTargetAbs: srcRootAbs,
        resolvedAbs: resolve(srcRootAbs, importPath.substring(2)),
      }
    }
    // fallthrough to bare if not resolvable
  }

  // bare module
  return {
    kind: 'bare',
    resolvedAbs: importPath,
  }
}

export function parseImportStructure(
  importPath: string,
  currentFilePath: string,
  config?: FsdConfig,
): { resolution: ImportResolution; structure: ParsedFileStructure } {
  const resolution = resolveImportDetailed(importPath, currentFilePath, config)
  const structure = parseFileStructure(resolution.resolvedAbs, config)
  return { resolution, structure }
}
