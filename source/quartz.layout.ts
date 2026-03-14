import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.RecentNotes({
      title: "Recent notes",
      limit: 3,
      showTags: false,
      // Read dates purely from YAML frontmatter — never from filesystem.
      // The plugin reads `date:` but not `created:`, so we parse both ourselves.
      filter: (f) => {
        const raw = f.frontmatter?.date ?? f.frontmatter?.created
        if (!raw) return false
        const d = new Date(raw as string)
        return !isNaN(d.getTime())
      },
      sort: (f1, f2) => {
        const parseDate = (f: typeof f1) => {
          const raw = f.frontmatter?.date ?? f.frontmatter?.created
          if (!raw) return null
          const d = new Date(raw as string)
          return isNaN(d.getTime()) ? null : d
        }
        const d1 = parseDate(f1)
        const d2 = parseDate(f2)
        if (d1 && d2) return d2.getTime() - d1.getTime()
        if (d1) return -1
        if (d2) return 1
        return 0
      },
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  right: [],
}
