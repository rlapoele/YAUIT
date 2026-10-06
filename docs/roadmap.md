# Roadmap

The roadmap records the order of exploration, not an implementation commitment.

1. **Presentation units:** define what qualifies as a component, template-backed unit, existing DOM unit, and composed unit.
2. **Composition:** refine the accepted repetition model and explore conditional presentation separately.
3. **Contracts:** determine the minimum explicit boundary between HTML presentation and JavaScript capabilities.
4. **Behaviors and lifecycle:** define registration, attachment, activation, cleanup, and dynamic-DOM semantics.
5. **Application interaction:** distinguish local behaviors, commands, outcomes or events, and application processes.
6. **Rendering compatibility:** validate the model against static HTML, SSR/SSG output, client-created HTML, and hybrid pages.
7. **Minimum experiment:** implement only after the preceding concepts are specified sufficiently to test the riskiest assumptions.

Routing, persistence, remote-fragment loading, and broader framework capabilities are deferred unless later evidence shows they belong in YAUIT.
