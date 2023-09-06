interface IDatabaseHelper {
  getColumnsFromColumnListForInsertion: (columnList: string[]) => string
  getPropertiesFromPropertyListForInsertion: (propertyList: string[]) => string
  getColumnsAndRegistriesToUpdate: (columnList: string[], propertyList: string[]) => string
}

export default IDatabaseHelper
