import { BankAccountId, BankId, UserId } from "@/types/Common";
import Bank from "@/models/bank";

class GlobalRegistry {
  public static clear() {
    this.BankAccountIdToBankIdMap = {}
    this.UserIdToBankAccountIdMap = {}
  }

  private static BankAccountIdToBankIdMap: {
    [key: BankAccountId]: Bank
  } = {}

  public static addBankAccountIdToBankMap(accountId: BankAccountId, bank: Bank) {
    this.BankAccountIdToBankIdMap[accountId] = bank;
  }

  public static getBankForBankAccountId(bankAccountId: BankAccountId) {
    return this.BankAccountIdToBankIdMap[bankAccountId];
  }

  private static UserIdToBankAccountIdMap: {
    [key: UserId]: BankAccountId[]
  } = {}

  public static addUserIdToBankAccountIdMap(userId: UserId, bankIds: BankAccountId[]) {
    this.UserIdToBankAccountIdMap[userId] = bankIds;
  }

  public static getBankAccountIdsForUserId(userId: UserId) {
    return this.UserIdToBankAccountIdMap[userId];
  }
}

export default GlobalRegistry;