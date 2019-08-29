export default class Wrapper {
    setAppId = (appId) => {
        const head = document.getElementsByTagName("head")[0];
        const heapScript = document.createElement("script");
        heapScript.appendChild(document.createTextNode(`
        window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=(r?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(a,n);for(var o=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=o(p[c])};
        heap.load("${appId}");
        `));
        head.appendChild(heapScript);
    };
    track = (event, payload) => window.heap.track(event, payload);
    identify = (identity) => window.heap.identify(identity);
    resetIdentity = () => window.heap.resetIdentity();
    addUserProperties = (payload) => window.heap.addUserProperties(payload);
    addEventProperties = (payload) => window.heap.addEventProperties(payload);
    removeEventProperty = (property) => window.heap.removeEventProperty(property);
    clearEventProperties = () => window.heap.clearEventProperties();
}