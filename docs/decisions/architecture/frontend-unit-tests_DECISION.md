## Which Unit Testing Solution to use on the Front-end ?

- **Impact**: 🟡 Medium
- **Status**: 🔒 Decided
- **Deciders & Confidence**:

  - @purple-void (? / 5️)
  - @seporterfield (? / 5️)
  - @Monstarrrr (4 / 5️)

- **Technical Story**: <!-- optional related URLs -->

  - [Write tests. Not too many. Mostly integration. - (kentcdodds.com)](https://kentcdodds.com/blog/write-tests)
  - [Comparing Next.js Testing Tools and Strategies - (logrocket.com)](https://blog.logrocket.com/comparing-next-js-testing-tools-strategies/)

- **Last updated**: 09-06-2024

## Context

Important decision because once chosen we won't be able to switch unless we rewrite a lot of code, presumably.

## Decision Drivers <!-- optional -->

- Ease of use
- Scalability
- Performance

## Considered Options

<!-- Add reasons why to pick or not to pick each of them based on decision drivers -->

### Jest

---

_Jest is the default testing framework for NextJS_

**Ease of use:**

- :green_circle: Easy to setup

### Vitest

---

_Vitest is a newer testing framework using vite_

**Ease of use:**

- :orange_circle: Requires more setup than Jest & than no unit tests

**Performance**

- :green_circle: Faster than Jest

### None

---

_No unit tests_

**Ease of use:**

- :green_circle: No use needed

**Scalability:**

- :green_circle: [Unit tests in React aren't good ROI.](https://www.reddit.com/r/reactjs/comments/10panfs/comment/j6jr2n4/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)

- :green_circle: Won't use unit tests unless we have specific complex functions to test, which we don't have (yet).
- :orange_circle: Unit tests could facilitate refactoring and maintainability in the long run

## Decision Outcome

**Chosen option**: "None (until a complex pure function is added)"  
**Reason**: It may be too time consuming to setup unit tests for the MVP if we don't have complex pure functions we need to test.

### Positive Consequences <!-- optional -->

- Faster MVP release

### Negative Consequences <!-- optional -->
