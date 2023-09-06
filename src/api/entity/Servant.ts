import type IServant from "../interface/IServant";

// força, técnica, agilidade e fortitude

class Servant implements IServant {
  seniority: number
  atributes: Atributes;
  isInBattle: boolean
  battlePosition: [number, number]

  constructor(readonly id: string, readonly masterId: string, readonly name: string, readonly profession: Profession, readonly type: string, agility: number, technique: number, strength: number, fortitude: number) {
    this.profession = profession
    this.seniority = 0
    this.atributes = {agility: agility, strength: strength, technique: technique, fortitude: fortitude}
    this.isInBattle = false
    this.battlePosition = [-1, -1]
  }
}

export default Servant