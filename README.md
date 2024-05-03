This is an http proxy that terminates a request to a URL matching a certain pattern after 3 seconds.

I wrote this to test SSE connections getting interrupted.

Run with `npx ts-node index.ts`

In the future it would be good to be able to specify the URL pattern and timeout from the commandline.
