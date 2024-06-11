## Which Unit Testing Solution to use on the Front-end ?

- **Impact**: 🟠 High
- **Status**: 🔓 Awaiting decision...
- **Deciders & Confidence**:

  - @purple-void (? / 5️)
  - @seporterfield (? / 5️)
  - @Monstarrrr (? / 5️)

- **Technical Story**: <!-- optional related URLs -->

  - [Write tests. Not too many. Mostly integration. - (kentcdodds.com)](https://kentcdodds.com/blog/write-tests)
  - [Comparing Next.js Testing Tools and Strategies - (logrocket.com)](https://blog.logrocket.com/comparing-next-js-testing-tools-strategies/)

- **Last updated**: 09-06-2024

## Context

Important decision because once chosen we won't be able to switch unless we rewrite a lot of code, presumably.

## Decision Drivers <!-- optional -->

- Scalability
- Ease of use
- Speed

## Considered Options <!-- optional -->

### Jest

[description | example | … ] <!-- optional -->

- Good, because

### Vitest

- Good, because faster than Jest

### No unit tests

- Good, because unit tests in React [aren't good ROI](https://www.reddit.com/r/reactjs/comments/10panfs/comment/j6jr2n4/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)
- Good, because if we need unit testing we would wait to have specific complex functions to test before we start even thinking about implementing unit tests, which we don't have (yet).
- Bad, because unit tests facilitate refactoring and maintainability. In a team with multiple developers tests are very important to ensure people don't accidentally break functionality.

## Decision Outcome

**Chosen option**: "[option 1]"  
**Reason(s)**: [e.g., only option which meets criterion | comes out best (see below)].

### Positive Consequences <!-- optional -->

-
- …

### Negative Consequences <!-- optional -->

-
- …
