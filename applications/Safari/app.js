(function () {
  const appwindow = document.querySelector('.appwindow:last-child');

  // Helper function to extract main domain from URL
  function extractMainDomain(url) {
    let domain = url.replace(/^(https?:\/\/)?(www\.)?/, ''); // Remove scheme and 'www.'
    domain = domain.split('/')[0]; // Extract domain part before first '/'
    return domain;
  }

  // Helper function to check if a string is a valid domain name
  function isValidDomain(domain) {
    const domainPattern = /^(https?:\/\/)?(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)?$/;
    return domainPattern.test(domain);
  }

  // Helper function to construct Google search URL
  function constructGoogleSearchURL(query) {
    return 'https://www.google.com/search?q=' + encodeURIComponent(query);
  }

  var urlBarDiv = appwindow.querySelector('.safarisearchbar');
  var iframe = appwindow.querySelector('.safariiframe');

  urlBarDiv.addEventListener('paste', function (e) {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  });

  // Event listener for Enter key press
  urlBarDiv.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent new line
      let inputText = urlBarDiv.textContent;
      console.log(inputText.trim());
      urlBarDiv.innerHTML = inputText.trim();
      if (inputText) {
        let url = inputText;

        // Check if input text is a valid URL
        if (!url.startsWith('http')) {
          alert('Safari', 'Iframe support', 'Safari wants to use iframes to browse the web. To allow this, click Continue and follow the steps to enable browsing with iframes.', 'Continue', 'dog');
        }

        if (isValidDomain(url)) {
          iframe.removeAttribute("srcdoc");
          if (!url.startsWith('http') && !url.startsWith('https')) {
            iframe.src = 'http://' + url;
          } else {
            iframe.src = url;
          }
          alert('Safari', 'Iframe support', 'Safari wants to use iframes to browse the web. To allow this, click Continue and follow the steps to enable browsing with iframes.', 'Continue', 'dog');
        } else {
          iframe.removeAttribute("srcdoc");
          iframe.src = constructGoogleSearchURL(url);
          urlBarDiv.innerHTML = constructGoogleSearchURL(url);
        }
      }
    }
  });

  urlBarDiv.addEventListener('focus', function () {
    let currentText = urlBarDiv.textContent;
    if (currentText === '􀊫Search or enter website name') {
      urlBarDiv.innerHTML = '';
    } else {
      urlBarDiv.innerHTML = currentText;
    }

    let url = urlBarDiv.innerText.trim();
    let mainDomain = extractMainDomain(url);

    // Split the URL into sections
    let sections = url.match(/(https?:\/\/)?([^\/]+)(\/.*)?/);

    // Construct HTML spans for each section
    let displayText = `<span>${sections[1] || ''}</span><span>${sections[2]}</span><span>${sections[3] || ''}</span>`;

    urlBarDiv.innerHTML = displayText;

    let range = document.createRange();
    range.selectNodeContents(urlBarDiv);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  });

  urlBarDiv.addEventListener('blur', function () {
    let currentText = urlBarDiv.innerText.trim();
    if (currentText === '') {
      urlBarDiv.innerHTML = '<div class="searchtexticon" id="safarisearchtexticon" style="color: rgba(255, 255, 255, 0.55); margin-right: 5px;">􀊫</div><div class="text" id="safarisearchtext" style="color: rgba(255, 255, 255, 0.26);">Search or enter website name</div>';
    } else {
      urlBarDiv.innerHTML = currentText;
      let url = urlBarDiv.textContent;

      // Split the URL into sections
      let sections = url.match(/(https?:\/\/)?([^\/]+)(\/.*)?/);

      // Construct HTML spans for each section
      let displayText = `<span style="color: ${sections[1] ? 'transparent' : 'white'}; width: 0px;">${sections[1] || ''}</span><span style="color: white;">${sections[2]}</span><span style="color: rgba(255, 255, 255, 0.26);">${sections[3] || ''}</span>`;

      urlBarDiv.innerHTML = displayText;

      let selection = window.getSelection();
      selection.removeAllRanges();
    }
  });


  // Load the homepage initially
  // Set initial placeholder text
  urlBarDiv.innerHTML = '<div class="searchtexticon" id="safarisearchtexticon" style="color: rgba(255, 255, 255, 0.55); margin-right: 5px;">􀊫</div><div class="text" id="safarisearchtext" style="color: rgba(255, 255, 255, 0.26);">Search or enter website name</div>';
  iframe.srcdoc = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Favorites and Privacy Report</title>
    <style>
        @font-face {
          font-family: SFpro;
          font-weight: 800;
          src: url(../fonts/SF-Pro-Text-Bold.otf);
        }
        
        @font-face {
            font-family: SFpro;
            font-weight: 700;
            src: url(../fonts/SF-Pro-Text-Semibold.otf);
        }
        
        @font-face {
            font-family: SFpro;
            font-weight: 600;
            src: url(../fonts/SF-Pro-Text-Medium.otf);
        }
        
        @font-face {
            font-family: SFpro;
            font-weight: 500;
            src: url(../fonts/SF-Pro-Text-Regular.otf);
        }
        
        @font-face {
            font-family: SFpro;
            font-weight: 400;
            src: url(../fonts/SF-Pro-Text-Light.otf);
        }
        
        @font-face {
            font-family: SFpro;
            font-weight: 300;
            src: url(../fonts/SF-Pro-Text-Thin.otf);
        }

        * {
          font-family: SFpro;
        }

        ::-webkit-scrollbar {
            width: 0px !important;
        }

        ::-webkit-scrollbar-track {
            background-color: transparent !important;
        }
            
        body {
            margin: 0;
            padding: 0;
            min-height: calc(100vh - 64px);
            display: flex;
            justify-content: center;
            background: transparent;
            color: white;
            padding-bottom: 64px;
        }
        .container {
            max-width: 800px;
            margin-top: 64px;
            text-align: left;
        }
        .favorites {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 50px;
        }
        h2 {
            margin-bottom: 10px;
            color: white;
        }
        .site {
            width: 60px;
            height: 60px;
            background-color: #e0e0e0;
            border-radius: 8px;
        }
        .site-name {
            display: block;
            text-align: center;
            margin-top: 10px;
            color: white;
            font-weight: 300;
            font-size: 14px;
        }
        .privacy-report {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 8px;
        }
        .privacy-report .icon::before {
            content: "􀙨 20";
            font-size: 22px;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Favorites</h2>
        <div class="favorites">
            <div>
                <div class="site"></div>
                <span class="site-name">Site1</span>
            </div>
            <div>
                <div class="site"></div>
                <span class="site-name">Site2</span>
            </div>
            <div>
                <div class="site"></div>
                <span class="site-name">Site3</span>
            </div>
        </div>
        <h2>Privacy Report</h2>
        <div class="privacy-report">
            <div>
                <span class="icon"></span> In the last 7 days, this browser has prevented 12 trackers from profiling you.
            </div>
        </div>
    </div>
</body>
</html>
`;
})();