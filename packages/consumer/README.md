# MQ consumer and e-mail sender
## Config
Fill in a `.env` file based on the `.env.example`.
```.dotenv
OAUTH_CLIENT_ID=<GCP Project Client ID>
OAUTH_CLIENT_SECRET=<GCP Project Client Secret>
REDIRECT_URI=<OAuth redirect url (root path)>
FROM_EMAIL=<Email of the Google Account used in the OAuth process>
```
## Authentication
This service needs an access and refresh token in order to use Google Services.
The refresh token is stored in a `token.json` file.
If this file is not available, you will get prompted (logged an authorization url) to log in via Google.
The code is exchanged and the refresh token is stored.

## Consuming the MQ
During startup the service connects to the Message Queue.
If there are messages not acked in the queue, they will be sent after connecting.
In a normal workflow, messages are sent immediately after the queue receives it.
