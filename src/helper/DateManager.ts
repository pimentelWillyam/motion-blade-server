
class DateManager {
  getCurrentDateTime (): string {
    const rawDate = new Date()
    const minutes = rawDate.getMinutes().toString()
    const hours = rawDate.getHours().toString()
    const day = rawDate.getDate().toString()
    const month = (rawDate.getMonth() + 1).toString()
    const year = rawDate.getFullYear().toString()
    const formatedDate: string = ((day + '/' + month + '/' + year + ' ' + hours + ':' + minutes))
    return formatedDate
  }
}

export default DateManager
