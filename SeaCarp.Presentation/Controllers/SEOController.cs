using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using System.Globalization;
using System.Xml;

namespace SeaCarp.Presentation.Controllers;

public class SEOController(
    IActionDescriptorCollectionProvider provider,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IActionDescriptorCollectionProvider _provider = provider;

    #region RobotsTxt

    [HttpGet]
    [Route("/robots.txt", Name = $"{nameof(SEOController)}/{nameof(RobotsTxt)}")]
    [ResponseCache(Duration = 600, Location = ResponseCacheLocation.Any)]
    public IActionResult RobotsTxt()
    {
        var hiddenUrls = new string[] {
            $"{Url.Action(nameof(AdminController.Index_MVC), nameof(AdminController).RemoveControllerSuffix())}/",
            $"{Url.Action(nameof(FileManagerController.Index), nameof(FileManagerController).RemoveControllerSuffix())}/",
            "/swagger/",
        };

        var sitemapUrl = Url.ActionLink(nameof(SEOController.SitemapXml), nameof(SEOController).RemoveControllerSuffix());

        return Content($"User-agent: *\r\nDisallow: {string.Join("\r\nDisallow: ", hiddenUrls)}\r\nSitemap: {sitemapUrl}", "text/plain");
    }

    #endregion RobotsTxt

    #region SitemapXml

    [HttpGet]
    [Route("/sitemap.xml", Name = $"{nameof(SEOController)}/{nameof(SitemapXml)}")]
    [ResponseCache(Duration = 600, Location = ResponseCacheLocation.Any)]
    public IActionResult SitemapXml()
    {
        var sitemapNodes = new List<SitemapNode>();
        var actionDescriptors = _provider.ActionDescriptors.Items;

        foreach (var descriptor in actionDescriptors)
        {
            if (descriptor is ControllerActionDescriptor cad)
            {
                var hasHttpGet = cad.MethodInfo
                    .GetCustomAttributes(typeof(HttpGetAttribute), inherit: true)
                    .Any();

                var isApiEndpoint = cad.MethodInfo
                    .GetCustomAttributes(typeof(ApiEndpointAttribute), inherit: true)
                    .Any();

                var isIgnoredEndpoint = cad.MethodInfo
                    .GetCustomAttributes(typeof(SitemapIgnoreAttribute), inherit: true)
                    .Any();

                if (isIgnoredEndpoint || isApiEndpoint || !hasHttpGet)
                {
                    continue;
                }

                var routeValues = new Dictionary<string, object>();

                foreach (var param in cad.Parameters)
                {
                    routeValues[param.Name] = "<identifier>";
                }

                var url = cad.AttributeRouteInfo != null && !string.IsNullOrEmpty(cad.AttributeRouteInfo.Name)
                    ? Url.RouteUrl(cad.AttributeRouteInfo.Name, routeValues.Count > 0 ? routeValues : null, Request.Scheme)
                    : Url.Action(cad.ActionName, cad.ControllerName, routeValues.Count > 0 ? routeValues : null, Request.Scheme);

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

    #endregion SitemapXml

    #region Private help functions

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

    #endregion Private help functions
}

public class SitemapNode
{
    public string Url { get; set; }
    public DateTime LastModified { get; set; }
    public string ChangeFrequency { get; set; }
    public decimal Priority { get; set; }
}