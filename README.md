# 👷 Yesh Chandiramani Cloudflare 2020 General Engineering Assignment

## Description
My submission for the Cloudflare 2021 Summer internship. 

I was tasked to build a link-tree style static HTML page and JSON API using Cloudflare workers.

## [Demo](https://cf-gea.yesh.workers.dev/)

## Files
index.js - main logic for the app

router.js - router module taken from [Cloudflare Routing Template](https://github.com/cloudflare/worker-template-router)

wranger.toml - wrangler configuration for worker project (using webpack as type)

package.json - project configuration for any node related matters

## Getting started

1. Install wrangler using either NPM or Cargo
2. ```wrangler dev``` to test locally
3. go to ```127.0.0.1:8787``` in your browser