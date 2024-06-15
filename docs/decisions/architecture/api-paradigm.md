**File title**: [title]\_DECISION.md

## [short title of solved problem]

- **Impact**: 🟠 High
- **Status**: 🔒 Decided
- **Deciders & Confidence**:
  - @purple-void ? / 5️
  - @seporterfield ? / 5️
  - @Monstarrrr 5 / 5️
- **Last updated**: [12-06-2024]

## Context and Problem Statement

API Paradigms define the structure, principles, and methodologies used to create APIs, dictating how they operate and how clients can interact with them.

## Decision Drivers <!-- optional -->

- Security
- Performance
- Ease of use
- Scalability

## Considered Options <!-- optional -->

### REST

RESTful APIs are based on stateless communication and use standard HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URIs.

- **:orange_circle: Worse** performance
  - Clients may receive more data than needed (over-fetching) or require multiple requests to get all necessary data (under-fetching)
- **:green_circle: Better** ease of use
  - Its simplicity and wide adoption make it easier for external developers to integrate.
  - Fast to implement.
- **:orange_circle: Worse** scalability
  - REST handles versioning through URI changes, which leads to deprecating old endpoints.

### GraphQL

- **:red_circle: Worse** security
  - https://news.ycombinator.com/item?id=40521518
  - https://blog.logrocket.com/graphql-vs-rest-api-why-you-shouldnt-use-graphql/
- **:green_circle: Better** performance
  - GraphQL reduces over-fetching and under-fetching by allowing clients to request exactly what they need
- **:green_circle: Better** scalability
  - GraphQL schemas are strongly typed and can be extended easily without breaking existing clients
- **:orange_circle: Worse** ease of use
  - [Using graphQL is a lot less common.](https://blog.postman.com/graphql-vs-rest/)
  - [Testing is more difficult.](https://www.reddit.com/r/laravel/comments/yc4073/comment/itkea7o/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)
  - Ensuring security vulnerabilities are covered costs time

### gRPC

_gRPC is not relevant to us (yet) as it can only be used for API-to-API communication (it uses HTTP/2 which is not properly supported by client browsers)_

## Decision Outcome

**Chosen option**: REST

**Reason**: GraphQL is not secure and seem to easily turn into a nightmare; Rest is an established standard;
