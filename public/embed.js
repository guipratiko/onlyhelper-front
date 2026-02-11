(function () {
  'use strict';

  var script = document.currentScript;
  var baseUrl = (script && script.getAttribute('data-api')) || '';
  if (!baseUrl && script && script.src) {
    try {
      var u = new URL(script.src);
      baseUrl = u.origin;
    } catch (_) {}
  }
  if (!baseUrl) baseUrl = 'http://localhost:3000';

  var STORAGE_KEY = 'onlyhelper_sid';
  function getSessionId() {
    try {
      var sid = localStorage.getItem(STORAGE_KEY);
      if (sid) return sid;
      sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      localStorage.setItem(STORAGE_KEY, sid);
      return sid;
    } catch (_) {
      return 's' + Date.now();
    }
  }

  var sid = getSessionId();
  var widgetUrl = baseUrl.replace(/\/$/, '') + '/widget?sid=' + encodeURIComponent(sid);

  var open = false;
  var container = null;
  var iframe = null;
  var btn = null;

  function createButton() {
    btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'Abrir suporte');
    btn.style.cssText =
      'position:fixed;bottom:20px;right:20px;width:84px;height:84px;border-radius:50%;border:none;background:transparent;color:#fff;cursor:pointer;z-index:2147483647;transition:transform .2s;padding:0;display:flex;align-items:center;justify-content:center;overflow:hidden;';
    var icon = document.createElement('img');
    icon.src = baseUrl.replace(/\/$/, '') + '/IconeSuporte.png';
    icon.alt = '';
    icon.style.cssText = 'width:56px;height:56px;object-fit:contain;';
    btn.appendChild(icon);
    btn.onmouseover = function () {
      btn.style.transform = 'scale(1.05)';
    };
    btn.onmouseout = function () {
      btn.style.transform = 'scale(1)';
    };
    btn.onclick = toggle;
    document.body.appendChild(btn);
  }

  function createPanel() {
    container = document.createElement('div');
    container.style.cssText =
      'position:fixed;bottom:90px;right:20px;width:380px;max-width:calc(100vw - 40px);height:420px;max-height:70vh;background:#141416;border:1px solid #2a2a2e;border-radius:12px;box-shadow:0 25px 50px -12px rgba(0,0,0,.5);z-index:2147483646;display:none;overflow:hidden;';
    iframe = document.createElement('iframe');
    iframe.src = widgetUrl;
    iframe.style.cssText = 'width:100%;height:100%;border:none;';
    container.appendChild(iframe);
    var close = document.createElement('button');
    close.setAttribute('type', 'button');
    close.setAttribute('aria-label', 'Fechar');
    close.textContent = '×';
    close.style.cssText =
      'position:absolute;top:8px;right:8px;width:32px;height:32px;border:none;background:transparent;color:#a1a1aa;font-size:24px;cursor:pointer;line-height:1;z-index:1;';
    close.onclick = toggle;
    container.appendChild(close);
    document.body.appendChild(container);
  }

  function toggle() {
    open = !open;
    if (open) {
      if (!container) createPanel();
      container.style.display = 'block';
    } else {
      if (container) container.style.display = 'none';
    }
  }

  createButton();
})();
