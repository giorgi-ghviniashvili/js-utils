import { groups, timeFormat } from 'd3'

// Returns { key: 'root', children: [ ... ] }
export const getFlare = (flatdata, groupBy, keyFn) => {
	const clusterify = (obj, children) => {
		if (Array.isArray(children[0])) {
			obj.children = children.map(([key, arr]) =>
				clusterify({ key, id: `${key}_${getRandomId()}` }, arr)
			)
		} else {
			obj.children = children.map(d => {
				const obj = { ...d, originalData: d }

				if (!obj.key && keyFn) {
					obj.key = keyFn(d)
				}
				return obj
			})
		}
		return obj
	}

	const grouped = groups(flatdata, ...groupBy.map(key => d => d[key]))

	return clusterify({ key: 'root' }, grouped)
}
