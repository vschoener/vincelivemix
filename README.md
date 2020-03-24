[![CircleCi](https://circleci.com/gh/vschoener/vincelivemix/tree/master.svg?style=svg)](https://circleci.com/gh/vschoener/vincelivemix)

# Vince live mix website

## Migration

During development, it requires to have the postgres container running but normally
the make command will to it for you

### Generate modification

Use the following command to generate the modification, it will run the command inside th container with the right TYPEORM credentials.

Name the change using the `MIGRATION_NAME` arg
```bash
make migrate-generate MIGRATION_NAME=NAME_IT
```
