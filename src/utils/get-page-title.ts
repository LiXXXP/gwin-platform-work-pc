// import defaultSettings from '../settings'

const title = '灰鲸·禹迹'

export function getPageTitle(pageTitle: string): string {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
