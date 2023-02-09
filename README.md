[![CircleCi](https://circleci.com/gh/vschoener/vincelivemix/tree/master.svg?style=svg)](https://circleci.com/gh/vschoener/vincelivemix)  [![codecov](https://codecov.io/gh/vschoener/vincelivemix/branch/master/graph/badge.svg)](https://codecov.io/gh/vschoener/vincelivemix)

[![ValidateRSs](https://validator.w3.org/feed/images/valid-rss-rogers.png)](https://validator.w3.org/feed/check.cgi?url=http%3A//www.vincelivemix.fr/api/rss)

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

### Architecture

At beginning everything was managed inside a personal VPS but it was expensive.
I decided to move to fly.io for the backend part and vercel for the front but it creates latencies... Will think about a new approach with 0 cost :)
