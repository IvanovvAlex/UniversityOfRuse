```mermaid
erDiagram
  CLIENT {
    int Id PK
    string FirstName
    string LastName
    string Email
    string Phone
    datetime CreatedAt
    bool IsActive
  }

  ACCOUNT {
    int Id PK
    int ClientId FK
    string AccountNumber
    string Currency
    decimal Balance
    datetime CreatedAt
  }

  TRANSACTION {
    int Id PK
    int AccountId FK
    string TransactionType
    decimal Amount
    string Description
    datetime CreatedAt
    int RelatedAccountId
    int RelatedClientId
  }

  CLIENT ||--o{ ACCOUNT : "owns"
  ACCOUNT ||--o{ TRANSACTION : "has"
```


