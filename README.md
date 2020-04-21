# Caracole

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3500](http://localhost:3500) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/zeit/next.js/) - your feedback and contributions are welcome!

## Deploy

#### 1 - Setup the deploy configuration file.

Just replace `__USER_NAME__`, `__SERVER_IP__`, `__SERVER_PATH__` in the file `deploy.sample.json` with your server information and rename this file to `deploy.json`.

#### 2 - Init the git hook

```
make deploy-init
```

_NOTE: You server need access to your github account via ssh. See [your github settings](https://github.com/settings/keys)_

#### 3 - Deploy

```
make deploy
```

You app will be accessible through `http://SERVER_IP:3500`.

#### Troubleshooting

If you still have right issue on the 2nd step, be sure that github is added as known host on your server.
