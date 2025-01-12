import { BankAccountId, UserId } from "@/types/Common";

export default class User {
  private id: UserId;
  private fullName: string;
  private firstName: string;
  private lastName: string;
  private AccountIds: BankAccountId[];

  private static Factory = class {
    private static id: number = 0;
    private constructor() { }
    public static create(name: string, accounts: BankAccountId[]) {
      User.Factory.id += 1;
      return new User(User.Factory.id, name, accounts);
    }
  }

  static create(name: string, acounts: BankAccountId[]) {
    return User.Factory.create(name, acounts);
  }

  private constructor(id: UserId, name: string, accounts: BankAccountId[]) {
    this.id = id;
    this.fullName = name;
    const parts = name.split(" ");
    this.AccountIds = []
    if (parts.length > 0) {
      this.firstName = parts[0];
    }
    if (parts.length > 1) {
      this.lastName = parts[parts.length - 1];
    }

    accounts.forEach((acc) => {
      this.AccountIds.push(acc);
    })
  }

  public getId() {
    return this.id;
  }
}