import { type SortAlgorithm } from '../type/SortAlgorithm'

interface ISorter {
  sort: (array: number[], algorithm: SortAlgorithm) => number[]
}

export type { ISorter }
