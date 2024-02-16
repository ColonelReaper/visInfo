// ==UserScript==
// @name         News
// @version      5.9
// @description  but I'm not done yet!
// @match        https://www.fallensword.com/index.php?cmd=points&subcmd=redeem
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

const bountyWebhook = "https://discord.com/api/webhooks/1111675211968950363/xwT5Ju0nkGSRfTkaUwl_AkNTKry5kAuUYyxLuvDmfGbemT5gdjLrdJ49piOA4wluvBO0";
const titanWebhook = "https://discord.com/api/webhooks/1111675919829045289/Y6WgHBE8imPTK8eLuoZNyYxz5JhuNS4uAStV2DiEIWuvfRlDUP6gg_le0CAL-yXVgoeH";
const ladderWebhook = "https://discord.com/api/webhooks/1111676083587260418/d_DD4FuHLW-TXSUiqxmV00zYxrd7JlNO_SlF39YeA_52gRonS58TVC-aoCoduT_3xY2h";
const SuperEliteWebhook = "https://discord.com/api/webhooks/1125465684906868886/RXLdFdW0ZGKH7c9Ku8u7-oiiTRC4RHpUWcAUUs-bMtHoDMzqyKzHXow133ymEXytOwXx";
const cratesWebhook = "https://discord.com/api/webhooks/1142943755259875389/pxspjNuDAWD-xJNJPxX4KhYZMHmC2S_Lxm5koGDQh3wjfpR792BBfBw3eTyGSXxRfYfa";
const newsWebhook = "https://discord.com/api/webhooks/1142972994478686279/16H0SeTON7va5l6REkzpnTs-jpkebT-rqIJbXYEKV1Bt_J-HiQHeSH7KY66DIRAhtB6L";
const shoutboxWebhook = "https://discord.com/api/webhooks/1142973656302092358/qp-pFvUFWp9ErLl9PW8h3sktFREZUn2PvdqHNbluUEVHCPVsXBjhF87Wn_-DWhU54PbP";
const SEgroup = `<@&1142926613009408000>`;
const BountyGroup = `<@&1111676687340548216>`;
const TitanGroup = `<@&1111676811982667776>`;
const LadderGroup = `<@&1111676962067456091>`;

(function() {
    'use strict';

    // Função para adicionar uma nova linha ao "arquivo"
    function getContent(where) {
        return GM_getValue(where, "");
    }

    function setContent(where, content){
        GM_setValue(where, content);
    }

    function showContent(where){
        console.log(getContent(where))
    }

    function addLine(newLine, where) {
        // Recupera o conteúdo atual do "arquivo"
        let conteudo = getContent(where);
        let linhas = conteudo.split("\n");
        linhas.push(newLine);
        if (linhas.length > 20) {
            linhas.shift();
        }
        conteudo = linhas.join("\n");
        setContent(where, conteudo);
    }

    // Função para ler o conteúdo do "arquivo"

    function checkInfo(line, where) {
    // Recupera o conteúdo atual do "arquivo"
        let conteudo = getContent(where);
        let linhas = conteudo.split("\n");
        return linhas.includes(line);
    }
    // Exemplo de uso:
    //addLine("Linha 2");

    function sendDiscordMessage(message, wTitle, colorCode, footerText, group, webhook) {
        //console.log('Enviando mensagem para o Discord:', message);
        const embed = {
            title: wTitle,
            description: message,
            color: colorCode,
            footer: {
                text: footerText
            }
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: webhook,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                content: group,
                embeds: [embed]
            }),/*
            onload: function(response) {
            console.log('Resposta do Discord:', response.responseText);
        }*/
        });
    }

    function sendSimpleMessage(message, webhook){
        GM_xmlhttpRequest({
            method: "POST",
            url: webhook,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                content: message
            }),
        });
    }
function sendExtraDiscordMessage(message, wTitle, colorCode, footerText, group, webhook, thumbUrl, thumb) {
        //console.log('Enviando mensagem para o Discord:', message);
        const embed = {
            title: wTitle,
            description: message,
            image: {
                url: thumbUrl
            },
            thumbnail: {
                url: thumb
            },
            color: colorCode,
            footer: {
                text: footerText
            }
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: webhook,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                content: group,
                embeds: [embed]
            }),
            /*onload: function(response) {
            console.log('Resposta do Discord:', response.responseText);
        }*/
        });
    }

    function sendExtraDiscordMessageNODROP(message, wTitle, colorCode, footerText, group, webhook, thumbUrl) {
        //console.log('Enviando mensagem para o Discord:', message);
        const embed = {
            title: wTitle,
            description: message,
            image: {
                url: thumbUrl
            },
            color: colorCode,
            footer: {
                text: footerText
            }
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: webhook,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                content: group,
                embeds: [embed]
            }),
            /*onload: function(response) {
            console.log('Resposta do Discord:', response.responseText);
        }*/
        });
    }

    // Define o atraso entre as mensagens em milissegundos
