import { type ISorter } from '../interface/ISorter'
import { type SortAlgorithm } from '../type/SortAlgorithm'

class Sorter implements ISorter {
  sort (array: number[], algorithm: SortAlgorithm): number[] {
    switch (algorithm) {
      case 'bubble sort': return this.bubbleSort(array)
      case 'quicksort': return this.quickSort(array)

      default: throw new Error('Invalid sort algorithm')
    }
  }

  private bubbleSort (array: number[]): number[] {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < (array.length - i - 1); j++) {
        if (array[j] > array[j + 1]) {
          const temp = array[j]
          array[j] = array[j + 1]
          array[j + 1] = temp
        }
      }
    }
    return array
  }

  private swap (items: number[], leftIndex: number, rightIndex: number): void {
    const temp = items[leftIndex]
    items[leftIndex] = items[rightIndex]
    items[rightIndex] = temp
  }

  private partition (array: number[], left: number = 0, right: number = array.length - 1): number {
    const pivot = array[Math.floor((right + left) / 2)]
    let i = left
    let j = right
    while (i <= j) {
      while (array[i] < pivot) {
        i++
      }
      while (array[j] > pivot) {
        j--
      }
      if (i <= j) {
        this.swap(array, i, j)
        i++
        j--
      }
    }
    return i
  }

  private quickSort (array: number[], left: number = 0, right: number = array.length - 1): number[] {
    if (array.length > 1) {
      const index = this.partition(array, left, right)
      if (left < index - 1) {
        this.quickSort(array, left, index - 1)
      }
      if (index < right) {
        this.quickSort(array, index, right)
      }
    }
    return array
  }
}

export { Sorter }
