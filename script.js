var macFocusedApp = "Finder";

// Create Mac Menu Bar
function createMacMenuBar() {
    const macMenuBar = document.getElementById('macmenubar');
    fetch(`/applications/${macFocusedApp.toLowerCase()}/appmetadata.json`)
        .then(response => response.json())
        .then(data => {
            // Extract menu items from the Menubar object
            const menubar = data.Menubar;

            // Create the items array with the special logo and the first menu item
            const items = [
                { class: 'button icon appleicon', content: '􀣺' },
                { class: 'button appname', content: Object.keys(menubar)[0] }
            ];

            // Append the other menu items to the items array
            Object.keys(menubar).forEach(menuItem => {
                if (menuItem !== Object.keys(menubar)[0]) {
                    items.push({ class: 'button', content: menuItem });
                }
            });

            // Map the items array to ensure all items are in the required format
            const formattedItems = items.map(item => typeof item === 'string' ? { class: 'button', content: item } : item);

            // Use the formattedItems array as needed
            console.log(formattedItems);
            macMenuBar.innerHTML = '';
            formattedItems.forEach(item => {
                const div = document.createElement('div');
                div.className = item.class;
                div.textContent = item.content;
                div.addEventListener('click', () => loadPanel(div, 'click'));
                div.addEventListener('mouseover', () => loadPanel(div, 'mouseover'));
                macMenuBar.appendChild(div);
            });

            const rightItems = [
                { class: 'button icon', content: '􀊫' },
                { class: 'button icon', content: '􀜊' },
                { class: 'button menubartime', content: 'Sat 25 May 09:47' }
            ];

            const menuBarRight = document.createElement('div');
            menuBarRight.className = 'menubarright';
            rightItems.forEach(item => {
                const div = document.createElement('div');
                div.className = item.class;
                div.textContent = item.content;
                menuBarRight.appendChild(div);
            });
            macMenuBar.appendChild(menuBarRight);
        })
        .catch(error => console.error('Error loading JSON:', error));
}

let currentPanelElement = null;
let cachedData = {}; // Object to store cached JSON data

function loadPanel(item, type) {
    const body = document.getElementById('body');
    let panel = document.getElementById('macmenupanel');

    if (type === 'mouseover' && !panel) return; // Do nothing on hover if no panel exists

    if (!panel) {
        if (type === 'click') {
            panel = document.createElement('div');
            panel.id = 'macmenupanel';
            panel.className = 'macmenupanel';
            body.appendChild(panel);
        }
    } else {
        panel.innerHTML = ''; // Clear existing panel content
    }

    if (panel) {
        panel.style.left = `${item.getBoundingClientRect().left}px`;
    }

    const updatePanelContent = (menuItems) => {
        menuItems.forEach(menuItem => {
            Object.entries(menuItem).forEach(([text, keys]) => {
                const div = document.createElement('div');
                if (text === 'Divider') {
                    div.className = 'divider';
                } else {
                    div.className = 'option';
                    const textDiv = document.createElement('div');
                    textDiv.className = 'text';
                    textDiv.textContent = text;
                    div.appendChild(textDiv);
                    if (keys) {
                        const keysDiv = document.createElement('div');
                        keysDiv.className = 'keys';
                        keysDiv.textContent = keys;
                        div.appendChild(keysDiv);
                    }
                }
                panel.appendChild(div);
            });
        });
        currentPanelElement = panel;
    };

    function fetchAndLoadData(url, key) {
        if (cachedData[url]) {
            const data = cachedData[url];
            if (url === 'static/applemenu.json') {
                updatePanelContent(data);
            } else {
                updatePanelContent(key in data.Menubar ? data.Menubar[key] : data);
            }
        } else {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    cachedData[url] = data; // Cache the fetched data
                    if (url === 'static/applemenu.json') {
                        updatePanelContent(data);
                    } else {
                        updatePanelContent(key in data.Menubar ? data.Menubar[key] : data);
                    }
                })
                .catch(error => console.error('Error loading JSON:', error));
        }
    };

    if (item.textContent === '􀣺') {
        fetchAndLoadData('static/applemenu.json');
    } else if (item.textContent.toLowerCase() === macFocusedApp) {
        fetchAndLoadData(`/applications/${(item.textContent).toLowerCase()}/appmetadata.json`, item.textContent);
    } else {
        fetchAndLoadData(`/applications/${macFocusedApp.toLowerCase()}/appmetadata.json`, item.textContent);
    }

    // Add event listener to close panel on click outside
    // Remove any previous click listeners to avoid multiple bindings
    document.body.removeEventListener('click', handleClickOutside);
    document.body.addEventListener('click', handleClickOutside);

    function handleClickOutside(event) {
        const isClickInsidePanel = currentPanelElement?.contains(event.target);
        const isClickOnMenubarItem = document.getElementById('macmenubar').contains(event.target);
        if (!isClickInsidePanel && !isClickOnMenubarItem) {
            currentPanelElement?.remove();
            currentPanelElement = null;
            // Remove the event listener after it executes
            document.body.removeEventListener('click', handleClickOutside);
        }
    }
}

