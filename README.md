# Sails Generate Migrate

A `migrate` generator for use with the Sails command-line interface.

Create new migrations for db-migrate to run when lifting sails. This package is mean for use with `sails-hook-migrate`.

## Dependencies (optional)

**Highly recommended** to use with `sails-hook-migrate` to create migration scripts from the command line.

```sh
npm i -S sails-hook-migrate`
```

## Installation

```sh
npm i -S sails-generate-migrate sails-hook-migrate
```

Create a new `migrations` folder in the root of your project.

### Usage

##### On the command line

```sh
$ sails generate migrate {model}
```

Generates a new migration for the specified {model} in `migrations`.

Edit the generated file to add your migration steps in accordance
with [db-migrate usage](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/usage/)
