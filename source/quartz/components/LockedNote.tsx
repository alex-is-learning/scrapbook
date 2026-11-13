// @ts-ignore
import script from "./scripts/lockednote.inline"
import style from "./styles/lockednote.scss"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const LockedNote: QuartzComponent = () => null

LockedNote.afterDOMLoaded = script
LockedNote.css = style

export default (() => LockedNote) satisfies QuartzComponentConstructor
