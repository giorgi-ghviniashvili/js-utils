import { groups } from 'd3'

// GroupBy: {
// 	value: 'AcademicScore',
// 	label: 'Academic score',
// 	groupFn: value => {
// 		const group = academicScoreGroupFn(value)

// 		if (Array.isArray(group)) {
// 			return group.join(" - ")
// 		}
		
// 		return group
// 	}
// }

// Returns { key: 'root', children: [ ... ] }
export const getFlare = (
	flatdata,
	groupByOptions,
	leafNodeKey,
	rootNode = { key: 'root', id: 'root' }
) => {
	const getNode = d => {
		const newNode = { ...d }

		if (!newNode.key) {
			const key = leafNodeKey ? d[leafNodeKey] : getRandomId()
			newNode.id = `${key}_${getRandomId()}`
			newNode.key = key
		}

		return newNode
	}

	// Recursive
	const clusterify = (node, children, level) => {
		if (!node.children && children.length) {
			node.children = []
		}

		if (Array.isArray(children[0])) {
			children.forEach(([key, arr]) => {
				if (!key) {
					clusterify(node, arr, level + 1)
					return
				}

				const newNode = {
					key,
					id: `${key}_${getRandomId()}`,
					groupedBy: groupBy[level]
				}
				const clustered = clusterify(newNode, arr, level + 1)
				node.children.push(clustered)
			})
		} else {
			children.forEach(d => {
				const newNode = getNode(d)
				newNode.groupedBy = groupBy[level] || leafNodeKey
				node.children.push(newNode)
			})
		}

		return node
	}

	const grouped = groups(
		flatdata,
		...groupByOptions.map(({ value: key, groupFn }) => {
			if (groupFn) {
				return d => groupFn(d[key])
			}
			return d => d[key]
		})
	)

	return clusterify(rootNode, grouped, 0)
}
