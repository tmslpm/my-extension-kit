
export class FibonacciService {

  public static readonly PHI: number = (1 + Math.sqrt(5)) / 2;

  public static isNumFibo(number: number): boolean {
    if (number >= 0 && number < 4) {
      return true;
    }

    const n = Math.round(Math.log(number * Math.sqrt(5)) / Math.log(this.PHI));
    const r = (Math.pow(this.PHI, n) - Math.pow(-1, n) / Math.pow(this.PHI, n)) / Math.sqrt(5);
    return number === Math.round(r);
  }

  public static getFiboNumberFromPos(positionInSequence: number) {
    return Math.round(Math.pow(this.PHI, positionInSequence) / Math.sqrt(5));
  }

  public static getPosInFiboSequence(number: number) {
    if (number < 4) { return number; }
    return Math.floor(Math.log(number * Math.sqrt(5) + 0.5) / Math.log(this.PHI));
  }

}
