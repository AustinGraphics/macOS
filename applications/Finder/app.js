(function () {
    const appwindow = document.querySelector('.appwindow:last-child');

    var directoryHistory = [];

    // Mapping of item names to their corresponding icon paths
    var iconMapping = {
        "AirDrop": "./applications/Finder/icon.airdrop.svg",
        "Recents": "./applications/Finder/icon.recents.svg",
        "Applications": "./applications/Finder/icon.applications.svg",
        "Desktop": "./applications/Finder/icon.desktop.svg",
        "Documents": "./applications/Finder/icon.documents.svg",
        "Downloads": "./applications/Finder/icon.downloads.svg",
        "iCloud Drive": "./applications/Finder/icon.icloud.svg",
        "MacOS Github": "./applications/Finder/icon.github.svg",
        "Red": "./applications/Finder/icon.redtag.svg",
        "Orange": "./applications/Finder/icon.orangetag.svg",
        "Yellow": "./applications/Finder/icon.yellowtag.svg",
        "Green": "./applications/Finder/icon.greentag.svg",
        "Blue": "./applications/Finder/icon.bluetag.svg",
        "Purple": "./applications/Finder/icon.purpletag.svg",
        "Grey": "./applications/Finder/icon.greytag.svg"
    };

    var defaultIcon = "./applications/Finder/preview.folder.png";
    var unknownIcon = "./applications/Finder/preview.unknown.png";

    // Mapping of file extensions to their corresponding icon paths
    var fileIconMapping = {
        '.txt': './applications/Finder/preview.text.png',
        '.html': './applications/Finder/preview.text.png',
        '.css': './applications/Finder/preview.text.png',
        '.js': './applications/Finder/preview.text.png',
        '.json': './applications/Finder/preview.text.png',
        '.ttf': './applications/Finder/preview.ttf.png',
        '.otf': './applications/Finder/preview.otf.png',
        '.png': './applications/Finder/preview.png.png',
        '.svg': './applications/Finder/preview.svg.png',
        '.ico': './applications/Finder/preview.ico.png'
    };

    // Mapping of specific files in specific directories to their corresponding icon paths
    var specificFileIcons = {
        'http://127.0.0.1:5500/MacOS/Applications': './applications/Finder/preview.appstorefolder.png',
        'http://127.0.0.1:5500/MacOS/Desktop': './applications/Finder/preview.desktop.png',
        'http://127.0.0.1:5500/MacOS/Downloads': './applications/Finder/preview.downloads.png',
        'http://127.0.0.1:5500/MacOS/Documents': './applications/Finder/preview.documents.png'
        // Add more specific file icons here as needed
    };

    var directoryRedirect = {
        'http://127.0.0.1:5500/MacOS/Applications': 'http://127.0.0.1:5500/applications'
    };

    // Function to get the icon based on file extension and specific directory
    function getFileIcon(name, directory) {
        const specificPath = `${directory}/${name}`;
        if (specificFileIcons[specificPath]) {
            return specificFileIcons[specificPath];
        }

        const extension = Object.keys(fileIconMapping).find(ext => name.endsWith(ext));
        const fileExtensionPattern = /\.[0-9a-z]+$/i;
        return fileIconMapping[extension] || (!fileExtensionPattern.test(name) ? defaultIcon : unknownIcon);
    }

    function getRedirectedDirectory(directory) {
        if (directoryRedirect.hasOwnProperty(directory)) {
            console.log(`Redirecting ${directory} to ${directoryRedirect[directory]}`);
            return directoryRedirect[directory];
        } else {
            console.log(`No redirection for ${directory}`);
            return directory;
        }
    }

    // Fetch and render sidebar
    fetch('./applications/Finder/sidebar.json')
        .then(response => response.json())
        .then(data => renderSidebar(data))
        .catch(error => console.error('Error loading sidebar data:', error));

    function renderSidebar(data) {
        const treeview = appwindow.querySelector('.treeview');
        for (const category in data) {
            const navtree = document.createElement('div');
            navtree.className = 'navtree';
            navtree.innerHTML = `<div class="title">${category}</div>`;

            data[category].forEach(item => {
                const itemName = typeof item === 'string' ? item : item.Folder;
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';
                itemDiv.innerHTML = `
                <img class="itemicon" src="${iconMapping[itemName] || './applications/Finder/icon.folder.svg'}" />
                <div class="itemtext">${itemName}</div>
            `;
                itemDiv.addEventListener('click', () => fetchDirectoryContents(itemName));
                navtree.appendChild(itemDiv);
            });

            treeview.appendChild(navtree);
        }

        // Set Downloads as the default view
        fetchDirectoryContents('Downloads');
    }

    function fetchDirectoryContents(directory) {
        if (directory == 'MacOS Github') {
            directory = 'http://127.0.0.1:5500';
        } else if (!directory.includes('http://127.0.0.1:5500')) {
            directory = 'http://127.0.0.1:5500/MacOS/' + directory.replace(' ', '%20');
        }
        if (directoryHistory.length === 0 || directoryHistory[directoryHistory.length - 1] !== (directory === 'http://127.0.0.1:5500' ? '/MacOS Github' : directory.replace('http://127.0.0.1:5500', ''))) {
            directoryHistory.push(directory === 'http://127.0.0.1:5500' ? '/MacOS Github' : directory.replace('http://127.0.0.1:5500', ''));
        }

        // Apply redirection
        var realDirectory = directory;
        directory = getRedirectedDirectory(directory);

        fetch(directory.replace(' ', '%20'))
            .then(response => response.text())
            .then(contents => renderDirectoryContents(contents, directory.replace(' ', '%20'), realDirectory))
            .catch(error => console.error('Error fetching item contents:', error));

        if (directory == 'http://127.0.0.1:5500') {
            appwindow.querySelector('.appwindow.finder .topbar .text').textContent = 'MacOS Github';
        } else {
            const path = realDirectory.replace('%20', ' ');
            const endingDirectory = path.substring(path.lastIndexOf('/') + 1);
            appwindow.querySelector('.appwindow.finder .topbar .text').textContent = endingDirectory.replace('_', ' ');
        }
    }

    function renderDirectoryContents(contents, itemDirectory, realDirectory) {
        const body = appwindow.querySelector('.appwindow.finder .body');
        body.innerHTML = ''; // Clear existing contents
        const parser = new DOMParser();
        const doc = parser.parseFromString(contents, 'text/html');
        const items = Array.from(doc.querySelectorAll('#files .name'))
            .map(item => item.textContent.trim())
            .filter(name => name !== '..'); // Ignore the '..' entry

        console.log(itemDirectory);
        console.log(realDirectory);
        items.forEach(name => {
            var cancel = false;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            if (realDirectory == 'http://127.0.0.1:5500/MacOS/Applications' && itemDirectory == 'http://127.0.0.1:5500/applications') {
                itemDiv.innerHTML = `
            <img class="preview" src="./applications/${name.replace(' ', '%20')}/app.png" />
            <div class="name">${name.replace('_', ' ')}</div>
            `;
                if (name == 'Launchpad') {
                    cancel = true;
                }
            } else {
                itemDiv.innerHTML = `
            <img class="preview" src="${getFileIcon(name, itemDirectory)}" />
            <div class="name">${name}</div>
            `;
            }
            const fileExtensionPattern = /\.[0-9a-z]+$/i;

            if (!fileExtensionPattern.test(name)) {
                itemDiv.addEventListener('click', () => fetchDirectoryContents(itemDirectory + '/' + name));
            }
            if (cancel == false) {
                body.appendChild(itemDiv);
            }
        });

        console.log('Fetched from ' + itemDirectory + ' :', items);
    }

})();