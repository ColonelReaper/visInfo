// ==UserScript==
// @name         Automatic Composting
// @version      2.8
// @description  Brew your pots without even looking at it!
// @author       Zuco
// @match        https://www.fallensword.com/index.php?cmd=composing*
// @icon         https://cdn-icons-png.freepik.com/512/8331/8331206.png
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let selectedTemplate = null;
    let lastWithdrawAmount = null;
    let templateMenu;
    let goldCost = 0;
    let withdrawAmount = 0;
    let initialCheckCompleted = false;
    let isComposingDone = false;
    let menuCreated = false; // Variable to track whether the menu has been created

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
    async function retryAjax(options, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const url = new URL(options.url, window.location.href);

                if (options.method === 'GET' && options.data) {
                    url.search = new URLSearchParams(options.data).toString();
                }

                const response = await fetch(url, {
                    method: options.method || 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return await response.text();
            } catch (error) {
                console.error(`Error in AJAX attempt ${attempt}:`, error);
                // Add any additional error handling or retries as needed
                if (attempt === retries) {
                    throw new Error('Max retries reached. Unable to complete AJAX request.');
                }
            }
        }
    }

    // Mock of the jsonParse function
    function jsonParse(str, reviver) {
        try {
            return JSON.parse(str, reviver);
        } catch (e) {
            // Ignore bad json
        }
    }
    // Mock of the getApp function
    async function getApp(data) {
        return retryAjax({
            url: 'app.php',
            data: { browser: 1, v: 9, ...data },
            dataType: 'text',
            method: 'GET',
        });
    }

    // Mock of the composing function
    function composing(data) {
        return getApp({ cmd: 'composing', ...data });
    }

    // Mock of the view function
    function view() {
        return composing({ subcmd: 'view' });
    }

    async function fetchGoldCost(templateId) {
        try {
            let composingData = await view(); // Wait for the composingData to be fetched

            // Log the raw composingData for debugging
            //console.log('Raw Composing Data:', composingData);

            try {
                composingData = JSON.parse(composingData);
            } catch (jsonError) {
                // Log the JSON parse error for debugging
                console.error('Error parsing JSON response:', jsonError);
                throw new Error('Invalid JSON response.'); // Throw a new error to propagate the issue
            }

            // Log the parsed composingData for debugging
            //console.log('Parsed Composing Data:', composingData);

            // Check if the response structure is as expected
            if (!composingData || !composingData.r || !composingData.r.templates || composingData.r.templates.length === 0 || !composingData.r.templates[0].buffs) {
                console.error('Invalid composing data received:', composingData);
                throw new Error('Invalid composing data received.');
            }

            // Extract the templates array from the composing data
            const templatesArray = composingData.r.templates;

            // Log the templates array for debugging
            //console.log('Templates Array:', templatesArray);

            // Extract the selected template from the templates array
            const selectedTemplate = templatesArray.find(template => template.id == templateId);

            // Log the selected template for debugging
            //console.log('Selected Template ID:', templateId);
            //console.log('Selected Template:', selectedTemplate);

            // Check if the selected template structure is as expected
            if (!selectedTemplate || !selectedTemplate.buffs) {
                console.error('Invalid selected template data:', selectedTemplate);
                throw new Error('Invalid selected template data.');
            }

            // Calculate the gold cost based on buffs and duration of the selected template
            const buffsCost = selectedTemplate.buffs.reduce((totalCost, buff) => totalCost + buff.level, 0);
            return Math.max(buffsCost * selectedTemplate.duration, 5000);
        } catch (error) {
            console.error('Error fetching gold cost:', error);
            throw new Error('Error fetching gold cost.');
        }
    }
    async function getNumberOfPotions() {
        try {
            // Fetch the HTML page to ensure you have the latest content
            const response = await fetch(window.location.href);

            if (!response.ok) {
                console.error('Error fetching page:', response.status);
                return 0;
            }

            // Obtain the HTML content from the response
            const html = await response.text();

            // Get the create button element directly
            const createButton = document.getElementById('create-multi');

            // Extract the number from the button value
            const match = createButton.value.match(/\d+/);

            // Check if a number is found
            if (match) {
                return parseInt(match[0], 10);
            } else {
                console.error('Number not found in button value');
                return 0; // Return 0 if the number is not found
            }
        } catch (error) {
            console.error('Error fetching or processing page:', error);
            return 0; // Return 0 in case of an error
        }
    }

    // Function to start the auto composing process
    function startAutoCompose() {
        // Fetch the gold cost dynamically based on the selected template
        if (selectedTemplate || (templateMenu.length === 1 && templateMenu.selectedIndex === 0)) {
            fetchGoldCost(selectedTemplate.value)
                .then(cost => {
                goldCost = cost;
                // Log the gold cost for debugging
                console.log('Gold Cost:', goldCost);

                // Continue with the rest of the auto composing logic
                // Withdraw gold and then compose template
                withdrawAndCompose(goldCost);
            })
                .catch(error => {
                console.error('Error fetching gold cost:', error);
                // Handle error if needed
            });
        } else {
            alert('Select a template before starting!');
            isRunning = false; // Reset the running state
            document.getElementById('startStopButton').textContent = 'Start';
        }
    }

    async function withdrawAndCompose(goldCost) {
        const numberOfPotions = await getNumberOfPotions();
        console.log('Number of Potions:', numberOfPotions);
        withdrawAmount = goldCost * numberOfPotions;
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

    async function checkCompletion() {
        try {
            // Fetch the composing page
            const response = await fetch('https://www.fallensword.com/index.php?cmd=composing');
            const data = await response.text();

            // Check for the state of the "Discard All" button in the fetched page
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const discardAllButton = doc.querySelector('input[value="Discard All"]');

            if (discardAllButton && discardAllButton.disabled === false) {
                // Button found and clickable, composing is done
                console.log("Composing is over, restarting process.");
                await discardAll(); // Discard all potions after composing
                withdrawAndCompose(); // Repeat the process
                isComposingDone = true;
            } else {
                // If the initial check is not completed, set the flag
                if (!initialCheckCompleted) {
                    initialCheckCompleted = true;
                    setTimeout(checkCompletion, 60*60*1000);
                } else if (!isComposingDone) {
                    // If the initial check is completed and composing is done, schedule subsequent checks every 1 minute
                    console.log("Verifying...");
                    setTimeout(checkCompletion, 60000);
                }
            }
        } catch (error) {
            console.error('Error fetching or processing composing page:', error);
        }
    }

    async function discardAll() {
        try {
            const discardLink = 'https://www.fallensword.com/index.php?cmd=composing&subcmd=discardall';

            // Perform the fetch to discard all potions
            const response = await fetch(discardLink);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.text();

            // Check for success and log the result
            console.log('All potions discarded.');
        } catch (error) {
            console.error('Error discarding potions:', error);
            throw error; // Re-throw the error to propagate it
        }
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
            // Check if the menu has already been created
            if (!menuCreated) {
                const templates = extractTemplates();
                if (templates) {
                    observer.disconnect(); // Stop observing once the dropdown is found
                    createAutoComposeMenu(templates);
                    menuCreated = true; // Set the flag to true
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