createMacMenuBar();

// dock things
var applicationWindowLists = []

function deleteApplication(appName) {
    if (appName != 'Finder') {
        for (let i = 0; i < applicationWindowLists.length; i++) {
            if (applicationWindowLists[i].hasOwnProperty(appName)) {
                applicationWindowLists.splice(i, 1);
                return 1; // Exit the function once the item is deleted
            }
        }
        console.log(`Application not found: ${appName}`);
        return 0;
    }
}

function increaseApplicationCount(appName) {
    for (let i = 0; i < applicationWindowLists.length; i++) {
        if (applicationWindowLists[i].hasOwnProperty(appName)) {
            applicationWindowLists[i][appName]++;
            return; // Exit the function once the item is updated
        }
    }
    console.log(`making new item: ${appName}`);
    let newItem = {};
    newItem[appName] = 1; // Use computed property names
    applicationWindowLists.push(newItem);
}

function lowerApplicationCount(appName) {
    for (let i = 0; i < applicationWindowLists.length; i++) {
        if (applicationWindowLists[i].hasOwnProperty(appName)) {
            applicationWindowLists[i][appName]--;
            if (applicationWindowLists[i][appName] < 1) {
                return deleteApplication(appName);
            }
            return; // Exit the function once the item is updated
        }
    }
    console.log(`item not found to lower: ${appName}`);
}

