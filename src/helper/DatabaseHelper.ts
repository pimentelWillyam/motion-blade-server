import type IDatabaseHelper from '../api/interface/IDatabaseHelper'

class DatabaseHelper implements IDatabaseHelper {
  getColumnsFromColumnListForInsertion (columnList: string[]): string {
    const numberOfColumns = columnList.length
    let columns = ''
    for (let i = 0; i < numberOfColumns; i++) {
    // await this.connection?.query('INSERT INTO ' + tableName + '(' + columnList[0] + ')') VALUES (' + data + ');')
      if (i === numberOfColumns - 1) {
        columns = columns + columnList[i]
      } else {
        columns = columns + columnList[i] + ', '
      }
    }
    return columns
  }

  getPropertiesFromPropertyListForInsertion (propertyList: string[]): string {
    const numberOfProperties = propertyList.length
    let properties = ''
    for (let i = 0; i < numberOfProperties; i++) {
      if (i === numberOfProperties - 1) {
        properties = properties + "'" + propertyList[i] + "'"
      } else {
        properties = properties + "'" + propertyList[i] + "', "
      }
    }
    return properties
  }

  getColumnsAndRegistriesToUpdate (columnList: string[], propertyList: string[]): string {
    let columnsAndRegistriesToUpdate = ''
    for (let i = 0; i < columnList.length; i++) {
      if (i === columnList.length - 1) {
        columnsAndRegistriesToUpdate = columnsAndRegistriesToUpdate + columnList[i] + " = '" + propertyList[i] + "'"
      } else {
        columnsAndRegistriesToUpdate = columnsAndRegistriesToUpdate + columnList[i] + " = '" + propertyList[i] + "', "
      }
    }
    return columnsAndRegistriesToUpdate
  }
}

export default DatabaseHelper
