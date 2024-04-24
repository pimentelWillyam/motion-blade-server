import { type UserType } from '../../bot/type/UserType'

interface DatabaseMaster {
  id: string
  login: string
  password: string
  type: UserType
  servants_name_list: string[]
}

export default DatabaseMaster
