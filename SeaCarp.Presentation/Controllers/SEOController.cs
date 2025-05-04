using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using System.Globalization;
using System.Xml;

namespace SeaCarp.Presentation.Controllers
{
    public class SEOController(
        IActionDescriptorCollectionProvider provider,
        IJwtService jwtService) : BaseController(jwtService)
    {
        private readonly IActionDescriptorCollectionProvider _provider = provider;

        [HttpGet]
        [Route("robots.txt")]
        [ResponseCache(Duration = 600, Location = ResponseCacheLocation.Any)]
        public IActionResult RobotsTxt()
        {
            return Uri.TryCreate(Url.ActionLink(nameof(AdminController.Index), nameof(AdminController).RemoveControllerSuffix()), UriKind.Absolute, out var hiddenUrl)
                ? Content($"User-agent: *\r\nDisallow: {hiddenUrl.AbsolutePath}\r\nDisallow: /files", "text/plain")
                : Content($"User-agent: *", "text/plain");
        }

        [HttpGet]
        [Route("sitemap.xml")]
        [ResponseCache(Duration = 600, Location = ResponseCacheLocation.Any)]
        public IActionResult SitemapXml()
        {
            var sitemapNodes = new List<SitemapNode>();
            var actionDescriptors = _provider.ActionDescriptors.Items;

            foreach (var descriptor in actionDescriptors)
            {
                if (descriptor is ControllerActionDescriptor cad)
                {
                    bool hasHttpGet = cad.MethodInfo
                        .GetCustomAttributes(typeof(HttpGetAttribute), inherit: true)
                        .Any();

                    if (!hasHttpGet || cad.ControllerName == nameof(SuperAdminController))
                    {
                        continue;
                    }

                    var routeValues = new Dictionary<string, object>();

                    foreach (var param in cad.Parameters)
                    {
                        routeValues[param.Name] = "<identifier>";
                    }

                    string url;
                    if (cad.AttributeRouteInfo != null && !string.IsNullOrEmpty(cad.AttributeRouteInfo.Name))
                    {
                        url = Url.RouteUrl(cad.AttributeRouteInfo.Name, routeValues.Count > 0 ? routeValues : null, Request.Scheme);
                    }
                    else
                    {
                        url = Url.Action(cad.ActionName, cad.ControllerName, routeValues.Count > 0 ? routeValues : null, Request.Scheme);
                    }

                    if (!string.IsNullOrEmpty(url) && Uri.TryCreate(url, UriKind.Absolute, out var uri))
                    {
                        sitemapNodes.Add(new SitemapNode
                        {
                            Url = Uri.UnescapeDataString(uri.GetLeftPart(UriPartial.Path)),
                            LastModified = DateTime.UtcNow,
                            ChangeFrequency = "weekly",
                            Priority = 0.5M
                        });
                    }
                }
            }

            var xml = GenerateSitemapXml(sitemapNodes);
            return Content(xml, "application/xml");
        }

        private static string GenerateSitemapXml(List<SitemapNode> sitemapNodes)
        {
            using var sw = new StringWriter();
            var settings = new XmlWriterSettings { Indent = true };
            using (var xw = XmlWriter.Create(sw, settings))
            {
                xw.WriteStartDocument();
                xw.WriteStartElement("urlset", "http://www.sitemaps.org/schemas/sitemap/0.9");

                foreach (var node in sitemapNodes)
                {
                    xw.WriteStartElement("url");
                    xw.WriteElementString("loc", node.Url);
                    xw.WriteElementString("lastmod", node.LastModified.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
                    xw.WriteElementString("changefreq", node.ChangeFrequency);
                    xw.WriteElementString("priority", node.Priority.ToString("F1", CultureInfo.InvariantCulture));
                    xw.WriteEndElement();
                }

                xw.WriteEndElement();
                xw.WriteEndDocument();
            }

            return sw.ToString();
        }
    }

    public class SitemapNode
    {
        public string Url { get; set; }
        public DateTime LastModified { get; set; }
        public string ChangeFrequency { get; set; }
        public decimal Priority { get; set; }
    }
}