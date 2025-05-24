/**
 * Enhanced Right-Click & Drag Protection Script
 * Optimized for performance and modern browsers
 * @version 2.0
 */

const isMac = navigator.userAgent.includes('Mac');
const isIE = !!document.documentMode;
const isLegacyIE = isIE && parseFloat(navigator.userAgent.match(/MSIE (\d+\.\d+)/i)?.[1] || '0') <= 4;
const isFileProtocol = window.location.protocol === 'file:';

// Main configuration
const config = {
  disableRightClick: true,
  disableDrag: true,
  disableStatusBarText: true,
  preventLocalFileAccess: true
};

// Core functions
const disableContextMenu = (e) => {
  e.preventDefault();
  return false;
};

const checkMouseDown = (e) => {
  const rightClick = e.button === 2 || (isMac && (e.ctrlKey || e.keyCode === 91));
  if (rightClick) {
    e.preventDefault();
    return false;
  }
  return true;
};

const disableDragStart = () => {
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });
  
  // Modern approach for image drag prevention
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
  });
};

const clearStatusBar = () => {
  window.status = '';
};

const preventLocalFileAccess = () => {
  if (isFileProtocol && config.preventLocalFileAccess) {
    window.location.replace('about:blank');
  }
};

// Event listener setup
const setupEventListeners = () => {
  if (!config.disableRightClick) return;

  // Modern browsers
  if (document.addEventListener) {
    document.addEventListener('contextmenu', disableContextMenu);
    
    if (isLegacyIE || !isIE) {
      document.addEventListener('mousedown', checkMouseDown);
      if (isMac) {
        document.addEventListener('keydown', checkMouseDown);
      }
    }
  } 
  // Legacy IE
  else if (document.attachEvent) {
    document.attachEvent('oncontextmenu', disableContextMenu);
    document.attachEvent('onmousedown', checkMouseDown);
    if (isMac) {
      document.attachEvent('onkeydown', checkMouseDown);
    }
  }

  // Status bar text prevention
  if (config.disableStatusBarText) {
    const clearStatus = () => {
      window.status = '';
      setTimeout(clearStatus, 100);
    };
    
    document.addEventListener('mouseover', clearStatusBar);
    document.addEventListener('mouseout', clearStatusBar);
    clearStatus();
  }

  // Drag prevention
  if (config.disableDrag) {
    disableDragStart();
  }
};

// Initialize
const initProtection = () => {
  preventLocalFileAccess();
  setupEventListeners();
};

// Modern DOM ready check
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initProtection();
} else {
  document.addEventListener('DOMContentLoaded', initProtection);
}
