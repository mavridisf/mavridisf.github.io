/* ----------------------------------------------------------------------------
    Copyright © 2025 Philippe Mavridis <philippe.mavridis@yandex.com>
    Distributed under the terms of CC-BY-SA 4.0:
      https://creativecommons.org/licenses/by-sa/4.0/deed.en
---------------------------------------------------------------------------- */


// Modify this array to customize which buttons are displayed and in which order
SOCIAL_BUTTONS = ["mastodon", "x", "facebook", "reddit", "weibo", "whatsapp",
                  "linkedin", "pinterest", "email"];

const getSocialShareURL = service => {
  const url = encodeURI(window.location.href);
  const title = encodeURI(document.title);

  switch (service) {
    case "facebook":
      return `https://www.facebook.com/sharer.php?u=${url}`;
    case "x":
      return `https://x.com/intent/tweet?original_referer=${url}&url=${url}&text=${title}`;
    case "mastodon":
      return `https://mastodonshare.com/?text=${title}&url=${url}`;
    case "weibo":
      return `http://service.weibo.com/share/share.php?title=${title}&url=${url}`;
    case "reddit":
      return `https://reddit.com/submit?url=${url}`;
    case "linkedin":
      return `https://www.linkedin.com/shareArticle?url=${url}&title=${title}`;
    case "whatsapp":
      return `https://api.whatsapp.com/send?text=${title}%20${url}`;
    case "pinterest":
      return `http://pinterest.com/pin/create/button/?url=${url}&description=${title}`;
    case "email":
      return `mailto:?subject=${title}&body=${url}`;
  }
  return null;
}

const makeSocialButton = service => {
  const url = service ? getSocialShareURL(service) : "#";
  if (!url) return;

  let icon = $$("img").asset(service ?? "misc");
  return $$("a", icon.outerHTML, {href: url});
}

const nativeShare = async () => {
  try {
    await navigator.share({
        title: document.title,
        text: document.title,
        url: window.location.href
    });
  }
  catch {
    alert("Διαμοιρασμός μη διαθέσιμος");
  }
}

window.on("load", () => {
  $(".social-share").forEach(block => {
    SOCIAL_BUTTONS.forEach(social => {
      block.append(makeSocialButton(social));
    });

    if (navigator.share !== undefined) {
      let nativeShareButton = makeSocialButton();
      nativeShareButton.on("click", nativeShare);
      block.append(nativeShareButton);
    }
  });
});

// kate: replace-tabs true; indent-width 2;