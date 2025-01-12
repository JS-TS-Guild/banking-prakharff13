import { BankAccountId } from "@/types/Common";
import BankAccount from "./bank-account";

interface BankCreateProps {
  isNegativeAllowed?: boolean;
}

export default class Bank {
  private id: number
  private allowNegativeBalance: boolean;
  protected accountsMap: {
    [key: BankAccountId]: BankAccount
  }

  private static BankFactory = class {
    private static id: number = 0;
    private constructor() { }
    public static create(isNegativeAllowed: boolean) {
      Bank.BankFactory.id += 1;
      return new Bank(Bank.BankFactory.id, isNegativeAllowed);
    }
  }

  private constructor(id: BankAccountId, allowNegativeBalance: boolean) {
    this.id = id;
    this.allowNegativeBalance = allowNegativeBalance;
    this.accountsMap = {}
  }


  static create(props: BankCreateProps = {}) {
    return Bank.BankFactory.create(props?.isNegativeAllowed ? true : false);
  }

  public getId() {
    return this.id;
  }

  public createAccount(amount: number) {
    if (amount < 0 && !this.allowNegativeBalance) {
      throw new Error("this bank does not allow negative balance accounts")
    }

    const bankAccount = BankAccount.create(amount);
    this.accountsMap[bankAccount.getId()] = bankAccount;
    return bankAccount
  }
}