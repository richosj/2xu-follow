(function () {
  var DEVICES = {
    mobile: { width: 375, label: "모바일" },
    tablet: { width: 768, label: "태블릿" },
    desktop: { width: 1440, label: "PC" },
  };

  var PAGE_GROUPS = [
    {
      title: "랜딩",
      items: [
        { id: "01", name: "테크스토리", file: "tech.html" },
        { id: "02", name: "팔로워 전용 이벤트", file: "follow.html" },
      ],
    },
  ];

  var nav = document.getElementById("viewerNav");
  var iframe = document.getElementById("viewerIframe");
  var frame = document.getElementById("viewerFrame");
  var sizeLabel = document.getElementById("viewerSizeLabel");
  var pageCount = document.getElementById("viewerPageCount");
  var openTabBtn = document.getElementById("viewerOpenTab");
  var deviceButtons = document.querySelectorAll(".viewer-device");

  var currentFile = "tech.html";
  var currentDevice = "mobile";

  function pageSrc(file) {
    return "./" + file;
  }

  function getPages() {
    return PAGE_GROUPS.reduce(function (acc, group) {
      return acc.concat(group.items);
    }, []);
  }

  function renderNav() {
    pageCount.textContent = getPages().length + "개 화면";

    nav.innerHTML = PAGE_GROUPS.map(function (group) {
      var items = group.items
        .map(function (item) {
          var isActive = item.file === currentFile;
          return (
            "<li>" +
            '<button type="button" class="viewer-nav__btn' +
            (isActive ? " viewer-nav__btn--active" : "") +
            '" data-file="' +
            item.file +
            '">' +
            '<span class="viewer-nav__id">' +
            item.id +
            "</span>" +
            '<span class="viewer-nav__name">' +
            item.name +
            "</span>" +
            "</button>" +
            "</li>"
          );
        })
        .join("");

      return (
        '<section class="viewer-nav__group">' +
        "<h2>" +
        group.title +
        "</h2>" +
        "<ul>" +
        items +
        "</ul>" +
        "</section>"
      );
    }).join("");
  }

  function loadPage(file) {
    currentFile = file;
    iframe.src = pageSrc(file);
    renderNav();
    history.replaceState(null, "", "#" + encodeURIComponent(file));
  }

  function setDevice(device) {
    currentDevice = device;
    var info = DEVICES[device];

    frame.dataset.device = device;
    frame.className = "viewer-frame viewer-frame--" + device;
    frame.style.setProperty("--frame-width", info.width + "px");

    deviceButtons.forEach(function (btn) {
      var active = btn.dataset.device === device;
      btn.classList.toggle("viewer-device--active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    updateSizeLabel(info.width, info.label);
  }

  function updateSizeLabel(width, label) {
    var frameHeight = Math.round(frame.getBoundingClientRect().height);
    sizeLabel.textContent = label + " · " + width + " × " + (frameHeight || "—");
  }

  function initFromHash() {
    var hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!hash) return;
    var exists = getPages().some(function (page) {
      return page.file === hash;
    });
    if (exists) currentFile = hash;
  }

  nav.addEventListener("click", function (event) {
    var btn = event.target.closest(".viewer-nav__btn");
    if (!btn) return;
    loadPage(btn.dataset.file);
  });

  deviceButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setDevice(btn.dataset.device);
    });
  });

  openTabBtn.addEventListener("click", function () {
    window.open(pageSrc(currentFile), "_blank");
  });

  iframe.addEventListener("load", function () {
    updateSizeLabel(DEVICES[currentDevice].width, DEVICES[currentDevice].label);
  });

  window.addEventListener("resize", function () {
    updateSizeLabel(DEVICES[currentDevice].width, DEVICES[currentDevice].label);
  });

  initFromHash();
  renderNav();
  iframe.src = pageSrc(currentFile);
  setDevice("mobile");
})();
