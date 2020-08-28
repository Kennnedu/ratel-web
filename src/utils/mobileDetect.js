import MobileDetect from 'mobile-detect'

export const isMobile = () => {
  return new MobileDetect(window.navigator.userAgent).mobile();
}
