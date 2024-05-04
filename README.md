# Code for food

- This repository is using pnpm [Workspace](https://pnpm.io/workspaces) & [TurboRepo](https://turbo.build/).
- Plasmo, tailwind, redux.

## Structuring:

- **apps/\***: storing our application
- **packages/\***: holding packages that use in project

## Convention

- **Limit** to use library
- Naming wallet packages with: @wallet/ prefix (E.g: @wallet/aptos)
- Eslint [standard](https://www.npmjs.com/package/eslint-config-standard)

## Command

Add new packages

```bash
pnpm add <package> <package> --filter <Project Name>
```

Run Project inside workspace.

```bash
pnpm run <Command> --filter <Project Name>
```

For example:

```bash
pnpm run dev --filter @wallet/aptos
```

For parallel: this command will run all the project that have `dev` script in `package.json`

```bash
pnpm run dev
```
