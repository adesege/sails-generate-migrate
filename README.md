# Sails Generate Migrate

A `migrate` generator for use with the Sails command-line interface.

Create new migrations for db-migrate to run when lifting sails. This package is mean for use with `sails-hook-migrate`.

## Dependencies (optional)

You may use with `sails-hook-migrate` to automatically run migrations when running `sails lift`

```sh
npm i -S sails-hook-migrate`
```

## Installation

```sh
npm i -S sails-generate-migrate
```

### Usage

##### Create a new migration script

Generates a new migration for the specified {model} in a newly created `migrations` folder at the base of your project.

Edit the generated file(s) to add your migration steps in accordance
with [db-migrate usage](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/usage/).

```sh
$ sails generate migrate create {model}
```

**options**

 - --coffee-file
   - Outputs the migration as coffee script
 - --sql-file
   - Outputs the migration as sql

##### Run a migration up

Runs your migrations scripts against the default environment for your project.

```sh
$ sails generate migrate up
```

**options**

 - -c {n}
   - run the next n migrations up

##### Run a migration down

Runs the down migration from the last migration script available.

```sh
$ sails generate migrate down
```

**options**

 - -c {n}
   - reverse the last n migrations