const DELAY_BETWEEN_MESSAGES = 1500; // 3 segundos

// Modifica a função sendExtraDiscordMessage para adicionar um atraso entre as chamadas
function sendExtraDiscordMessageWithDelay(message, wTitle, colorCode, footerText, group, webhook, thumbUrl, thumb) {
  // Agenda a chamada para a função sendExtraDiscordMessage com um atraso
  setTimeout(() => {
    sendExtraDiscordMessage(message, wTitle, colorCode, footerText, group, webhook, thumbUrl, thumb);
  }, DELAY_BETWEEN_MESSAGES);

}

function sendExtraDiscordMessageWithDelayNODROP(message, wTitle, colorCode, footerText, group, webhook, thumbUrl) {
  // Agenda a chamada para a função sendExtraDiscordMessage com um atraso
  setTimeout(() => {
    sendExtraDiscordMessageNODROP(message, wTitle, colorCode, footerText, group, webhook, thumbUrl);
  }, DELAY_BETWEEN_MESSAGES);
}
    async function getGoldInHand(targetLink) {
        let completeLink = 'https://www.fallensword.com/' + targetLink;
        let response = await fetch(completeLink);
        let text = await response.text();
        let tempElement = document.createElement('div');
        tempElement.innerHTML = text;
        let goldInHandElement = tempElement.querySelector('#stat-gold');
        if (goldInHandElement) {
            return goldInHandElement.textContent;
        } else {
            // O elemento goldInHandElement não foi encontrado
            // Aqui você pode adicionar código para lidar com esse caso
            return null;
        }
    }

        async function getBuffs(targetLink) {
        let completeLink = 'https://www.fallensword.com/' + targetLink;
        let response = await fetch(completeLink);
        let text = await response.text();
        let tempElement = document.createElement('div');
        tempElement.innerHTML = text;
        let isCloaked = false;
        let hasDeflect = false;
        let buffs = tempElement.querySelector('#profileRightColumn > div:nth-child(14) > table > tbody > tr:nth-child(1)');
        let buffAmount = buffs.length;

        let buffNameAndLevel = [];
        let trs = tempElement.querySelectorAll('#profileRightColumn > div:nth-child(14) > table > tbody > tr');
        trs.forEach(tr => {
            let tds = tr.querySelectorAll('td');
            tds.forEach(td => {
                let img = td.querySelector('img');
                if (img) {
                    let tipped = img.getAttribute('data-tipped');
                    let span = document.createElement('div');
                    span.innerHTML = tipped;
                    let buffName = span.querySelector('span > b').textContent;
                    let level = span.querySelector('span').textContent.split('Level: ')[1].split(')')[0];
                    buffNameAndLevel.push({name: buffName, level: level});
                }
            });
        });

        buffNameAndLevel.forEach(buff => {
            if (buff.name === 'Deflect') {
                hasDeflect = true;
            }
            if (buff.name === 'Cloak') {
                isCloaked = true;
            }
        });

        return {hasDeflect: hasDeflect, isCloaked: isCloaked, numberOfBuffs: buffNameAndLevel.length};
    }

    async function checkForNewBounty() {
        // Obtém o conteúdo da página da web
        let response = await fetch('https://www.fallensword.com/index.php?cmd=bounty');
        let text = await response.text();
        let tempElement = document.createElement('div');
        tempElement.innerHTML = text;
        let bountyTable = tempElement.querySelector('table tbody tr:nth-of-type(12)');
        if (bountyTable) {
            // Extrai o ID de cada recompensa da tabela
            let acceptButtons = bountyTable.querySelectorAll('input[value="Accept"]');
            for (let button of acceptButtons) {
                let onclick = button.getAttribute('onclick');
                let id = onclick.split('&bounty_id=')[1].split(';')[0];

                // Verifica se o ID da bounty já está armazenado em cache usando a função checkInfo
                if (!checkInfo(id, 'bountyData')) {
                    // Adiciona o ID da bounty ao cache usando a função addLine
                    addLine(id, 'bountyData');

                    // Obtém as informações da bounty
                    let bountyRow = button.closest('tr');
                    let bountyDetails = bountyRow.querySelectorAll('td');
                    let target = bountyDetails[0].querySelector('a').textContent;
                    let targetLevel = bountyDetails[0].textContent.split(target)[1];
                    let offerer = bountyDetails[1].querySelector('a').textContent;
                    let rewardTable = bountyDetails[2].querySelector('table tbody tr');
                    let rewardDetails = rewardTable.querySelectorAll('td');
                    let reward = rewardDetails[0].querySelector('font').textContent;
                    let currencyImgSrc = rewardDetails[1].querySelector('img').getAttribute('src');

                    // Obtém o valor de goldInHand usando a função getGoldInHand
                    let targetLink = bountyDetails[0].querySelector('a').getAttribute('href');
                    let goldInHand = await getGoldInHand(targetLink);
                    let buffs = await getBuffs(targetLink);

                    sendExtraDiscordMessage(`
:hammer: Target: ${target} ${targetLevel}
:scales: Offerer: ${offerer}
:moneybag: Reward: ${reward}
:money_with_wings: Gold in hand: ${goldInHand}
:shield: Deflect ? ${buffs.hasDeflect}
:mage: Cloaked ? ${buffs.isCloaked}
:crystal_ball: Buffs Number: ${buffs.numberOfBuffs}
`, "Bounty Board", "16711680", "Gotta Smash'em all!", BountyGroup, bountyWebhook, "",currencyImgSrc);
                }
            }
        }
    }


    // Function to check for Titan notifications
    function checkForTitanNotifications() {
        fetch('https://www.fallensword.com/index.php?cmd=&subcmd=viewarchive')
            .then(response => response.text())
            .then(text => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const rows = doc.querySelectorAll('table > tbody > tr:nth-child(5) > td > table > tbody > tr');
            rows.forEach(row => {
                const cell = row.querySelector('td:nth-child(2)');
                if (cell) {
                    const cellData = cell.textContent;
                    if (cellData.includes('Titan Spotted!')) {
                        const titanInfo = row.nextElementSibling.nextElementSibling.querySelector('td').textContent;
                        const titanTime = row.querySelector('.NEWS_DATE').textContent;
                        let line = `${titanInfo} ${titanTime}`
                        if (!checkInfo(line, "titanData")) {
                            addLine(line, "titanData");
                            //console.log(titanInfo,'and', titanTime);
                            sendDiscordMessage(`
New Titan Spotted:
${titanInfo}
${titanTime}
`, "Titan Spawn", "21247", "Don't forget TP and TD!", TitanGroup, titanWebhook);
                        }
                    }
                }
            });
        });
    }

    // Function to check for PvP notifications
    function checkForPvPNotifications() {
        fetch('https://www.fallensword.com/index.php?cmd=&subcmd=viewarchive')
        .then(response => response.text())
        .then(text => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const rows = doc.querySelectorAll('table > tbody > tr:nth-child(5) > td > table > tbody > tr');
        rows.forEach(row => {
            const cell = row.querySelector('td:nth-child(2)');
            if (cell) {
               const cellData = cell.textContent;
               if (cellData.includes('PvP Ladder')) {
                   const ladderInfo = row.nextElementSibling.nextElementSibling.querySelector('td').textContent;
                   const ladderTime = row.querySelector('.NEWS_DATE').textContent;
                   let line = `${ladderInfo} ${ladderTime}`
                   if (!checkInfo(line, "ladderData")){
                       addLine(line, "ladderData");
                       //console.log(ladderInfo, 'and', ladderTime);
                       sendDiscordMessage(`
${ladderInfo}
${ladderTime}
`, "Ladder Reset", "15466240", "Dominating!", LadderGroup, ladderWebhook);
                   }
                 }
                }
            });
        });
    }
