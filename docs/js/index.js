/* Do not remove
GPL 3.0 License

Copyright (c) 2020 Mani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

window.addEventListener('load', () => {
    registerSW();
});

async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js');
        } catch (e) {
            console.log(`SW registration failed`);
        }
    }
}


window.onload = function () {

    document.getElementById("contextBefore").value = "1";
    document.getElementById("clozePrompts").value = "1";
    document.getElementById("contextAfter").value = "0";

}


var deckName = "Ocloze";

function showSnackbar(msg) {
    var x = document.getElementById("snackbar");

    x.innerHTML = msg;
    x.className = "show";

    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}


function generateCloze() {
    var note = document.getElementById("noteOriginal");
    data = note.value;
    if (data.trim() != "") {
        if (data.includes("[[oc")) {
            convertCloze();
        } else {
            autoGenerate();
        }
    }
}

// convert [[oc_::..]] to {{c_::..}}, where _ is 1,2,3...
function convertCloze() {
    var note = document.getElementById("noteOriginal");
    noteData = note.value;

    // var n = 1;
    // var noteData1 = noteData.replace(/\[\[oc.?::/g, function (t) { return "{{c" + n++ + "::" });
    // noteData1 = noteData1.replaceAll("]]", "}}");
    // console.log(noteData1);

    var cBef = document.getElementById("contextBefore").value;
    var cProm = document.getElementById("clozePrompts").value;
    var cAft = document.getElementById("contextAfter").value;

    // "1,1,0 | n,n,n,n"
    document.getElementById("noteSettings").innerHTML = cBef + "," + cProm + "," + cAft + " | n,n,n,n";

    // insert one by one noteData1 to text_ where _ 1,2,3...
    var len = noteData.match(/\[\[oc.?::/g).length;

    const reg = /\[\[oc(\d+)::((.*?)(::(.*?))?)?\]\]/g;
    var result;
    var i = 1;

    var regText = [];

    while ((result = reg.exec(noteData)) !== null) {
        console.log(result[0]);
        regText.push(result[0]);
    }

    var len = regText.length;

    for (i = 0; i < len; i++) {

        var noteData1 = noteData;

        if (i > 0) {
            res = regText[i - 1];
            res = res.replace(/\[\[oc.?::/g, "");
            res = res.replace("]]", "");

            noteData1 = noteData1.replace(regText[i - 1], res);


            res = regText[i];
            res = res.replace(/\[\[oc.?::/g, "{{c" + (i + 1) + "::");
            res = res.replace("]]", "}}");

            noteData1 = noteData1.replace(regText[i], res);
        } else {
            res = regText[i];
            res = res.replace(/\[\[oc.?::/g, "{{c" + (i + 1) + "::");
            res = res.replace("]]", "}}");

            noteData1 = noteData1.replace(regText[i], res);
        }

        for (j = 0; j < len; j++) {
            noteData1 = noteData1.replace(regText[j], "...");
        }

        document.getElementById("noteText" + (i + 1)).value = noteData1;
        console.log("i::" + noteData1);

    }


    // full text at bottom
    noteData = document.getElementById("noteOriginal").value;
    var noteData3 = noteData.replace(/\[\[oc.?::/g, '{{c21::');
    noteData3 = noteData3.replaceAll("]]", "}}")
    document.getElementById("fullText").value = noteData3;
}


// for list one per line
function autoGenerate() {
    var note = document.getElementById("noteOriginal");
    data = note.value;
    data = data.split("\n");

    //{{c1::text...}}
    // 1,1,0 | n,y,y,y
    var cBef = document.getElementById("contextBefore").value;
    var cProm = document.getElementById("clozePrompts").value;
    var cAft = document.getElementById("contextAfter").value;

    // "1,1,0 | n,n,n,n"
    document.getElementById("noteSettings").innerHTML = cBef + "," + cProm + "," + cAft + " | n,n,n,n";


    var fullText = "";
    var len = data.length;
    for (i = 0; i < len; i++) {
        var text = "";
        fullText += "<div>{{c21::" + data[i] + "}}</div>";
        for (j = 0; j < len; j++) {
            if (i == j) {
                if (j > 0) {
                    text += "<div>" + data[j - 1] + "</div>";
                }
                text += "<div>{{c" + (j + 1) + "::" + data[j] + "}}</div>";
            } else {
                text += "<div>...</div>";
            }
        }
        console.log(text);
        document.getElementById("noteText" + (i + 1)).value = text;
    }
    document.getElementById("fullText").value = fullText;

    // replace and wrap original text with <div>
    var orig = document.getElementById("noteOriginal").value.trim().split("\n");
    var o = "";
    for (i = 0; i < orig.length; i++) {
        o += "<div>" + orig[i] + "</div>";
    }
    document.getElementById("noteOriginal").value = o;
}

// add single [[oc_::]] with _ as 1,2,3...
var createClickCount = 0;
var origNoteData = "";
function createCloze() {
    var text = window.getSelection().toString();
    console.log("::" + text);

    var note = document.getElementById("noteOriginal");
    var noteData = document.getElementById("noteOriginal").value;

    if (text != "") {
        createClickCount += 1;
        var text1 = "[[oc" + createClickCount + "::" + text + "]]";

        var start = note.selectionStart;
        var end = note.selectionEnd;

        var noteData1 = noteData.replace(noteData.substring(start, end), text1);
        document.getElementById("noteOriginal").value = noteData1;
    }
}

// add cloze to pyodide output text file for deck export
var textToExport = "";
var textFileName = "";
function addClozeToList() {
    var container = document.getElementById("add-note");

    for (i = 0; i < container.childElementCount; i++) {
        textToExport += container.children[i].children[1].value.trim() + "\t";
    }

    textToExport = textToExport.trim();
    textToExport += "\n";
    console.log(textToExport);

    textFileName = "output-all-notes.txt";

    var checkText = "";
    for (i = 5; i < container.childElementCount; i++) {
        checkText += container.children[i].children[1].value.trim();
    }

    if (checkText.trim() != "") {
        pyodide.runPython("textFileName = js.textFileName")
        pyodide.runPython("textToExport = js.textToExport")

        pyodide.runPython(`with open(textFileName, 'a', encoding='utf-8') as f: 
                                f.write(textToExport)`)

        showSnackbar("Note added to list");

        clearNote();
        createClickCount = 0;
        textToExport = "";

    } else {
        showSnackbar("Note is empty");
    }
}

// clear current note
function clearNote() {
    var container = document.getElementById("add-note");
    for (i = 0; i < container.childElementCount; i++) {
        container.children[i].children[1].value = "";
    }
    createClickCount = 0;
    textToExport = "";
}

function changeSettings() {
    if (document.getElementById("settings-sideNav").style.height == "65%") {
        document.getElementById("settings-sideNav").style.height = "0%";
        document.getElementById("settings-sideNav").style.display = "none";
    } else {
        document.getElementById("settings-sideNav").style.height = "65%";
        document.getElementById("settings-sideNav").style.display = "inline-block";
    }

    var cBef = document.getElementById("contextBefore").value;
    var cProm = document.getElementById("clozePrompts").value;
    var cAft = document.getElementById("contextAfter").value;

    // "1,1,0 | n,n,n,n"
    document.getElementById("noteSettings").innerHTML = cBef + "," + cProm + "," + cAft + " | n,n,n,n";
}

// export and download deck 
function exportAll() {
    document.getElementById('statusMsg').innerHTML = "Wait, deck generating...";
    setTimeout(function () { document.getElementById('statusMsg').innerHTML = ""; }, 2000);

    exportDeck();
    downloadDeck();
}


function showHelp() {
    document.getElementById("settings-sideNav").style.height = "0%";
    document.getElementById("settings-sideNav").style.display = "none";

    if (document.getElementById("viewHelpSideNav").style.height == "100%") {
        document.getElementById("viewHelpSideNav").style.height = "0%"
    } else {
        document.getElementById("viewHelpSideNav").style.height = "100%"
    }
}

// https://stackoverflow.com/questions/6604192/showing-console-errors-and-alerts-in-a-div-inside-the-page
if (typeof console != "undefined")
    if (typeof console.log != 'undefined')
        console.olog = console.log;
    else
        console.olog = function () { };

console.log = function (message) {
    console.olog(message);
    document.getElementById("pyodide-load-msg").innerHTML += '<p>' + message + '</p>';
};
console.debug = console.info = console.log

console.error = function (message) {
    console.error(message);
    document.getElementById("pyodide-load-msg").innerHTML += '<p style="color:red;">' + message + '</p>';
};

function closeConsole() {
    document.getElementById("pyodide-load-status").style.display = "none";
}