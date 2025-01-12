import { BankAccountId, UserId, BankId } from "@/types/Common";
import BankAccount from "./bank-account";
import GlobalRegistry from "@/services/GlobalRegistry";
import { ac } from "vitest/dist/chunks/reporters.D7Jzd9GS";

export default class Bank {
  private id: BankId
  private allowNegativeBalance: boolean;
  protected accountsMap: {
    [key: BankAccountId]: BankAccount
  }

  private static BankFactory = class {
    private static id: BankId = 0;
    private constructor() { }
    public static create(isNegativeAllowed: boolean) {
      Bank.BankFactory.id += 1;
      return new Bank(Bank.BankFactory.id, isNegativeAllowed);
    }
  }

  private constructor(id: BankId, allowNegativeBalance: boolean) {
    this.id = id;
    this.allowNegativeBalance = allowNegativeBalance;
    this.accountsMap = {}
  }


  static create(props: { isNegativeAllowed?: boolean } = {}) {
    return Bank.BankFactory.create(!!props?.isNegativeAllowed);
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
    GlobalRegistry.addBankAccountIdToBankMap(bankAccount.getId(), this);
    return bankAccount
  }

  public getAccount(accountId: BankAccountId) {
    return this.accountsMap[accountId];
  }

  public getBalance(accountId: BankAccountId) {
    return this.accountsMap[accountId].getBalance();
  }

  public send(userIdA: UserId, userIdB: UserId, amount: number, userBbankId: BankAccountId = null) {
    const allAccountsA = GlobalRegistry.getBankAccountIdsForUserId(userIdA);
    const validAccountsA = allAccountsA.filter((acc) => (acc in this.accountsMap))

    if (validAccountsA.length == 0) {
      throw new Error("no accounts found for 1st user in the bank")
    }

    const allAccountsB = GlobalRegistry.getBankAccountIdsForUserId(userIdB);
    const validAccountsB = allAccountsB.filter((acc) => {
      if (userBbankId === null) {
        return (acc in this.accountsMap)
      } else {
        return (acc in GlobalRegistry.getBankForBankAccountId(acc).accountsMap)
      }
    })

    if (validAccountsB.length == 0) {
      throw new Error("no accounts found for 2nd user in the bank")
    }

    const BsBankAccount = GlobalRegistry.getBankForBankAccountId(validAccountsB[0]).getAccount(validAccountsB[0]);

    if (this.allowNegativeBalance) {
      const account = validAccountsA[0];
      const thisBankAccount = GlobalRegistry.getBankForBankAccountId(account).getAccount(account);

      thisBankAccount.setBalance(thisBankAccount.getBalance() - amount);
      BsBankAccount.setBalance(BsBankAccount.getBalance() + amount);

      return;
    }

    let totalAmountInAccounts = 0

    for (let i = 0; i < validAccountsA.length; i++) {
      const account = validAccountsA[i];
      const thisBankAccount = GlobalRegistry.getBankForBankAccountId(account).getAccount(account);
      totalAmountInAccounts += thisBankAccount.getBalance();
    }

    if (totalAmountInAccounts < amount) {
      throw new Error("Insufficient funds")
    }

    for (let i = 0; i < validAccountsA.length; i++) {
      const account = validAccountsA[i];
      const thisBankAccount = GlobalRegistry.getBankForBankAccountId(account).getAccount(account);

      if (amount <= thisBankAccount.getBalance()) {
        thisBankAccount.setBalance(thisBankAccount.getBalance() - amount);
        BsBankAccount.setBalance(BsBankAccount.getBalance() + amount);
        break;
      } else {
        amount -= thisBankAccount.getBalance();
        thisBankAccount.setBalance(0);
        BsBankAccount.setBalance(BsBankAccount.getBalance() + thisBankAccount.getBalance());
      }
    }
  }
}