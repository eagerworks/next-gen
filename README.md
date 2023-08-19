# Next-Gen Boilerplate Generator

This utility facilitates the setup process for a NextJS application incorporating the [T3 stack](https://create.t3.gg/) (trpc, nextjs, tailwind, prisma) by generating boilerplate code on-the-fly.

## Features:

- Create controller files.
- Formulate schema files for Prisma.
- Craft zod validation schemas.
- Design forms with tailwind styling.
- Start with a configuration file for your application.

## Installation

Before you begin, ensure you've initiated your NextJS project. Then, bring this utility onboard:

```bash
npm install -g next-gen
```

## Usage

### Initialization

Before diving into component generation, initialize your project:

```bash
next-gen init
```

Executing this will yield a configuration file (`next-gen.json`) in your project's root.
This config file allows you to set paths to your own templates and where each resource should be generated.

### Crafting Components

To birth new components, the go-to command is `generate`:

```bash
next-gen generate <type> <name> [options]
```

#### Parameters:

- `<type>`: Denotes the kind of component you aim to produce. Valid entries include: 
  - `controller`
  - `schema`
  - `zodSchemas`
  - `form`
  - `scaffold` (Generates controller, schema, zodSchemas, and form all in one go!)

- `<name>`: The christening name for the component.

#### Options:

- `-a, --attributes <attributes>`: Specifies a list of component attributes in the name:type format. This is particularly beneficial when molding schemas. Ensure attributes are comma-separated. 

  Example: `--attributes name:string,age:number,email:string`

Currently the following types are supported:
- [x] string
- [x] number
- [x] boolean
- [x] date
- [x] json
- [x] text
- [x] float
- [x] double
- [ ] enums
- [ ] references

#### Examples:

1. For a 'User' controller generation:

```bash
next-gen generate controller User
```

2. For a 'Post' schema birth with respective attributes:

```bash
next-gen generate schema Post --attributes title:string,body:string
```

3. Generating all the fundamental components (scaffold) for a 'Product':

```bash
next-gen generate scaffold Product --attributes name:string,price:number
```

## Roadmap

- [ ] Add more types
- [x] Generate New page
- [x] Generate Edit page
- [ ] Generate Index page
- [ ] Generate Show page
- [x] Automatically add router to routes file
- [ ] Form component should be created with necessary inputs
- [ ] Allow setting custom inputs for each attribute type
- [ ] Generate controller tests
- [ ] Generate component test

## Feedback

If you stumble upon an issue or have a spark of improvement, don't be shy! Head to the [GitHub repository](#) and let us know.

Happy NextJS adventures with the T3 stack! 🚀
