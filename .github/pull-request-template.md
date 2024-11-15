# Pull Request

## Summary

> Short summary of what is being done.
> Complete sentence, written as though it was an order.

## Description

> It should fill in the details and include any supplemental information
> a reader needs to understand the pull request holistically.
> If there is no testing procedure in the JIRA ticket, it should be explained in here.

## PR type

- [ ] New Feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Dependency update
- [ ] Configuration
- [ ] Unit test
- [ ] E2E test

## Does this PR introduce a breaking change?

- [ ] Yes
- [ ] No

## JIRA link

> KMT-xxxxxx

## Checklist

- [ ] Manually tested behavior (API endpoints, database queries)
- [ ] Test code added for these changes
- [ ] Ran Jest unit tests and they all passed
- [ ] Ran Jest E2E tests and they all passed
- [ ] Verified Swagger documentation
- [ ] Checked API output format
- [ ] Swagger documentation is easy to understand for API users
- [ ] Reviewed DTOs, controllers, services, and repositories for naming and responsibility
- [ ] Database transactions are short and atomic
- [ ] Added appropriate amount of comments and required TODOs

## Points to Review

> List what specifically you would like the reviewers to focus on. Any questions or concerns you have.

## Test Code to Validate

> Indicate the test files or specific test cases reviewers should focus on to validate the PR changes.
