# YAUIT

An exploration of a small library or framework for making web front-end development easier.

## Project memory

Before contributing, read:

1. [Vision](docs/vision.md)
2. [Principles](docs/principles.md)
3. [Glossary](docs/glossary.md)
4. [Roadmap](docs/roadmap.md)
5. Relevant records in [decisions](docs/decisions/README.md), [research](docs/research/README.md), and [sessions](docs/sessions/README.md)

The project is currently in its exploration phase. Accepted decisions are recorded in `docs/decisions/`; implementation remains experimental and the documentation is authoritative.

## Initial prototype

The first prototype implements only the accepted `data-emit` contract. It uses browser-native ES modules and requires no consumer build step.

Run a local static server from the repository root:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/examples/todo-step-2/>.

Run the dependency-free unit tests with:

```sh
npm test
```

The prototype intentionally excludes `data-on`, application state, persistence, rendering abstractions, runtime scopes, hub bridges, middleware, and dynamic-DOM lifecycle behavior until those contracts are discussed.

## Branching

`dev` is the active development branch. `releases` is used when preparing and publishing a release. `main` is updated only as a backup of a version that is known to be stable. See [ADR-001](docs/decisions/ADR-001-branching-strategy.md).
