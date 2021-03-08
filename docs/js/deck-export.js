/**
*    Note:  when \ (back slash) then use \\ (double back) other wise it will not work.
*    eg:-   hint.innerHTML.replace(/\[\[oc(\d+)::(.*?)(::(.*?))?\]\]/mg,
*           hint.innerHTML.replace(/\\[\\[oc(\\d+)::(.*?)(::(.*?))?\\]\\]/mg,
**/

pythonCode = `
import random
import csv

import traceback
import js

from glob import glob
from os.path import join

new_title = js.deckName

anki_deck_title = "Ocloze"

if new_title != None:
   anki_deck_title = new_title

anki_model_name = "ocloze-infi"

model_id = random.randrange(1 << 30, 1 << 31)

def exportDeck(data_filename, deck_filename):
   try:
      import genanki
      from genanki import Model
      # front side
      front = """<!--template
######## CLOZE OVERLAPPER DEFAULT TEMPLATE START ########
version: 1.0.0
-->

<!--
PLEASE DO NOT MODIFY THE DEFAULT TEMPLATE SECTIONS.
Any changes between the 'template' markers will be lost once
the add-on updates its template.

Copyright (C) 2016-2019 Aristotelis P. <https://glutanimate.com/>

The Cloze Overlapper card template is licensed under the CC BY-SA 4.0
license (https://creativecommons.org/licenses/by-sa/4.0/). This only
applies to the card template, not the contents of your notes.

Get Cloze Overlapper for Anki at:
https://ankiweb.net/shared/info/969733775
-->

<div class="front">
    {{#Title}}<div class="title">{{Title}}</div>{{/Title}}
    <div class="text">
        <div id="clozed">
            {{cloze:Text1}}
            {{cloze:Text2}}
            {{cloze:Text3}}
            {{cloze:Text4}}
            {{cloze:Text5}}
            {{cloze:Text6}}
            {{cloze:Text7}}
            {{cloze:Text8}}
            {{cloze:Text9}}
            {{cloze:Text10}}
            {{cloze:Text11}}
            {{cloze:Text12}}
            {{cloze:Text13}}
            {{cloze:Text14}}
            {{cloze:Text15}}
            {{cloze:Text16}}
            {{cloze:Text17}}
            {{cloze:Text18}}
            {{cloze:Text19}}
            {{cloze:Text20}}
            {{cloze:Full}}
        </div>
        <div class="hidden">
            <div><span class="cloze">[...]</span></div>
            <div>{{Original}}</div>
        </div>
    </div>
</div>

<script>
// Scroll to cloze
function scrollToCloze () {
    const cloze1 = document.getElementsByClassName("cloze")[0];
    const rect = cloze1.getBoundingClientRect();
    const absTop = rect.top + window.pageYOffset;
    const absBot = rect.bottom + window.pageYOffset;
    if (absBot >= window.innerHeight) {
        const height = rect.top - rect.bottom
        const middle = absTop - (window.innerHeight/2) - (height/2);
        window.scrollTo(0, middle);
    };
}
if ( document.readyState === 'complete' ) {
    setTimeout(scrollToCloze, 1);
} else {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(scrollToCloze, 1);
    }, false);
}
</script>

<!--
######## CLOZE OVERLAPPER DEFAULT TEMPLATE END ######## */
template-->

<!-- Add your customizations here: -->"""

      style = """/*template
######## CLOZE OVERLAPPER DEFAULT TEMPLATE START ########
version: 1.0.0
*/

/*
PLEASE DO NOT MODIFY THE DEFAULT TEMPLATE SECTIONS.
Any changes between the 'template' markers will be lost once
the add-on updates its template.
*/

/* general card style */

html {
/* scrollbar always visible in order to prevent shift when revealing answer*/
overflow-y: scroll;
}

.card {
font-family: "Helvetica LT Std", Helvetica, Arial, Sans;
font-size: 150%;
text-align: center;
color: black;
background-color: white;
}

/* general layout */

.text {
/* center left-aligned text on card */
display: inline-block;
align: center;
text-align: left;
margin: auto;
max-width: 40em;
}

.hidden {
/* guarantees a consistent width across front and back */
font-weight: bold;
display: block;
line-height:0;
height: 0;
overflow: hidden;
visibility: hidden;
}

.title {
font-weight: bold;
font-size: 1.1em;
margin-bottom: 1em;
text-align: center;
}

/* clozes */

.cloze {
/* regular cloze deletion */
font-weight: bold;
color: #0048FF;
}

.card21 #btn-reveal{
/* no need to display reveal btn on last card */
display:none;
}

/* additional fields */

.extra{
margin-top: 0.5em;
margin: auto;
max-width: 40em;
}

.extra-entry{
margin-top: 0.8em;
font-size: 0.9em;
text-align:left;
}

.extra-descr{
margin-bottom: 0.2em;
font-weight: bold;
font-size: 1em;
}

#btn-reveal {
font-size: 0.5em;
}

.mobile #btn-reveal {
font-size: 0.8em;
}

/*
######## CLOZE OVERLAPPER DEFAULT TEMPLATE END ########
template*/

/* Add your customizations here: */"""


      # back side
      back = """<!--template
######## CLOZE OVERLAPPER DEFAULT TEMPLATE START ########
version: 1.0.0
-->

<!--
PLEASE DO NOT MODIFY THE DEFAULT TEMPLATE SECTIONS.
Any changes between the 'template' markers will be lost once
the add-on updates its template.
-->

<div class="back">
    {{#Title}}<div class="title">{{Title}}</div>{{/Title}}
    <div class="text">
        <div id="clozed">
            {{cloze:Text1}}
            {{cloze:Text2}}
            {{cloze:Text3}}
            {{cloze:Text4}}
            {{cloze:Text5}}
            {{cloze:Text6}}
            {{cloze:Text7}}
            {{cloze:Text8}}
            {{cloze:Text9}}
            {{cloze:Text10}}
            {{cloze:Text11}}
            {{cloze:Text12}}
            {{cloze:Text13}}
            {{cloze:Text14}}
            {{cloze:Text15}}
            {{cloze:Text16}}
            {{cloze:Text17}}
            {{cloze:Text18}}
            {{cloze:Text19}}
            {{cloze:Text20}}
            {{cloze:Full}}
        </div>
        <div class="hidden">
            <div><span class="cloze">[...]</span></div>
            <div>{{Original}}</div>
        </div>
    </div>
    <div class="extra"><hr></div>
    <button id="btn-reveal" onclick="olToggle();">Reveal all clozes</button>
    <div class="hidden"><div id="original">{{Original}}</div></div>
    <div class="extra">
        {{#Remarks}}
        <div class="extra-entry">
            <div class="extra-descr">Remarks</div><div>{{Remarks}}</div>
        </div>
        {{/Remarks}}
        {{#Sources}}
        <div class="extra-entry">
            <div class="extra-descr">Sources</div><div>{{Sources}}</div>
        </div>
        {{/Sources}}
    </div>
</div>

<script>
// Remove cloze syntax from revealed hint
var hint = document.getElementById("original");
if (hint) {
    var html = hint.innerHTML.replace(/\\[\\[oc(\\d+)::(.*?)(::(.*?))?\\]\\]/mg,
                                    "<span class='cloze'>$2</span>");
    hint.innerHTML = html
};

// Scroll to cloze
function scrollToCloze () {
    const cloze1 = document.getElementsByClassName("cloze")[0];
    const rect = cloze1.getBoundingClientRect();
    const absTop = rect.top + window.pageYOffset;
    const absBot = rect.bottom + window.pageYOffset;
    if (absBot >= window.innerHeight) {
        const height = rect.top - rect.bottom
        const middle = absTop - (window.innerHeight/2) - (height/2);
        window.scrollTo(0, middle);
    };
}
if ( document.readyState === 'complete' ) {
    setTimeout(scrollToCloze, 1);
} else {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(scrollToCloze, 1);
    }, false);
}


// Reveal full list
var olToggle = function() {
    var orig = document.getElementById('original');
    var clozed = document.getElementById('clozed');
    var origHtml = orig.innerHTML
    orig.innerHTML = clozed.innerHTML
    clozed.innerHTML = origHtml
}
</script>

<!--
######## CLOZE OVERLAPPER DEFAULT TEMPLATE END ######## */
template-->

<!-- Add your customizations here: -->"""

      t_fields = [{"name": "Original"},{"name": "Title"}, {"name": "Remarks"}, {"name": "Sources"}, {"name": "Settings"}]
      
      for i in range(1,21):
          t_fields.append({"name":"Text"+str(i)})

      t_fields.append({"name":"Full"})

      # print(self.fields)
      anki_model = genanki.Model(
          model_id,
          anki_model_name,
          fields=t_fields,
          templates=[
              {
                  "name": "Card 1",
                  "qfmt": front,
                  "afmt": back,
              },
          ],
          css=style,
          model_type=Model.CLOZE
      )

      anki_notes = []

      with open(data_filename, "r", encoding="utf-8") as csv_file:
          csv_reader = csv.reader(csv_file, delimiter="\\t")
          for row in csv_reader:
              flds = []
              for i in range(len(row)):
                  flds.append(row[i])

              anki_note = genanki.Note(
                  model=anki_model,
                  fields=flds,
              )
              anki_notes.append(anki_note)

      anki_deck = genanki.Deck(model_id, anki_deck_title)
      anki_package = genanki.Package(anki_deck)

      for anki_note in anki_notes:
          anki_deck.add_note(anki_note)

      anki_package.write_to_file(deck_filename)

      deck_export_msg = "Deck generated with {} flashcards".format(len(anki_deck.notes))
      js.showSnackbar(deck_export_msg)

   except Exception:
       traceback.print_exc()
    
import micropip

# localhost
# micropip.install("http://localhost:8000/py-whl/frozendict-1.2-py3-none-any.whl")
# micropip.install("http://localhost:8000/py-whl/pystache-0.5.4-py3-none-any.whl")
# micropip.install("http://localhost:8000/py-whl/PyYAML-5.3.1-cp38-cp38-win_amd64.whl")
# micropip.install('http://localhost:8000/py-whl/cached_property-1.5.2-py2.py3-none-any.whl')
# micropip.install("http://localhost:8000/py-whl/genanki-0.8.0-py3-none-any.whl")

# from GitHub using CDN
micropip.install("https://cdn.jsdelivr.net/gh/infinyte7/Anki-Export-Deck-tkinter/docs/py-whl/frozendict-1.2-py3-none-any.whl")
micropip.install("https://cdn.jsdelivr.net/gh/infinyte7/Anki-Export-Deck-tkinter/docs/py-whl/pystache-0.5.4-py3-none-any.whl")
micropip.install("https://cdn.jsdelivr.net/gh/infinyte7/Anki-Export-Deck-tkinter/docs/py-whl/PyYAML-5.3.1-cp38-cp38-win_amd64.whl")
micropip.install("https://cdn.jsdelivr.net/gh/infinyte7/Anki-Export-Deck-tkinter/docs/py-whl/cached_property-1.5.2-py2.py3-none-any.whl")
micropip.install("https://cdn.jsdelivr.net/gh/infinyte7/Anki-Export-Deck-tkinter/docs/py-whl/genanki-0.8.0-py3-none-any.whl")

`

languagePluginLoader.then(() => {
    return pyodide.loadPackage(['micropip'])
}).then(() => {
    pyodide.runPython(pythonCode);

    document.getElementById("loading").style.display = "none";
    document.getElementById("statusMsg").innerHTML = "";

    showSnackbar("Ready to import file");
})

languagePluginLoader.then(function () {
    console.log('Ready');
});

function exportDeck() {
    pyodide.runPython(`exportDeck('output-all-notes.txt', 'output.apkg')`);
}

function downloadDeck() {
    let txt = pyodide.runPython(`                  
    with open('/output.apkg', 'rb') as fh:
        out = fh.read()
    out
    `);

    const blob = new Blob([txt], { type: 'application/zip' });
    let url = window.URL.createObjectURL(blob);

    var downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "Export-Deck.apkg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function exportText() {
    let txt = pyodide.runPython(`                  
    with open('/output-all-notes.txt', 'r') as fh:
        out = fh.read()
    out
    `);

    console.log(txt);

    const blob = new Blob([txt], { type: 'text/plain' });
    let url = window.URL.createObjectURL(blob);

    var downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "output.txt";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}