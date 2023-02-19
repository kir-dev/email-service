# API endpoint and MQ sender
## Config
You just need to generate a (preferably 256 bit / 32 chars long) secret into the `.env` file.
## API key generation
Running `yarn keygen` will prompt you to type in an app name which it will generate a JWT API key for.
This token must be used for making requests to the endpoint as a Bearer token (in the Authorization header)!
The key will be stored in a generated `keys.json` file alongside the app name you typed in.
For API key revoke, carefully delete the object from the file!

## API usage
Make a `POST` request to `/send` route with an object or an array of objects defined below:

```json
{
  "to": "example@example.com",
  "from": "My App",
  "subject": "Example Email",
  "text": "Plain text if you don't need HTML",
  "html": "<h1>Syntactically correct HTML code<h2>"
}
```

You don't need to specify both HTML and Text fields, just one!

You can send multiple emails to the queue by sending an array of the objects above.
The MQ sender will put each entry into the queue.

