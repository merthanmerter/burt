# bun-react-trpc-template

This template is designed to help you build fullstack apps powered by **Bun**,
**React**, and **tRPC**, with a unique twist: you can **compile the entire app
into a single binary**, making it ideal for self-contained deployments.

### Ideal for:

- Internal tools and dashboards
- Intranet or local network services
- Client-side deployments without external dependencies
- Kiosk apps, embedded systems, or air-gapped environments

No need for Node.js, complex runtime environments, or even internet access —
just run the binary.

Check out a real-world usage: [Burt Stack](https://burt2.verkron.com)

### Features

- **Bun** - The fastest JavaScript runtime
- **React** - The most popular frontend library
- **tRPC** - The most popular backend framework
- **Tanstack Router** - The most popular router library
- **Tanstack Query** - The most popular data fetching library
- **Tanstack Form** - The most popular form library
- **Shadcn** - The most popular UI library
- **Tailwind** - The most popular CSS framework
- **Zod** - The most popular validation library

### Usage

To install dependencies:

```bash
make install
```

To start a development server:

```bash
make dev
```

To build for production:

```bash
make build
```

To start the production server:

```bash
make start
```

To compile to a standalone binary:

```bash
make compile
make run
```
