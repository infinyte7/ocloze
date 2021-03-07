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

    // insert one by one noteData1 to text_ where _ 1,2,3...
    var len = noteData.match(/\[\[oc.?::/g).length;

    const reg = /\[\[oc(\d+)::((.*?)(::(.*?))?)?\]\]/g;
    var result;
    var i=1;
    while((result = reg.exec(noteData)) !== null) {
        console.log(result[0]);

        var noteData1 = noteData;

        const reg1 = /\[\[oc(\d+)::((.*?)(::(.*?))?)?\]\]/g;
        var res;
        while((res = reg1.exec(noteData)) !== null) {
            console.log(res[0]);

            if (res[0] == result[0]) {
                var res1 = res[0].replace(/\[\[oc.?::/g, "{{c"+i+"::");
                res1 = res1.replace("]]", "}}");
                noteData1 = noteData1.replace(res[0], res1);
            } else {
                noteData1 = noteData1.replace(res[0], "...");
            }
        }

        document.getElementById("noteText" + (i)).value = noteData1;

        i++;
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
    var note = document.getElementById("noteOriginal");
    var noteData = document.getElementById("noteOriginal").value;

    var text = window.getSelection().toString();

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

    pyodide.runPython("textFileName = js.textFileName")
    pyodide.runPython("textToExport = js.textToExport")

    pyodide.runPython(`with open(textFileName, 'w', encoding='utf-8') as f: 
                            f.write(textToExport)`)

    showSnackbar("Note added to list");

    clearNote();
    createClickCount = 0;
    origNoteData = "";

}

// clear current note
function clearNote() {
    var container = document.getElementById("add-note");
    for (i = 0; i < container.childElementCount; i++) {
        container.children[i].children[1].value = "";
    }
}

function changeSettings() {

}

// export and download deck 
function exportAll() {
    document.getElementById('statusMsg').innerHTML = "Wait, deck generating...";
    setTimeout(function () { document.getElementById('statusMsg').innerHTML = ""; }, 2000);

    exportDeck();
    downloadDeck();
}