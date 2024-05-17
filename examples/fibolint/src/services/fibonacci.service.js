"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FibonacciService = void 0;
class FibonacciService {
    static PHI = (1 + Math.sqrt(5)) / 2;
    static isNumFibo(number) {
        if (number >= 0 && number < 4) {
            return true;
        }
        const n = Math.round(Math.log(number * Math.sqrt(5)) / Math.log(this.PHI));
        const r = (Math.pow(this.PHI, n) - Math.pow(-1, n) / Math.pow(this.PHI, n)) / Math.sqrt(5);
        return number === Math.round(r);
    }
    static getFiboNumberFromPos(positionInSequence) {
        return Math.round(Math.pow(this.PHI, positionInSequence) / Math.sqrt(5));
    }
    static getPosInFiboSequence(number) {
        if (number < 4) {
            return number;
        }
        return Math.floor(Math.log(number * Math.sqrt(5) + 0.5) / Math.log(this.PHI));
    }
}
exports.FibonacciService = FibonacciService;
//# sourceMappingURL=fibonacci.service.js.map