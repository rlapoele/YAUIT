# Glossary

| Term | Working definition |
| --- | --- |
| Library | A reusable set of capabilities that an application calls directly. |
| Framework | A system that provides application structure and calls user-defined code at designated points. |
| DOM activation | Attaching behavior and event relationships to existing DOM without requiring the library to have produced or to reconcile that DOM. |
| Domain event | An immutable semantic record of something that has occurred and matters in the application's domain, named in domain language rather than after the native gesture or technical layer that observed it. An event such as `colour-theme.preference.requested` records the fact that a request was made; it does not assert that the requested outcome occurred. |
| Event hub | The publish-subscribe facility owned by one YAUIT runtime through which its domain events are delivered without using DOM propagation as the routing mechanism. |
| Payload builder | JavaScript associated with a domain event contract that translates a source element and native event into a validated domain payload. |
| Presentation action | A registered JavaScript function that reflects a domain event in relation to a DOM element. |

Add or refine terms as the exploration develops.
