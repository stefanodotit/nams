# NAMS (New Amazing Mock Server)

## Why
`NAMS` is born for help people to easily mock request with ZERO config. <br> 
Can be used for developing frontend graphic stuff and don't have an active backend server or used for testing like e2e, visual regression test etc etc <br>
`NAMS` is based on [`Fastify`](https://www.fastify.io/)

## Install
```
npm i --save-dev nams
```

## How it works
**The structure of `Mocks` folder need to be created for simulate url path and in the final folder need to have a json or javascript index file.** <br>
When NAMS reach the last folder start to search a `index.json` file, if not exist start to search a `index.js` and try to exec the function passing down this params `{request, reply, folderPath}` and send the output. <br>
If u want to use the fastify hook `preHandler` you need to create a file called `prehandler.js` and put it in the same folder where `index.[json/js]` is located. <br>

### Steps
1. Search `prehandler.js` and if present exec the function with this args: `(request, reply, next)`
2. Search `index.json` file and if present send it for answer 
3. Search `index.js` file and if present exec the function with this args: `{request, reply, folderPath}` and send the function result for answer

## Session
NAMS use `fastify-session` and u can use it on `prehandler.js` file. [DOC LINK](https://github.com/SerayaEryn/fastify-session)

## Proxy
By default `NAMS` give a 404 code status when it can't find a file. If u want to mock only some request you can set your custom proxy. In this case when `NAMS` can't find a file, use your proxy address for retrieve the answer.

## Import and run
### Script side
```
require('nams')(options)
```
Rember: when your node script has finished use `process.exit(1/0)`. 

## Options Object
```
{
    port: custom NAMS port (DEFAULT: 4444),
    folderPath: path of a folder where files need to be present,
    proxy: if u want to proxy all 404 request insert here URL and automatically NAMS (if cannot find file) try to retreive API on external server
}
```

## EXAMPLE
```
mocks/
|--- a/
|    |--- index.js
|--- b/
|    |--- index.json
|    |--- index.js
|--- c/
|    |--- index.json
|    |--- prehandler.js
|--- d/
     |--- e/
          |--- f/
               |--- index.json  
```
| Request | Response-Path |
| --- | ----------- |
| /a | /a/index.js |
| /b | /b/index.json |
| /c | /c/prehandler.js => /c/index.json |
| /d/e/f | /d/e/f/index.json |

### Example prehandler.js
```
module.exports = (request, reply, next) => {
    request.session.test = 'Insert here'
    next() 
}
```

### Example index.js
```
module.exports = (request, reply, next) => {
    // DO STUFF
    return {foo: "bar"}
}
```