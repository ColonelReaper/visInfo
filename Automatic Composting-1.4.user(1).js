// ==UserScript==
// @name         Automatic Composting
// @version      1.4
// @description  Brew your pots without even looking at it!
// @author       Zuco
// @match        https://www.fallensword.com/index.php?cmd=composing
// @icon         https://cdn-icons-png.freepik.com/512/8331/8331206.png
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let selectedTemplate = null;
    let lastWithdrawAmount = null;
    let templateMenu;

    // Function to create the auto compose menu
    function createAutoComposeMenu(templates) {
        GM_addStyle(`
            #autoComposeMenu {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                background-color: white;
                padding: 10px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }

            #template-menu {
                margin-bottom: 10px;
            }

            #startStopButton {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }

            #startStopButton:hover {
                background-color: #45a049;
            }
        `);

        const menuContainer = document.createElement('div');
        menuContainer.id = 'autoComposeMenu';

        // Create a menu for template selection
        templateMenu = document.createElement('select');
        templateMenu.id = 'template-menu';

        // Add options to the menu by reading them from the provided templates
        templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.value;
            option.text = template.name;
            templateMenu.appendChild(option);
        });

        // Add event listener to the menu
        templateMenu.addEventListener('change', function() {
            selectedTemplate = {
                value: this.value,
                name: this.options[this.selectedIndex].text
            };
        });

        // If there's only one template, select it by default
        if (templates.length === 1) {
            selectedTemplate = {
                value: templates[0].value,
                name: templates[0].name
            };
        }

        menuContainer.appendChild(templateMenu);

        // Create Start/Stop button
        const startStopButton = document.createElement('button');
        startStopButton.textContent = 'Start';
        startStopButton.id = 'startStopButton';

        startStopButton.addEventListener('click', function() {
            isRunning = !isRunning;

            if (isRunning) {
                this.textContent = 'Stop';
                // Log the selected template for debugging
                console.log('Selected Template:', selectedTemplate);
                // Perform initial actions (withdraw, compose) here
                startAutoCompose();
            } else {
                this.textContent = 'Start';
                // Add any cleanup logic when stopping the script
            }
        });

        menuContainer.appendChild(startStopButton);

        document.body.appendChild(menuContainer);
    }

    function startAutoCompose() {
        if (selectedTemplate || (templateMenu.length === 1 && templateMenu.selectedIndex === 0)) {
            withdrawAndCompose();
        } else {
            alert('Select a template before starting!');
            isRunning = false; // Reset the running state
            document.getElementById('startStopButton').textContent = 'Start';
        }
    }

    function withdrawAndCompose() {
        const withdrawAmount = lastWithdrawAmount !== null ? lastWithdrawAmount : prompt('Enter the amount to withdraw:');
        lastWithdrawAmount = withdrawAmount;
        const withdrawLink = `https://www.fallensword.com/index.php?cmd=bank&subcmd=transaction&mode=withdraw&amount=${withdrawAmount}&no_mobile=1`;

        // Perform the fetch to withdraw gold
        fetch(withdrawLink)
            .then(response => response.text())
            .then(data => {
            // Check for success and proceed with composing
            console.log('Gold withdrawn successfully!');
            compose(selectedTemplate.value);
        })
            .catch(error => console.error('Error withdrawing gold:', error));
    }

    let initialCheckCompleted = false;
    let isComposingDone = false;

    function compose(templateId) {
        const composeLink = `https://www.fallensword.com/index.php?cmd=composing&subcmd=createajax&template_id=${templateId}&multi=1`;

        // Perform the fetch to start composing
        fetch(composeLink)
            .then(response => response.text())
            .then(data => {
            // Log the full response data
            console.log('Composing...');

            // Set the initial check time when composing starts
            initialCheckCompleted = false;
            isComposingDone = false;

            // Check for completion after composing is started
            checkCompletion();
        })
            .catch(error => console.error('Error composing:', error));
    }

    function checkCompletion() {
        // Fetch the composing page
        fetch('https://www.fallensword.com/index.php?cmd=composing')
            .then(response => response.text())
            .then(data => {
            // Check for the state of the "Discard All" button in the fetched page
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const discardAllButton = doc.querySelector('input[value="Discard All"]');
            console.log("Verifying...");

            if (discardAllButton && discardAllButton.disabled === false) {
                // Button found and clickable, composing is done
                console.log("Composing is over, restarting process.");
                discardAll(); // Discard all potions after composing
                startAutoCompose(); // Repeat the process
                isComposingDone = true;
            } else {
                // If the initial check is not completed, set the flag
                if (!initialCheckCompleted) {
                    initialCheckCompleted = true;
                    setTimeout(checkCompletion, 60*60*1000);
                } else if (!isComposingDone) {
                    // If the initial check is completed and composing is done, schedule subsequent checks every 1 minute
                    setTimeout(checkCompletion, 60000);
                }
            }
        })
            .catch(error => console.error('Error fetching composing page:', error));
    }

    function discardAll() {
        const discardLink = 'https://www.fallensword.com/index.php?cmd=composing&subcmd=discardall';

        // Perform the fetch to discard all potions
        fetch(discardLink)
            .then(response => response.text())
            .then(data => {
            // Check for success and log the result
            console.log('All potions discarded.');
        })
            .catch(error => console.error('Error discarding potions:', error));
    }

    // Function to extract template data from the existing dropdown
    function extractTemplates() {
        const selectElement = document.getElementById('composing-template-multi');
        const templates = [];

        if (selectElement) {
            for (let i = 0; i < selectElement.options.length; i++) {
                const option = selectElement.options[i];
                templates.push({
                    value: option.value,
                    name: option.text
                });
            }
            return templates;
        } else {
            return null;
        }
    }

    // Use MutationObserver to detect when the dropdown is added to the DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            const templates = extractTemplates();
            if (templates) {
                observer.disconnect(); // Stop observing once the dropdown is found
                createAutoComposeMenu(templates);
            }
        });
    });

    // Start observing changes to the DOM with a timeout of 5 seconds
    setTimeout(() => {
        observer.disconnect(); // Stop observing if timeout is reached
        console.error('Error: Unable to find the template dropdown element or already loaded within the timeout.');
    }, 5000);

    observer.observe(document.body, { childList: true, subtree: true });
})();
