/* ----------------------------------------------------------------------------
    Copyright © 2025 Philippe Mavridis <philippe.mavridis@yandex.com>
    Distributed under the terms of CC-BY-SA 4.0:
      https://creativecommons.org/licenses/by-sa/4.0/deed.en
---------------------------------------------------------------------------- */

var assets = {
  windows: {
    src: "windows.png",
    alt: "Windows",
    class: "os windows"
  },
  linux: {
    src: "linux.png",
    alt: "Linux",
    class: "os linux"
  },
  apple: {
    src: "apple.png",
    alt: "macOS / iOS",
    class: "os apple"
  },
  android: {
    src: "android.png",
    alt: "Android",
    class: "os android"
  },
  pc: {
    src: "pc.png",
    alt: "Computer",
    class: "pc"
  },

  share: {
    src: "share.png",
    alt: "Οι μεγάλοι παίκτες της αγοράς ΛΣ"
  },
  facebook: {
    src: "social/facebook.png",
    alt: "Facebook"
  },
  x: {
    src: "social/x.png",
    alt: "X / Twitter"
  },
  mastodon: {
    src: "social/mastodon.png",
    alt: "Mastodon"
  },
  weibo: {
    src: "social/weibo.png",
    alt: "Weibo"
  },
  reddit: {
    src: "social/reddit.png",
    alt: "Reddit"
  },
  linkedin: {
    src: "social/linkedin.png",
    alt: "LinkedIn"
  },
  whatsapp: {
    src: "social/whatsapp.png",
    alt: "WhatsApp"
  },
  pinterest: {
    src: "social/pinterest.png",
    alt: "Pinterest"
  },
  email: {
    src: "social/email.png",
    alt: "E-Mail"
  },
  misc: {
    src: "social/misc.png",
    alt: "Άλλο"
  }
};

HTMLImageElement.prototype.asset = function(assetId) {
  let asset = assets[assetId];
  if (asset) {
    for (let attr in asset) {
      let val = asset[attr];

      // Expand asset path
      if (attr == 'src') {
        val = "assets/" + val;
      }

      this.attribute(attr, val);

      // Also use value of alt attribute as title
      if (attr == 'alt') {
        this.attribute('title', val);
      }
    }
  }
  return this;
}

// --- Initialize image assets ------------------------------------------------
window.on("load", () => {
  $("img[data-asset]").forEach(el => el.asset(el.attribute("data-asset")));
});

// kate: replace-tabs true; indent-width 2;