interface ISleeper {
  sleep: (miliseconds: number) => Promise<void>
}

export default ISleeper
