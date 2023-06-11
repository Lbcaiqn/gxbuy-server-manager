export class VarifyParamsQuery {
  static varifyPage(num: number): boolean {
    const newNum = Number(num);
    if (newNum < 1 || !Number.isInteger(newNum)) return false;
    return true;
  }
}
