import { IContext, Proxy } from "http-mitm-proxy";
const proxy = new Proxy();

function isErrnoException(err: any): err is NodeJS.ErrnoException {
    return err.errno !== undefined;
}

interface IExtendedContext extends IContext {
    startTime: number;
}

proxy.onError(function (ctx, err) {
    if (isErrnoException(err) && err.errno === -3008 && err.code === "ENOTFOUND" && err.syscall === "getaddrinfo") {
        return;
    }
    console.error('proxy error:', err);
});

// http://localhost:2206/github/chat/threads/5351c71d-b168-4e80-bf1e-aac83e17839f/messages
proxy.onRequest(function (ctx, callback) {
    console.log('proxy.onRequest', ctx.clientToProxyRequest.url);
    if (ctx.clientToProxyRequest.headers.host === 'localhost:2206'
        && ctx.clientToProxyRequest.method === 'POST'
        && ctx.clientToProxyRequest.url?.match(/\/github\/chat\/threads\/[a-f0-9-]+\/messages/)) {
        ctx.use(Proxy.gunzip);
        (ctx as IExtendedContext).startTime = Date.now();

        console.log('message intercepted!')
        ctx.onResponseData(function (ctx, chunk, callback) {
            const extendedContext = ctx as IExtendedContext;
            const age = Date.now() - extendedContext.startTime;
            console.log('response data: age: ', age);
            if (age > 3000) {
                console.log('this has gone on long enough');
                ctx.clientToProxyRequest.destroy();
                ctx.proxyToClientResponse.destroy();
                ctx.proxyToServerRequest?.destroy();
                ctx.serverToProxyResponse?.destroy();
            }
            return callback(null, chunk);
        });
    }
    return callback();
});

const port = 8080;
console.log(`begin listening on ${port}`)
proxy.listen({ port });
