export default class BankAccount {
  private id: number
  private amount: number;

  private static BankAccountFactory = class {
    private static id: number = 0;
    private constructor() { }
    public static create(amount: number) {
      BankAccount.BankAccountFactory.id += 1;
      return new BankAccount(BankAccount.BankAccountFactory.id, amount);
    }
  }

  static create(amount: number) {
    return BankAccount.BankAccountFactory.create(amount);
  }

  private constructor(id: number, amount: number) {
    this.id = id;
    this.amount = amount;
  }

  public getId() {
    return this.id;
  }

  public getBalance() {
    return this.amount;
  }

  public setBalance(amount: number) {
    this.amount = amount;
  }
}