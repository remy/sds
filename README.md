# Simple Data Service

This was built out of a need to have something very simple that I could make POST and GET requests to and _importantly_ for my own needs it needed to run over a non TLS request. So I run my own instance at http://data.remysharp.com - you're welcome to request an account to use it for your own needs.

## Running your own version

You will need a few tools and to be able to run commands from the terminal. If you're not familiar with the terminal, I have an [online course](https://terminal.training/) with an 80% discount using "subscriber" (yes, I'm allowed to promote my own stuff!).

To run this locally you will need to [install Node](https://nodejs.org/en/download/).

Once installed, [download this source code](https://github.com/remy/sds/archive/main.zip), unzip and inside that directory, run the following commands:

```
npm ci
npm run dev
```

Yes, that's it. A local server will be running on http://localhost:8000

However, you will need access. For that, open and edit the file in `bin/new-user.js` - set your own credentials and then from the terminal, in the root of the project directory, run:

```
node bin/new-user.js
```

Now the account will be made, you can sign in and you're good to start creating your own applications.
