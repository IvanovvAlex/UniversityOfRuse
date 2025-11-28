```mermaid
usecaseDiagram

actor "Bank Clerk" as Clerk

rectangle BankAccountManager {
  Clerk --> (Manage Clients)
  Clerk --> (Manage Accounts)
  Clerk --> (View Transactions)
  Clerk --> (Perform Deposit)
  Clerk --> (Perform Withdraw)
  Clerk --> (Perform Transfer)
  Clerk --> (Export Reports)

  (Manage Clients) --> (Create Client)
  (Manage Clients) --> (Update Client)
  (Manage Clients) --> (Delete Client)
  (Manage Clients) --> (Search Clients)

  (Manage Accounts) --> (Create Account)
  (Manage Accounts) --> (Update Account)
  (Manage Accounts) --> (Delete Account)
  (Manage Accounts) --> (Search Accounts)

  (View Transactions) --> (Search Transactions)

  (Export Reports) --> (Export Clients Excel)
  (Export Reports) --> (Export Accounts Excel)
  (Export Reports) --> (Export Transactions Excel)
}
```


