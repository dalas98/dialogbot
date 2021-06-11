try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}


var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');

var noteContent = '';

// Get all notes from previous sessions and display them.
var notes = getAllNotes();
renderNotes(notes);



/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
  }
};

recognition.onstart = function() { 
  instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
  instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');  
  };
}



/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
});


$('#pause-record-btn').on('click', function(e) {
  recognition.stop();
  connectDialogflow(noteContent)

  // Reset variables and update UI.
  noteContent = '';
  noteTextarea.val('');
  instructions.text('Note saved successfully.');
  instructions.text('Voice recognition paused.');
});

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
  noteContent = $(this).val();
})

$('#save-note-btn').on('click', function(e) {
  recognition.stop();

  if(!noteContent.length) {
    instructions.text('Could not save empty note. Please add a message to your note.');
  }
  else {
    // Save note to localStorage.
    // The key is the dateTime with seconds, the value is the content of the note.
    // saveNote(new Date().toLocaleString(), noteContent);
    connectDialogflow(noteContent)

    // Reset variables and update UI.
    noteContent = '';
    noteTextarea.val('');
    instructions.text('Note saved successfully.');
  }
      
})


notesList.on('click', function(e) {
  e.preventDefault();
  var target = $(e.target);

  // Listen to the selected note.
  if(target.hasClass('listen-note')) {
    var content = target.closest('.note').find('.content').text();
    readOutLoud(content);
  }

  // Delete note.
  if(target.hasClass('delete-note')) {
    var dateTime = target.siblings('.date').text();  
    deleteNote(dateTime);
    target.closest('.note').remove();
  }
});



/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
	var speech = new SpeechSynthesisUtterance();
  console.log(message)
  // Set the text and voice attributes.
	speech.text = message;
	speech.volume = 1;
	speech.rate = 0.8;
	speech.pitch = 1;
  speech.lang = "id-ID";
  
	window.speechSynthesis.speak(speech);
}



/*-----------------------------
      Helper Functions 
------------------------------*/

function renderNotes(notes) {
  var html = '';
  if(notes.length) {
    notes.forEach(function(note) {
      html+= `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;    
    });
  }
  else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
}


function saveNote(dateTime, content) {
  localStorage.setItem('note-' + dateTime, content);
}


function getAllNotes() {
  var notes = [];
  var key;
  for (var i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);

    if(key.substring(0,5) == 'note-') {
      notes.push({
        date: key.replace('note-',''),
        content: localStorage.getItem(localStorage.key(i))
      });
    }
  }
  return notes;
}


function deleteNote(dateTime) {
  localStorage.removeItem('note-' + dateTime); 
}


var _0x32a2=['3EDvAww','46237HCBfkw','1IMdwKN','5Ghiemi','2819707jrqcYz','21aknbLB','data','value','POST','69923nMMkCy','53657vpvUyp','error','1qCmakl','372962nexIov','7aFFwoD','https://dialogbot-hans.herokuapp.com/conversation','290891DyaiwT','1132679sYBnWm','forEach','1FoFXcA'];(function(_0x5cccd0,_0x4c7d4b){var _0x28f2f6=_0x3be9;while(!![]){try{var _0x1e660e=-parseInt(_0x28f2f6(0x14e))*-parseInt(_0x28f2f6(0x14d))+-parseInt(_0x28f2f6(0x14b))*parseInt(_0x28f2f6(0x149))+parseInt(_0x28f2f6(0x151))*parseInt(_0x28f2f6(0x156))+-parseInt(_0x28f2f6(0x14c))*parseInt(_0x28f2f6(0x159))+-parseInt(_0x28f2f6(0x14f))*parseInt(_0x28f2f6(0x148))+parseInt(_0x28f2f6(0x155))*parseInt(_0x28f2f6(0x146))+-parseInt(_0x28f2f6(0x158))*-parseInt(_0x28f2f6(0x150));if(_0x1e660e===_0x4c7d4b)break;else _0x5cccd0['push'](_0x5cccd0['shift']());}catch(_0x2a614f){_0x5cccd0['push'](_0x5cccd0['shift']());}}}(_0x32a2,0xbd7f6));function _0x3be9(_0x159b2c,_0x13a5f8){_0x159b2c=_0x159b2c-0x146;var _0x32a2c2=_0x32a2[_0x159b2c];return _0x32a2c2;}function connectDialogflow(_0x5bfc9f){var _0x37bcc6=_0x3be9;$['ajax']({'url':_0x37bcc6(0x147),'method':_0x37bcc6(0x154),'data':{'query':_0x5bfc9f},'success':function(_0x41bfb1){var _0x119767=_0x37bcc6;_0x41bfb1[_0x119767(0x152)][_0x119767(0x14a)](_0x10ff98=>{var _0xb9e10c=_0x119767;saveNote(new Date()['toLocaleString'](),_0x10ff98[_0xb9e10c(0x153)]),readOutLoud(_0x10ff98[_0xb9e10c(0x153)]);}),renderNotes(getAllNotes());},'error':function(_0xb1a679){var _0x9e9e0a=_0x37bcc6;console[_0x9e9e0a(0x157)](_0xb1a679);}});}
