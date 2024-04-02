class UserFactory {
  createUser (id: string, login: string, password: string, type: UserType): User {
    return new User(id, login, password, type)
  }
}

