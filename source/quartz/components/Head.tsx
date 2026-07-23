import { i18n } from "../i18n"
import { FullSlug, joinSegments, pathToRoot, simplifySlug } from "../util/path"
import { JSResourceToScriptElement } from "../util/resources"
import { googleFontHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData, externalResources }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description
    const { css, js } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)

    const iconPath = joinSegments(baseDir, "static/icon.png")
    const ogImagePath = `https://${cfg.baseUrl}/static/og-image.jpg`
    const canonicalUrl = fileData.slug
      ? `https://${joinSegments(cfg.baseUrl ?? "", encodeURI(simplifySlug(fileData.slug)))}`
      : `https://${cfg.baseUrl ?? ""}`
    const isArticle = fileData.slug !== "index" && fileData.slug !== "404"
    const ogType = isArticle ? "article" : "website"

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
          </>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content={ogType} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={cfg.pageTitle} />
        {cfg.baseUrl && <meta property="og:image" content={ogImagePath} />}
        {cfg.baseUrl && <meta property="og:image:width" content="1200" />}
        {cfg.baseUrl && <meta property="og:image:height" content="675" />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {cfg.baseUrl && <meta name="twitter:image" content={ogImagePath} />}
        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />
        {css.map((href) => (
          <link key={href} href={href} rel="stylesheet" type="text/css" spa-preserve />
        ))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        <script
          data-goatcounter="https://alexislearning-scrapbook.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        />
        <script>
          {`if (location.hostname === 'alexislearning.me') { location.replace('https://alexanderlarge.com' + location.pathname + location.search + location.hash) }`}
        </script>
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
