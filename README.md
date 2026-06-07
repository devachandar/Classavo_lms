## Note on Architecture

The LMS application submitted for evaluation was implemented as a monolithic architecture using Django and React.

For the scope and requirements of the assignment, a monolithic architecture was the most practical choice because it allowed faster development, simpler deployment, and reduced operational complexity while still meeting all functional requirements.

After submission, I continued working on the project to explore how the same system could be designed using a microservices architecture. The goal was to demonstrate additional backend engineering concepts beyond the assignment requirements, including:

* API Gateway pattern
* OAuth 2.0 and OpenID Connect (OIDC)
* Keycloak as an Identity Provider
* JWT-based authentication and authorization
* Service-to-service communication
* Client Credentials Flow
* Independent service boundaries and databases

### Microservices Version

A separate repository containing the microservices implementation is available here:

**[https://github.com/devachandar/Classavo_lms_microservices]**

### High-Level Architecture

```text
Frontend
   |
   v
API Gateway
   |
   +---- Course Service
   |
   +---- Assessment Service

Assessment Service
      |
      | OAuth2 Client Credentials
      v
Course Service

Keycloak
(Authentication & Authorization)
```

The microservices version is an ongoing engineering exercise intended to showcase architectural design, distributed systems concepts, and OAuth2-based security patterns.
