/**
 * 判断当前浏览器是否是PC端浏览器
 * @returns {boolean} 是PC浏览器返回true，否则返回false
 */
export function isPCBrowser() {
  // 检测用户代理字符串
  const userAgent = window.navigator.userAgent

  // 检查是否有移动设备的特征
  const mobileKeywords = [
    'Android',
    'iPhone',
    'iPad',
    'iPod',
    'BlackBerry',
    'Windows Phone',
    'MeeGo',
    'SymbianOS',
    'IEMobile',
    'Mobile',
    'Opera Mini',
    'Opera Mobi',
    'webOS',
    'Tablet',
    'Pad'
  ]

  const hasMobileKeyword = mobileKeywords.some(
    (keyword) => userAgent.indexOf(keyword) !== -1
  )

  // 检测是否是常见的PC操作系统
  const isPCOS =
    (userAgent.indexOf('Windows') !== -1 &&
      userAgent.indexOf('Windows Phone') === -1) ||
    userAgent.indexOf('Macintosh') !== -1 ||
    (userAgent.indexOf('Linux') !== -1 && userAgent.indexOf('Android') === -1)

  // 检测屏幕尺寸（一般PC屏幕较大）
  const hasLargeScreen =
    window.screen.width >= 1024 && window.screen.height >= 768

  // 检测是否支持鼠标事件但不支持触摸事件
  // 注意：许多现代PC也支持触摸事件，所以这个检测不是非常可靠
  const hasTouchSupport =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0

  // 精确检测是否是平板
  const isTablet =
    /Tablet|iPad/i.test(userAgent) || (hasTouchSupport && hasLargeScreen)

  // 综合判断
  // 1. 没有移动设备关键词 且 是PC操作系统
  // 2. 或者有大屏幕但不是平板设备
  return (!hasMobileKeyword && isPCOS) || (hasLargeScreen && !isTablet)
}

const DOBOT_STUDIO_PRO_CONFIG = {
  DEFAULT_WIDTH: 1920, // 默认屏幕宽度
  MIN_WIDTH: 1440, // 16px 字体大小的最小屏幕宽度
  DOBOT_PLUS_ROOT_FONT_SIZE: 100 // Dobot Plus 根元素字体大小
}

function setFontSize() {
  const innerWidth = window.parent
    ? window.parent.window.innerWidth
    : window.innerWidth
  if (!innerWidth) return
  let scale = 1
  // 窗口宽度小于最小宽度时，缩放比例为当前窗口宽度与最小宽度的比值
  if (innerWidth < DOBOT_STUDIO_PRO_CONFIG.MIN_WIDTH) {
    scale = innerWidth / DOBOT_STUDIO_PRO_CONFIG.MIN_WIDTH
  }
  if (
    innerWidth >= DOBOT_STUDIO_PRO_CONFIG.MIN_WIDTH &&
    innerWidth <= DOBOT_STUDIO_PRO_CONFIG.DEFAULT_WIDTH
  ) {
    // 窗口宽度在最小宽度和默认宽度之间时，按比例缩放，1440-1920 屏幕区间，上位机字体范围 14px ~ 16px
    scale = Math.min(
      1,
      Math.max(innerWidth / DOBOT_STUDIO_PRO_CONFIG.DEFAULT_WIDTH, 14 / 16)
    )
  }
  // 窗口宽度大于默认宽度时，缩放比例为当前窗口宽度与默认宽度的比值
  if (innerWidth > DOBOT_STUDIO_PRO_CONFIG.DEFAULT_WIDTH) {
    scale = innerWidth / DOBOT_STUDIO_PRO_CONFIG.DEFAULT_WIDTH
  }

  document.documentElement.style.fontSize = `${scale * DOBOT_STUDIO_PRO_CONFIG.DOBOT_PLUS_ROOT_FONT_SIZE}px`
}

function reSize(doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth
      var clientHeight = docEl.clientHeight
      if (!clientWidth) return
      if (clientWidth >= 596 && clientHeight >= 624) {
        docEl.style.fontSize = '100px'
      } else if (clientWidth < 596 && clientHeight >= 624) {
        docEl.style.fontSize = 100 * (clientWidth / 596) + 'px'
      } else if (clientWidth >= 596 && clientHeight < 624) {
        docEl.style.fontSize = 100 * (clientHeight / 624) + 'px'
      } else {
        docEl.style.fontSize = 100 * (clientWidth / 624) + 'px'
      }
    }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
}

// 判断是否是PC端浏览器
if (isPCBrowser()) {
  setFontSize()
  window.onresize = function () {
    setFontSize()
  }
} else {
  reSize(document, window)
}
