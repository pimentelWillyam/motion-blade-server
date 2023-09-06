describe('Truthood test', () => {
  beforeEach(async () => {
    console.log('Does something before each test')
  })

  afterEach(async () => {
    console.log('After each test does something')
  })

  test('Should say if true is true', async () => {
    expect(true).toEqual(true)
  })
})
