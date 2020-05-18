const otionCoreUrl = 'https://unpkg.com/otion/dist-esm/bundle.min.mjs';
const otionServerUrl = 'https://unpkg.com/browse/otion@0.1.0/server/index.mjs';
const nodeEnv = 'process.env.NODE_ENV';

const download = async function(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    console.error(res.statusText)
    Deno.exit(1)
  }
  return await res.text();
}

let otion = await download(otionCoreUrl)
otion = otion.replace('window', 'document');
otion = "/*! For license information please see https://github.com/kripod/otion */\n" + otion

const otionProd = otion.replace(nodeEnv, JSON.stringify('production'))
const otionDev = otion.replace(nodeEnv, JSON.stringify('development'))

await Deno.writeTextFile('otionProd.js', otionProd)
await Deno.writeTextFile('otionDev.js', otionDev)

const otionServer = await download(otionServerUrl, )
await Deno.writeTextFile('otionServer.js', otionServer);

