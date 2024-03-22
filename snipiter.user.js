// ==UserScript==
// @name         Snipe-ITer CSV
// @namespace    https://*
// @version      2.0.0.3
// @description  Snipe-IT helper for batch printing, when doing it directly on browser is impossible or causes issues, major inconvienences
// @author       do76
// @grant        none
// @match        https://*/*
// @run-at context-menu
// @license MIT
// ==/UserScript==


// Select all div elements with class "label"
var labelDivs = document.querySelectorAll('div.label');

// Initialize an array to store the CSV data
var csvData = [];

// Loop through each "label" div
labelDivs.forEach((labelDiv) => {
    // Extract QR image URL
    var qrImg = labelDiv.querySelector('.qr_img img');
    var qrLink = qrImg ? qrImg.src : '';

    // Remove "/qr_code" from QR link
    qrLink = qrLink.replace('/qr_code', '');

    // Extract QR text
    var qrTextDiv = labelDiv.querySelector('.qr_text');
    var qrTextElements = qrTextDiv ? qrTextDiv.querySelectorAll('.pull-left') : [];

    // Initialize variables to store data
    let assetTag = '';
    let hwSerial = '';

    // Loop through each "qr_text" element
    qrTextElements.forEach((textElement) => {
        var text = textElement.textContent.trim();

        // Extract Asset Tag and Hardware Serial
        if (text.startsWith('T:')) {
            assetTag = text;//.substring(3).trim();
        } else if (text.startsWith('S:')) {
            hwSerial = text;//.substring(3).trim();
        }
    });

    // Create a CSV row and push it to the array
    var csvRow = `${qrLink};${assetTag};${hwSerial}`;
    csvData.push(csvRow);
});


var csvString="QR_LINK;ASSET_TAG;HW_SERIAL\n"

// Combine CSV rows into a single string
csvString += csvData.join('\n');

// Log the CSV data to the console
console.log(csvString);

// Optionally, you can download the CSV file
var blob = new Blob([csvString], { type: 'text/csv' });
var link = document.createElement('a');
link.href = window.URL.createObjectURL(blob);
link.download = 'output.csv';
link.click();
