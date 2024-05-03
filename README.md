This is an http proxy that terminates a request to a URL matching a certain pattern after 3 seconds.

I wrote this to test SSE connections getting interrupted.

# Instructions
* Run with `npx ts-node index.ts`
* Set your browser to use http://localhost:8080 as a proxy.
* I use [Firefox Multi-Account Containers](https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/) and set up a container to use this proxy like so:

<img width="358" alt="image" src="https://github.com/dwilsonactual/impatient-proxy/assets/15931013/aea0d473-9cd3-46eb-a781-2c3974fd5945">



In the future it would be good to be able to specify the URL pattern and timeout from the commandline.