function checkForSuperEliteKills() {
  // Obtém o conteúdo da página da web
  fetch('https://www.fallensword.com/index.php?cmd=superelite')
    .then(response => response.text())
    .then(text => {
      // Analisa o conteúdo da página da web
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // Obtém o elemento div com id "pCC"
      const pCC = doc.querySelector('#pCC');

      // Obtém todos os elementos tr dentro do div
      const trs = pCC.querySelectorAll('table > tbody > tr:nth-child(6) > td > table > tbody > tr');

      // Percorre os elementos tr de 2 em 2
      for (let i = 1; i < trs.length; i += 2) {
        const tr = trs[i];

        // Obtém os elementos td dentro do tr
        const tds = tr.querySelectorAll('td');

        // Verifica se existem elementos td suficientes
        if (tds.length >= 4) {
          // Extrai as informações dos elementos td
          const killInfo = {
            dateTime: (() => {
                // Obtém o elemento td que contém a data e a hora
                const td = tds[0];

                // Cria uma cópia do elemento td
                const tdCopy = td.cloneNode(true);

                // Substitui a tag br por um caractere de espaço
                const br = tdCopy.querySelector('br');
                br.parentNode.replaceChild(document.createTextNode(' '), br);

                // Extrai o conteúdo de texto do elemento td
                return tdCopy.textContent.trim();
            })(),
            superElite: {
              image: tds[1].querySelector('img').src,
              name: tds[1].querySelector('center').textContent.trim()
            },
            player: {
              name: tds[2].querySelector('a').textContent.trim(),
              location: tds[2].childNodes[2].textContent.trim()
            },
            drop: tds[3].textContent.includes('[no drop]') ? '[no drop]' : tds[3].querySelector('img').src
          };
          let line = `${killInfo.dateTime} ${killInfo.location}`
          // Verifica se as informações já foram enviadas anteriormente
          if (!checkInfo(line, "SEdata")) {
            // Armazena as informações em cache usando o GM
            addLine(line, "SEdata");
        // Envia as informações para o Discord
              // Verifica se killInfo.drop é um link válido
if (killInfo.drop.startsWith('http://') || killInfo.drop.startsWith('https://')) {
  // killInfo.drop é um link válido, então pode ser usado como um link para uma imagem
  sendExtraDiscordMessageWithDelay(`
${killInfo.dateTime}
${killInfo.superElite.name}
${killInfo.player.name}
${killInfo.player.location}
`, "Super Elite", "15466240", "It Dropped!", "", SuperEliteWebhook, killInfo.superElite.image, killInfo.drop);
} else {
  // killInfo.drop não é um link válido, então deve ser omitido ou substituído por um valor padrão
  sendExtraDiscordMessageWithDelayNODROP(`
${killInfo.dateTime}
${killInfo.superElite.name}
${killInfo.player.name}
${killInfo.player.location}
`, "Super Elite", "15466240", killInfo.drop, "", SuperEliteWebhook, killInfo.superElite.image);
}

          }
        }
      }
    });
}
    function checkForCratesFound() {
  // Obtém o conteúdo da página da web
  fetch('https://www.fallensword.com/index.php?cmd=crates')
    .then(response => response.text())
    .then(text => {
      // Analisa o conteúdo da página da web
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // Obtém o elemento div com id "pCC"
      const pCC = doc.querySelector('#pCC');

      // Obtém todos os elementos tr dentro do div
      const trs = pCC.querySelectorAll('table > tbody > tr:nth-child(6) > td > table > tbody > tr');

      // Percorre os elementos tr de 2 em 2
      for (let i = 1; i < trs.length; i += 2) {
        const tr = trs[i];

        // Obtém os elementos td dentro do tr
        const tds = tr.querySelectorAll('td');

        // Verifica se existem elementos td suficientes
        if (tds.length >= 4) {
          // Extrai as informações dos elementos td
          const crateInfo = {
            dateTime: tds[0].textContent.trim(),
            crateName: {
              name: tds[1].querySelector('center').textContent.trim()
            },
            player: {
              name: tds[2].querySelector('a').textContent.trim(),
              location: tds[2].childNodes[2].textContent.trim()
            },
            drop: tds[3].querySelector('img').src
          };
          let line = `${crateInfo.dateTime} ${crateInfo.location}`
          // Verifica se as informações já foram enviadas anteriormente
          if (!checkInfo(line, "crateData")) {
            // Armazena as informações em cache usando o GM
            addLine(line, "crateData");
  sendExtraDiscordMessageWithDelay(`
${crateInfo.dateTime}
${crateInfo.crateName.name}
${crateInfo.player.name}
${crateInfo.player.location}
`, "New Chest", "15466240", "Chest Found!", "", cratesWebhook, "", crateInfo.drop);

          }
        }
      }
    });
}
    function checkForUpdatesArchive(){
        fetch('https://www.fallensword.com/index.php?cmd=&subcmd=viewupdatearchive')
            .then(response => response.text())
            .then(text => {
            let tempElement = document.createElement('div');
            tempElement.innerHTML = text;
            let messageTable = tempElement.querySelector('#pCC table tbody tr:nth-of-type(5) td table tbody');
            if (messageTable) {
                let firstTr = messageTable.querySelector('tr:first-of-type');
                let thirdTr = messageTable.querySelector('tr:nth-of-type(3)');
                if (firstTr && thirdTr) {
                    let titleTd = firstTr.querySelector('td:nth-of-type(2)');
                    let title = titleTd.querySelector('span.NEWS_SUBJECT nobr').textContent;
                    let date = titleTd.querySelector('span.NEWS_DATE').textContent;
                    let messageTd = thirdTr.querySelector('td');
                    let message = messageTd.innerHTML
                    .replace(/<br>/g, '\n')
                    .replace(/<[^>]+>/g, '');
                    let imgElements = messageTd.querySelectorAll('img');
                    let aElements = messageTd.querySelectorAll('a');

                    // Armazena as informações nas variáveis ​​separadas
                    let messageTitle = title;
                    let messageDate = date;
                    let messageContent = message;
                    let imgSrcs = Array.from(imgElements).map(img => img.getAttribute('src'));
                    let aHrefs = Array.from(aElements).map(a => a.getAttribute('href'));

                    // Verifica se a data e o título da mensagem já estão armazenados em cache
                    let line = `${messageDate} ${messageTitle}`
                    if (!checkInfo(line, 'updatesData')) {
                        // Adiciona a data e o título da mensagem ao cache
                        addLine(line, 'updatesData');

                        // Formata a mensagem e envia ao Discord
                        let discordMessage = `
:envelope_with_arrow: Title: ${messageTitle}
:calendar: Date: ${messageDate}
:page_facing_up: Message: ${messageContent}
`;

                        if (imgSrcs.length > 0) {
                            discordMessage += '\n:camera_with_flash: Images Links:\n';
                            for (let src of imgSrcs) {
                                discordMessage += `${src}\n`;
                            }
                        }

                        if (aHrefs.length > 0) {
                            discordMessage += '\n:link: External Links:\n';
                            for (let href of aHrefs) {
                                discordMessage += `${href}\n`;
                            }
                        }

                        sendDiscordMessage(discordMessage, "Update Archive", "16711680", "New Content ?", "", newsWebhook);

                    }
                }
            }
        });
    }

    function checkForShoutbox(){
        fetch('https://www.fallensword.com/index.php?cmd=news')
            .then(response => response.text())
            .then(text => {
            let tempElement = document.createElement('div');
            tempElement.innerHTML = text;
            let shoutboxDiv = tempElement.querySelector('#pCC div.float_right div.news_shoutbox');
            if (shoutboxDiv) {
                let shouts = shoutboxDiv.querySelectorAll('div.shout');
                for (let shout of shouts) {
                    let shoutHeadLeft = shout.querySelector('div.shout_head_left');
                    let playerName = shoutHeadLeft.querySelector('a').textContent;
                    let shoutHeadRight = shout.querySelector('div.shout_head_right');
                    let messageDate = shoutHeadRight.textContent;
                    let shoutBody = shout.querySelector('div.shout_body');
                    let messageContent = shoutBody.textContent;

                    // Verifica se a data e o nome do jogador já estão armazenados em cache
                    let line = `${messageDate} ${playerName}`;
                    if (!checkInfo(line, 'shoutboxData')) {
                        // Adiciona a data e o nome do jogador ao cache
                        addLine(line, 'shoutboxData');

                        // Formata a mensagem e envia ao Discord
                        let discordMessage = `
:loudspeaker: Player: ${playerName}
:calendar: Date: ${messageDate}
:page_facing_up: Message: ${messageContent}
`;
                        sendExtraDiscordMessageWithDelay(discordMessage, "Shoutbox", "16711680", "Report it now!", "", shoutboxWebhook, "", "");
                    }
                }
            }
        });
    }

    // Run the checkForTitanNotifications function every hour (3600000 milliseconds)3600000
    const now = new Date();
    const timeToNextHour = (60 - now.getMinutes()) * 60 * 1000;
    //console.log('remaining time:', timeToNextHour);
    setTimeout(() => {
        checkForTitanNotifications();
        setInterval(checkForTitanNotifications, 1000 * 60 * 60);
    }, timeToNextHour);
    // Run the checkForPvPNotifications function every 10 minutes (1200000 milliseconds)1200000
    setTimeout(() => {
        checkForPvPNotifications();
        setInterval(checkForPvPNotifications, 1000 * 60 * 10);
    }, timeToNextHour);
    setInterval(checkForNewBounty, 7000);
    setInterval(checkForSuperEliteKills, 15 * 1000);
    setInterval(checkForCratesFound, 60 * 1000);
    setInterval(checkForShoutbox, 300 * 1000);
    setInterval(checkForUpdatesArchive, 300 * 1000);
})();
