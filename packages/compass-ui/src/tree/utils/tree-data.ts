import { DataNode } from '../types'

interface Entity {
  node: DataNode
  index: number
  key: string | number
  pos: string
  parent?: Entity
  children?: Entity[]
}

// Fixed traverse that returns list of entities for children assignment
function traverseDataNodesCorrected(
  dataNodes: DataNode[],
  parent: Entity | null,
  wrapper: {
    keyEntities: Record<string | number, Entity>
  },
): Entity[] {
  const entities: Entity[] = []

  dataNodes.forEach((node, index) => {
    const { key, children } = node
    const pos = parent ? `${parent.pos}-${index}` : `${index}`

    const entity: Entity = {
      node,
      index,
      key,
      pos,
      parent: parent || undefined,
    }

    wrapper.keyEntities[key] = entity
    entities.push(entity)

    if (children) {
      entity.children = traverseDataNodesCorrected(children, entity, wrapper)
    }
  })

  return entities
}

export function convertTreeToEntities(treeData: DataNode[]): {
  keyEntities: Record<string | number, Entity>
} {
  const keyEntities: Record<string | number, Entity> = {}

  traverseDataNodesCorrected(treeData, null, { keyEntities })

  return { keyEntities }
}

/**
 * Conduct check with trigger key
 */
export function conductCheckWithTrigger(
  key: string | number,
  checked: boolean, // true if checking, false if unchecking
  currentCheckedKeys: (string | number)[],
  keyEntities: Record<string | number, Entity>,
): {
  checkedKeys: (string | number)[]
} {
  const checkedKeys = new Set(currentCheckedKeys)
  const entity = keyEntities[key]

  if (!entity) {
    return { checkedKeys: Array.from(checkedKeys) }
  }

  // 1. Conduct Down
  // Add/Remove self and all descendants from Set
  function conductDown(nodeEntity: Entity) {
    if (checked) {
      checkedKeys.add(nodeEntity.key)
    } else {
      checkedKeys.delete(nodeEntity.key)
    }
    if (nodeEntity.children) {
      nodeEntity.children.forEach((child) => conductDown(child))
    }
  }
  conductDown(entity)

  // 2. Conduct Up
  // Traverse up to root, check if parents need to be checked/unchecked
  // Rule: Parent is checked IF AND ONLY IF all children are checked

  let current = entity.parent
  while (current) {
    if (current.children) {
      const allChildrenChecked = current.children.every((child) => checkedKeys.has(child.key))

      if (allChildrenChecked) {
        checkedKeys.add(current.key)
      } else {
        checkedKeys.delete(current.key)
      }
    }
    current = current.parent
  }

  return {
    checkedKeys: Array.from(checkedKeys),
  }
}
