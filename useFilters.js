// USE THIS FUNCTION TO RENDER FILTERS
// A react hook that finds filter options for category and range filters. 
// The filterConfig should look like this:
// [
// 	{
// 		type: 'category',
// 		label: 'Academic Score',
// 		field: 'AcademicScore', // Data field
// 		optionsField: 'AcademicScore', // this one will be used to save filter's value in filterObject. 
// 		groupFn: () => {} // Use this function for custom grouping. For example, if you want to have category filter with 10ths of buckets: [0-10, 10-20, etc]
// 	},
// 	{
// 		type: 'category',
// 		label: 'Match Source',
// 		field: 'Source',
// 		optionsField: 'sources'
// 	},
// 	{
// 		type: 'category',
// 		label: 'Current Job',
// 		field: 'CurrentJob',
// 		optionsField: 'CurrentJobs'
// 	},
// 	{
// 		type: 'category',
// 		label: 'User Match Feedback',
// 		field: 'MatchType',
// 		optionsField: 'MatchTypes'
// 	},
// 	{
// 		type: 'category',
// 		label: 'Location',
// 		field: 'Location',
// 		optionsField: 'Locations'
// 	},
// 	{
// 		type: 'category',
// 		label: 'Notice Period',
// 		field: 'NoticePeriod',
// 		optionsField: 'NoticePeriods'
// 	},
// 	{
// 		type: 'category',
// 		label: 'Candidate Status',
// 		field: 'CandidateStatus',
// 		optionsField: 'CandidateStatuses'
// 	},
// 	{
// 		type: 'range',
// 		label: 'Target candidate salary',
// 		field: 'TargetSalary',
// 		optionsField: 'TargetSalaries',
// 		minField: 'TargetSalary',
// 		maxField: 'TargetSalary'
// 	}
// ]


import { ascending, rollups, min, max } from 'd3'
import { useEffect, useState } from 'react'

const groupFn = (d, config) => {
	if (typeof config.groupFn === 'function' && d[config.field]) {
		return config.groupFn(d[config.field])
	}
	return d[config.field] || ''
}

const labelFormat = (d, config) => {
  if (Array.isArray(d)) {
    if (d.length) {
      return d.join(" - ")
    }
    return "N/A"
  }

  return d || "N/A"
}

const RANGE_MIN = 0
const RANGE_MAX = 100000

export default function useFilters({ data, filtersConfig }) {
	const [filters, setFilters] = useState([])

	useEffect(() => {
		if (!data.length) {
			return
		}

		// Category filters
		const categoryFilters = filtersConfig
			.filter(d => d.type === 'category')
			.reduce((obj, config) => {
				// Subgroups
				if (config.subgroupField) {
					const options = rollups(
						data,
						arr => {
							const group = arr[0][config.subgroupField]
							return Array.from(new Set(arr.map(d => groupFn(d, config))))
								.map((d, i) => {
									return {
										label: labelFormat(d, config),
										value: d,
										group: group,
										showGroup: i === 0
									}
								})
								.sort((a, b) => ascending(a.label, b.label))
						},
						d => d[config.subgroupField]
					)
						.map(d => d[1])
						.flat()
					obj[config.optionsField] = options
				} else {
					// Just categories
					const options = Array.from(new Set(data.map(d => groupFn(d, config))))
					obj[config.optionsField] = options
						.map(d => ({
							label: labelFormat(d, config),
							value: d
						}))
						.sort((a, b) => ascending(a.label, b.label))
				}
				return obj
			}, {})

		// Range filters
		const rangeFilters = filtersConfig
			.filter(d => d.type === 'range')
			.reduce((obj, config) => {
				const minField = config.minField || config.field
				const maxField = config.maxField || config.field

				obj[config.optionsField] = [
					min(data, d => d[minField]) * 0.5 || RANGE_MIN,
					max(data, d => d[maxField]) * 1.5 || RANGE_MAX
				]

				return obj
			}, {})

		// All filter options
		const filterOptions = {
			...categoryFilters,
			...rangeFilters
		}

		const allFilters = filtersConfig.map(d => {
			return {
				...d,
				options: filterOptions[d.optionsField] || []
			}
		})

		setFilters(allFilters)
	}, [data, filtersConfig])

	return filters
}
