// ==UserScript==
// @name     Auto-reload twitter
// @version  2.2.0
// @grant    none
// @author   hova
// @author   garamir
// @include  https://www.twitter.com/*
// @include  https://twitter.com/*
// @include  https://mobile.twitter.com/*
// @downloadURL http://hova.org/AutoTwitterReload.user.js
// @updateURL   http://hova.org/AutoTwitterReload.user.js
// ==/UserScript==
var FindSpanLoopCount = 0;
var WaitingOnPageLoad = false;

function FindSpan() {
  try {
    if (FindSpanLoopCount > 20)
      return;
    //console.log("Looking for twitter fail message for " + (20 - FindSpanLoopCount) + " times.");
    if (location.href.substr(location.href.lastIndexOf("?")).length == 5) {
      location.replace(location.href.substr(0, location.href.lastIndexOf("?")));
    }
    FindSpanLoopCount++;
    var querys = document.querySelector("html>body>div>div>div>div>main>div>div>div>div>div>div>div>div>div>h1>span");
    if (querys != null && querys.innerHTML == "This is not available to you") {
      location.reload();
    }
    querys = document.querySelector("html>body>div>div>div>div>main>div>div>div>div>div>div>div>div>div>span");
    if (querys != null && querys.innerHTML == "Something went wrong. Try reloading.") {
      location.reload();
    }
    document.querySelectorAll("div>span>span>span").forEach(queryitem => {
      if (queryitem != null && queryitem.innerHTML.includes("Age-restricted adult content")) {
        if (!WaitingOnPageLoad) {
          window.location.hostname = 'nitter.kavin.rocks';
          WaitingOnPageLoad = true;
          setTimeout(function () { WaitingOnPageLoad = false; }, 5000);
        }
      }
    });
    //querys = document.querySelector("html>body>div>div>div>div>main>div>div>div>div>div>section>div>div>div>div>div>article>div>div>div>div>div>div>div>div>div>span>span>span");
    // if (querys != null && querys.innerHTML.includes("Age-restricted adult content")) {
    //     if (!WaitingOnPageLoad) {
    //         window.location.hostname = 'nitter.kavin.rocks';
    //         WaitingOnPageLoad = true;
    //         setTimeout(function() { WaitingOnPageLoad = false; }, 5000);
    //     }
    // }
    var spans = document.getElementsByTagName("span");
    var i = 0;
    for (i = 0; i < spans.length; i++) {
      var s = spans[i];
      if (s.innerText == "This is not available to you" || s.innerText == "Something went wrong. Try reloading.") {
        location.reload();
      }
    }

  } catch (err) {
    console.log(err);
  }
}

window.setInterval(FindSpan, 500);
