import { DataNode, FlattenNode } from '../types'

/**
 * Flatten tree data to a list for virtual scrolling
 */
export function flattenTreeData(
  treeNodeList: DataNode[] = [],
  expandedKeys: (string | number)[] = [],
): FlattenNode[] {
  const expandedKeySet = new Set(expandedKeys)
  const flattenedList: FlattenNode[] = []

  function dig(list: DataNode[], parent: FlattenNode | null = null, level = 0, parentPos = '0') {
    return list.map((treeNode, index) => {
      const pos = `${parentPos}-${index}`
      const flattenedNode: FlattenNode = {
        ...treeNode,
        parent,
        children: [],
        pos,
        data: treeNode,
        level,
        key: treeNode.key,
        title: treeNode.title,
      }

      flattenedList.push(flattenedNode)

      // Only flatten children if expanded
      if (expandedKeySet.has(treeNode.key)) {
        flattenedNode.children = dig(treeNode.children || [], flattenedNode, level + 1, pos)
      } else {
        flattenedNode.children = []
      }

      return flattenedNode
    })
  }

  dig(treeNodeList)
  return flattenedList
}