fetch("./static/dock_default.json")
    .then((response) => response.json())
    .then((data) => {
        const apps = data;
        const macdock = document.getElementById("macdock");
        for (const application of apps.dock) {
            const app = document.createElement("div");
            app.classList.add("macapp");
            app.id = application;
            try {
                // Create a new image element
                var img = new Image();
                img.src = "../applications/" + application + "/app.png";

                // Set the onload event to set the background image if it loads successfully
                img.onload = function () {
                    app.style.backgroundImage = "url(../applications/" + application + "/app.png)";
                };

                // Set the onerror event to set the fallback background image if there is an error
                img.onerror = function () {
                    app.style.backgroundImage = "url(../media/emptyapp.png)";
                };
            } catch (e) {
                // In case of any unexpected error, set the fallback background image
                app.style.backgroundImage = "url(../media/emptyapp.png)";
            }
            if (application === "Finder") {
                const openapp = document.createElement("div");
                openapp.classList.add("macopenapp");
                app.appendChild(openapp);
            }

            // IIFE to capture the current value of application
            (function (application) {
                fetch("./applications/" + application + "/app.html")
                    .then((response) => {
                        if (!response.ok) {
                            app.addEventListener('click', function () {
                                alert(app.id, 'Broken App', 'This application does not have a destination .html file to load as the main window.', 'Continue', 'dog');
                            });
                        }
                        return response.text();
                    })
                    .then((data) => {
                        console.log(application + 'lol');
                        if (!data.includes('<!DOCTYPE html>')) {

                            app.addEventListener('click', function () {
                                if (!app.querySelector('.macopenapp') && application != 'Launchpad' ) {
                                    const openapp = document.createElement("div");
                                    openapp.classList.add("macopenapp");
                                    app.appendChild(openapp);
                                }

                                console.log(application);
                                increaseApplicationCount(application);

                                const body = document.getElementById('body');
                                const appwindow = document.createRange().createContextualFragment(data).firstElementChild;

                                appwindow.addEventListener('mousedown', (e) => {
                                    if (appwindow.style.zIndex !== windows.length.toString()) {
                                        bringToFront(appwindow);
                                    }
                                });

                                bringToFront(appwindow);

                                // Add drag functionality to the new window
                                addDragFunctionality(appwindow);

                                appwindow.querySelector('.close').addEventListener('click', function () {
                                    if (lowerApplicationCount(application) == 1) {
                                        (app.querySelector('.macopenapp')).remove();
                                    };
                                    appwindow.remove();
                                });
                                appwindow.querySelector('.minimise').addEventListener('click', function () {
                                });
                                appwindow.querySelector('.fullscreen').addEventListener('click', function () {
                                });
                                body.appendChild(appwindow);
                                windows = document.querySelectorAll('.appwindow'); // update the windows list

                                // Load and append the specific JavaScript file for the app
                                const script = document.createElement("script");
                                script.src = "./applications/" + application + "/app.js";
                                appwindow.appendChild(script);

                                // Load and append the specific CSS file for the app
                                const style = document.createElement("link");
                                style.rel = "stylesheet";
                                style.href = "./applications/" + application + "/app.css";
                                appwindow.appendChild(style);
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching app HTML:", error);
                        app.addEventListener('click', function () {
                            console.log(`No .html file found for application: ${application}`);
                        });
                    });
            })(application);

            macdock.appendChild(app);
        }

        const dock = document.getElementById("macdock");
        const appIcons = document.querySelectorAll(".macapp");

        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }

        let targetSizeMultipliers = new Array(appIcons.length).fill(1);
        dock.addEventListener("mousemove", (event) => {
            appIcons.forEach((icon, index) => {
                const rect = icon.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const distance = Math.abs(event.clientX - centerX);
                const maxDistance = 200;
                const normalizedDistance = Math.min(distance / maxDistance, 1);
                targetSizeMultipliers[index] =
                    1 + (1 - easeInOutCubic(normalizedDistance)) * 0.5;
            });
        });

        function animateIcons() {
            appIcons.forEach((icon, index) => {
                const currentWidth = parseFloat(icon.style.width) || 73;
                const currentHeight = parseFloat(icon.style.height) || 80;
                const targetWidth = 73 * targetSizeMultipliers[index];
                const targetHeight = 80 * targetSizeMultipliers[index];
                const newWidth =
                    currentWidth + (targetWidth - currentWidth) * 0.4;
                const newHeight =
                    currentHeight + (targetHeight - currentHeight) * 0.4;
                icon.style.width = `${newWidth}px`;
                icon.style.height = `${newHeight}px`;
            });
            requestAnimationFrame(animateIcons);
        }

        animateIcons();

        dock.addEventListener("mouseleave", () => {
            appIcons.forEach((icon, index) => {
                targetSizeMultipliers[index] = 1;
            });
        });
    })
    .catch((error) => {
        console.error("Error fetching file:", error);
    });

// window things
let windows = document.querySelectorAll('.appwindow');
windows.forEach(window => {
    window.addEventListener('mousedown', (e) => {
        if (window.style.zIndex !== windows.length.toString()) {
            bringToFront(window);
        }
    });
    addDragFunctionality(window);
});

function bringToFront(selectedWindow) {
    const maxZIndex = windows.length;
    selectedWindow.style.backdropFilter = "blur(95px)";
    selectedWindow.style.backgroundColor = "rgba(50, 50, 50, 0.90)";

    windows.forEach(window => {
        if (window !== selectedWindow) {
            let currentZIndex = parseInt(window.style.zIndex);
            if (currentZIndex > 1) {
                window.style.zIndex = currentZIndex - 1;
                window.style.backdropFilter = "blur(0px)";
                window.style.backgroundColor = "rgba(50, 50, 50, 1)";
            }
        }
    });

    selectedWindow.style.zIndex = maxZIndex;
    const otherClass = (Array.from(selectedWindow.classList)).filter(cls => cls !== 'appwindow');
    if (otherClass.length > 0) {
        fetch(`/applications/${otherClass[0].toLowerCase()}/appmetadata.json`)
            .then((response) => response.json())
            .then((data) => {
                const keys = Object.keys(data.Menubar);
                console.log(keys.length > 0 ? keys[0] : null);
                macFocusedApp = keys.length > 0 ? keys[0] : null;
                createMacMenuBar();
            })
            .catch()
    }
}

function addDragFunctionality(resizable) {
    const handles = resizable.querySelectorAll('.handle');
    let startX, startY, startWidth, startHeight, startTop, startLeft;
    let cornerTarget = '';

    function handleMouseDown(e) {
        startX = e.clientX;
        startY = e.clientY;
        startWidth = resizable.offsetWidth;
        startHeight = resizable.offsetHeight;
        startTop = parseInt(window.getComputedStyle(resizable).getPropertyValue('top'));
        startLeft = parseInt(window.getComputedStyle(resizable).getPropertyValue('left'));
        cornerTarget = e.target.classList[1];

        let iframes = document.getElementsByTagName('iframe');
        Array.from(iframes).forEach(iframe => {
            iframe.style.pointerEvents = "none";
        });

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        let minHeight = parseInt(window.getComputedStyle(resizable).getPropertyValue('min-height'));
        let minWidth = parseInt(window.getComputedStyle(resizable).getPropertyValue('min-width'));

        switch (cornerTarget) {
            case 'top-left':
                if (startWidth - deltaX >= minWidth) {
                    resizable.style.width = startWidth - deltaX + 'px';
                    resizable.style.left = startLeft + deltaX + 'px';
                } else {
                    resizable.style.left = startLeft + (startWidth - minWidth) + 'px';
                    resizable.style.width = minWidth + 'px';
                }
                if (startHeight - deltaY >= minHeight) {
                    resizable.style.height = startHeight - deltaY + 'px';
                    resizable.style.top = startTop + deltaY + 'px';
                } else {
                    resizable.style.top = startTop + (startHeight - minHeight) + 'px';
                    resizable.style.height = minHeight + 'px';
                }
                break;
            case 'top-right':
                if (startWidth + deltaX >= minWidth) {
                    resizable.style.width = startWidth + deltaX + 'px';
                    resizable.style.left = startLeft + 'px';
                } else {
                    resizable.style.left = startLeft + 'px';
                    resizable.style.width = minWidth + 'px';
                }
                if (startHeight - deltaY >= minHeight) {
                    resizable.style.height = startHeight - deltaY + 'px';
                    resizable.style.top = startTop + deltaY + 'px';
                } else {
                    resizable.style.height = minHeight + 'px';
                    resizable.style.top = startTop + (startHeight - minHeight) + 'px';
                }
                break;
            case 'bottom-left':
                if (startWidth - deltaX >= minWidth) {
                    resizable.style.width = startWidth - deltaX + 'px';
                    resizable.style.left = startLeft + deltaX + 'px';
                } else {
                    resizable.style.width = minWidth + 'px';
                    resizable.style.left = startLeft + (startWidth - minWidth) + 'px';
                }
                if (startHeight + deltaY >= minHeight) {
                    resizable.style.height = startHeight + deltaY + 'px';
                } else {
                    resizable.style.height = minHeight + 'px';
                }
                break;
            case 'bottom-right':
                if (startWidth + deltaX >= minWidth) {
                    resizable.style.width = startWidth + deltaX + 'px';
                } else {
                    resizable.style.width = minWidth + 'px';
                }
                if (startHeight + deltaY >= minHeight) {
                    resizable.style.height = startHeight + deltaY + 'px';
                } else {
                    resizable.style.height = minHeight + 'px';
                }
                break;
        }
    }

    function handleMouseUp() {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        cornerTarget = '';

        let iframes = document.getElementsByTagName('iframe');
        Array.from(iframes).forEach(iframe => {
            iframe.style.pointerEvents = "all";
        });
    }

    handles.forEach(handle => {
        handle.addEventListener('mousedown', handleMouseDown);
    });

    let isDragging = false;
    let initialX, initialY, offsetX, offsetY;

    resizable.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", endDrag);

    function startDrag(e) {
        initialX = e.clientX - resizable.offsetLeft;
        initialY = e.clientY - resizable.offsetTop;
        if (initialY < 50) {
            isDragging = true;
            let iframes = document.getElementsByTagName('iframe');
            Array.from(iframes).forEach(iframe => {
                iframe.style.pointerEvents = "none";
            });
        }
    }

    function drag(e) {
        if (isDragging) {
            offsetX = e.clientX - initialX;
            offsetY = e.clientY - initialY;

            resizable.style.left = offsetX + "px";
            resizable.style.top = offsetY + "px";
        }
    }

    function endDrag() {
        isDragging = false;
        let iframes = document.getElementsByTagName('iframe');
        Array.from(iframes).forEach(iframe => {
            iframe.style.pointerEvents = "all";
        });
    }
}

//alert thing
function alert(app, title, body, proceedName, proceedFunction) {
    const alerthold = document.createElement('div');
    alerthold.classList.add('alerthold');
    const alert = document.createElement('div');
    alert.classList.add('alert');
    const appImage = document.createElement('img');
    appImage.classList.add('appicon');
    appImage.src = '/applications/' + app + '/app.png';
    alert.appendChild(appImage);
    const titlediv = document.createElement('div');
    titlediv.classList.add('title');
    titlediv.innerText = title;
    alert.appendChild(titlediv);
    const bodydiv = document.createElement('div');
    bodydiv.classList.add('body');
    bodydiv.innerText = body;
    alert.appendChild(bodydiv);
    const buttons = document.createElement('div');
    buttons.classList.add('buttons');
    const buttoncancel = document.createElement('div');
    buttoncancel.classList.add('button');
    buttoncancel.classList.add('highlight');
    buttoncancel.innerText = 'Cancel';
    buttoncancel.addEventListener('click', function () {
        alerthold.remove();
    })
    buttons.appendChild(buttoncancel);
    const buttonproceed = document.createElement('div');
    buttonproceed.classList.add('button');
    buttonproceed.innerText = proceedName;
    buttonproceed.addEventListener('click', function () {
        proceedFunction;
    })
    buttons.appendChild(buttonproceed);
    alert.appendChild(buttons);
    const askhold = document.createElement('div');
    askhold.classList.add('askhold');
    const check = document.createElement('div');
    check.classList.add('check');
    askhold.appendChild(check);
    const ask = document.createElement('div');
    ask.classList.add('ask');
    ask.innerText = 'Do not ask me again';
    askhold.appendChild(ask);
    alert.appendChild(askhold);
    alerthold.appendChild(alert);
    document.getElementById('body').appendChild(alerthold);
}