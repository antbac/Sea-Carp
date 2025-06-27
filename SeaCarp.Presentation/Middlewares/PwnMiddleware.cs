namespace SeaCarp.Presentation.Middlewares;

public static class PwnMiddleware
{
    private static string _pwnMessage;

    public static IApplicationBuilder UsePwnMiddleware(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            if (!string.IsNullOrWhiteSpace(Program.SitePwnedBy))
            {
                if (string.IsNullOrWhiteSpace(_pwnMessage))
                {
                    var content = @"<!doctypehtml><title>SYSTEM COMPROMISED</title><style>body{background-color:#000;color:#0f0;font-family:'Courier New',monospace;text-align:center;margin:0;padding:0;overflow:hidden}.container{display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;position:relative}h1{font-size:4em;text-shadow:0 0 10px #0f0,0 0 20px #0f0;animation:glitch 1s infinite,flicker .3s infinite;margin:0}.message{font-size:2em;margin:20px;animation:typewriter 2s steps(50) 1s 1 normal both;overflow:hidden;white-space:nowrap;border-right:3px solid #0f0;width:fit-content;margin:20px auto}.username{color:red;font-weight:700;text-shadow:0 0 10px red;animation:pulse 1.5s infinite}.binary-rain{position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1}.hack-stats{position:absolute;bottom:20px;left:20px;text-align:left;font-size:.8em;opacity:.8}.warning{color:red;font-size:1.5em;margin-top:30px;animation:blink 1s infinite}@keyframes glitch{0%{transform:translate(0)}20%{transform:translate(-2px,2px)}40%{transform:translate(-2px,-2px)}60%{transform:translate(2px,2px)}80%{transform:translate(2px,-2px)}100%{transform:translate(0)}}@keyframes flicker{0%{opacity:1}50%{opacity:.9}100%{opacity:1}}@keyframes typewriter{from{width:0}to{width:100%}}@keyframes pulse{0%{text-shadow:0 0 10px red}50%{text-shadow:0 0 20px red,0 0 30px red}100%{text-shadow:0 0 10px red}}@keyframes blink{0%{opacity:1}50%{opacity:0}100%{opacity:1}}</style><div class=container><h1>SYSTEM COMPROMISED</h1><div class=message>Site was PWNed by <span class=username id=hackerName>[HACKER_USERNAME]</span></div><div class=warning>All your data are belong to us!</div></div><canvas class=binary-rain id=binaryRain></canvas><script>const canvas=document.getElementById(""binaryRain""),ctx=canvas.getContext(""2d"");canvas.width=window.innerWidth,canvas.height=window.innerHeight;const binary=""01"",fontSize=14,columns=canvas.width/14,drops=[];for(let i=0;i<columns;i++)drops[i]=1;function draw(){ctx.fillStyle=""rgba(0, 0, 0, 0.05)"",ctx.fillRect(0,0,canvas.width,canvas.height),ctx.fillStyle=""#0f0"",ctx.font=""14px monospace"";for(let t=0;t<drops.length;t++){let n=""01"".charAt(Math.floor(2*Math.random()));ctx.fillText(n,14*t,14*drops[t]),14*drops[t]>canvas.height&&Math.random()>.975&&(drops[t]=0),drops[t]++}}setInterval(draw,33),window.addEventListener(""resize"",()=>{canvas.width=window.innerWidth,canvas.height=window.innerHeight});</script>";
                    _pwnMessage = content.Replace("[HACKER_USERNAME]", Program.SitePwnedBy);
                }

                context.Response.ContentType = "text/html; charset=utf-8";
                context.Response.StatusCode = 200;
                context.Response.Headers.Append("Cache-Control", "max-age=0, no-store");

                await context.Response.WriteAsync(_pwnMessage);
                return;
            }

            await next(context);
        });
    }
}