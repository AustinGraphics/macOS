(function () {
    var textmenuopen = 0;

    const appwindow = document.querySelector('.appwindow:last-child');
    const toolbar = appwindow.querySelector('.main trix-toolbar');

    const popuparrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    popuparrow.classList.add('popuparrow')
    popuparrow.setAttribute("width", "40");
    popuparrow.setAttribute("height", "16");
    popuparrow.setAttribute("viewBox", "0 0 40 16");
    popuparrow.setAttribute("fill", "none");
    popuparrow.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M18.0532 3.54102C15.0629 7.85209 9.05261 15.6227 4.57936 15.6227L0.255371 15.9796H39.2739L34.8141 15.6227C31.1591 15.6227 24.9582 7.78765 21.8303 3.48768C20.9084 2.22046 18.9463 2.25341 18.0532 3.54102Z");
    path1.setAttribute("fill", "#33303A");
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M39.2739 15.6227H34.8137C31.1587 15.6227 24.9578 7.78765 21.8299 3.48768C20.9081 2.22046 18.9459 2.25341 18.0528 3.54103C15.0626 7.85209 9.05223 15.6227 4.57898 15.6227H0.255371");
    path2.setAttribute("stroke", "#4D4B53");
    path2.setAttribute("stroke-width", "0.714837");
    popuparrow.appendChild(path1);
    popuparrow.appendChild(path2);
    toolbar.appendChild(popuparrow);

    const quickbuttons = toolbar.querySelector('.trix-button-group--text-tools');
    toolbar.querySelector('.trix-button-row .trix-button-group.trix-button-group--history-tools').remove();
    toolbar.querySelector('.trix-button-row .trix-button-group.trix-button-group--file-tools').remove();
    toolbar.querySelector('.trix-button-row .trix-button-group .trix-button.trix-button--icon-link').remove();
    toolbar.querySelector('.trix-button-row .trix-button-group .trix-button.trix-button--icon-heading-1').remove();
    toolbar.querySelector('.trix-button-row .trix-button-group .trix-button.trix-button--icon-code').remove();
    toolbar.querySelector('.trix-button-row .trix-button-group .trix-button.trix-button--icon-quote').remove();
    toolbar.querySelector('.trix-button-row .trix-button-group .trix-button.trix-button--icon-bullet-list').remove();
    toolbar.querySelector('.trix-button-row .trix-button-group .trix-button.trix-button--icon-number-list').remove();
    toolbar.querySelector('.trix-button-row .trix-button-group .trix-button.trix-button--icon-decrease-nesting-level').remove();
    toolbar.querySelector('.trix-button-row .trix-button-group .trix-button.trix-button--icon-increase-nesting-level').remove();
    const blocktools = toolbar.querySelector('.trix-button-group--block-tools');
    const header1 = document.createElement('button');
    header1.type = "button";
    header1.classList.add('trix-button');
    header1.classList.add('trix-button--icon-heading-1');
    header1.setAttribute('data-trix-attribute', 'heading1');
    header1.textContent = 'Title';
    blocktools.appendChild(header1);
    const header2 = document.createElement('button');
    header2.type = "button";
    header2.classList.add('trix-button');
    header2.classList.add('trix-button--icon-heading-2');
    header2.setAttribute('data-trix-attribute', 'heading2');
    header2.textContent = 'Heading';
    blocktools.appendChild(header2);
    const header3 = document.createElement('button');
    header3.type = "button";
    header3.classList.add('trix-button');
    header3.classList.add('trix-button--icon-heading-3');
    header3.setAttribute('data-trix-attribute', 'heading3');
    header3.textContent = 'Subheading';
    blocktools.appendChild(header3);
    const body = document.createElement('button');
    body.type = "button";
    body.classList.add('trix-button');
    body.classList.add('trix-button--icon-body');
    body.setAttribute('data-trix-attribute', 'div');
    body.textContent = 'Body';
    blocktools.appendChild(body);
    const mono = document.createElement('button');
    mono.type = "button";
    mono.classList.add('trix-button');
    mono.classList.add('trix-button--icon-mono');
    mono.setAttribute('data-trix-attribute', 'monospaced');
    mono.textContent = 'Monospaced';
    blocktools.appendChild(mono);
    const bullet = document.createElement('button');
    bullet.type = "button";
    bullet.classList.add('trix-button');
    bullet.classList.add('trix-button--icon-bullet-list');
    bullet.setAttribute('data-trix-attribute', 'bullet');
    bullet.textContent = '• Bulleted List';
    blocktools.appendChild(bullet);
    const number = document.createElement('button');
    number.type = "button";
    number.classList.add('trix-button');
    number.classList.add('trix-button--icon-number-list');
    number.setAttribute('data-trix-attribute', 'number');
    number.textContent = '1. Numbered List';
    blocktools.appendChild(number);
    Trix.config.textAttributes.heading2 = {
        tagName: 'h2',
        inheritable: true
    }
    Trix.config.textAttributes.heading3 = {
        tagName: 'h3',
        inheritable: true
    }
    Trix.config.textAttributes.body = {
        tagName: 'div',
        inheritable: true
    }
    Trix.config.textAttributes.monospaced = {
        tagName: 'code',
        inheritable: true
    }
    colorjs.average('./media/wallpaper.jpg').then(colour => {
        // Convert RGB to a tinycolor object
        const color = tinycolor({ r: colour[0], g: colour[1], b: colour[2] });

        // Desaturate the color (reduce saturation by 30%)
        const desaturatedColor = color.desaturate(80);
        const darkenedColor = desaturatedColor.darken(3);

        // Get the resulting color in RGB format
        const resultRgb = darkenedColor.toRgb();
        
        toolbar.style.backgroundColor = `rgb(${resultRgb.r}, ${resultRgb.g}, ${resultRgb.b})`;
    })
    appwindow.querySelector('.textcontrol').addEventListener('click', function () {
        if (window.getComputedStyle(appwindow.querySelector('.windowsections .main trix-toolbar')).getPropertyValue('display') == 'none') {
            appwindow.querySelector('.windowsections .main trix-toolbar').style.left = ((appwindow.querySelector('.textcontrol').getBoundingClientRect().left) - appwindow.getBoundingClientRect().left ) - 76 + 'px';
            appwindow.querySelector('.windowsections .main trix-toolbar').style.display = 'flex';
            textmenuopen = 1;
        } else {
            appwindow.querySelector('.windowsections .main trix-toolbar').style.display = 'none';
            textmenuopen = 0;
        }
    });
    document.addEventListener('click', function(event) {
        var buttondiv = appwindow.querySelector('.windowsections .main .topbar .textcontrol');
        var div = appwindow.querySelector('.windowsections .main trix-toolbar');
    
        if (!buttondiv.contains(event.target) && textmenuopen == 1 && !div.contains(event.target)) {
            div.style.display = 'none';
        }
    });
})();
