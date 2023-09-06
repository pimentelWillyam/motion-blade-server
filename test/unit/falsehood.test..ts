describe('Falsehood test', () => {
  beforeEach(async () => {
    console.log('Does something before each test')
  })

  afterEach(async () => {
    console.log('After each test does something')
  })

  test('Should say if false is false', async () => {
    expect(false).toEqual(false)
  })
})
