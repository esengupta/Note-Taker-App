$(document).ready(function () {
  let writeIcon = $('.fa-pencil'),
    saveIcon = $('.fa-save'),
    newNoteBtn = $('.btn-new-note'),
    noteId = 1,
    editMode = false,
    newNote = true,
    listItem = '',
    savePopOverTimeout = '';
    editPopOverTimeout = '',
    deleteIcons = '',
    chosenEditNoteId,

  //  Adding PopOver on Save & Edit buttons in Navbar..
  $('i.fa-pencil').popover();
  editPopOverShow();
  $('i.fa-save').popover();
  

  function getRecords(route) {
    let apiUrl = `/api/${route}`,
      notesList = $(".list-group");

    $.ajax({
      url: apiUrl,
      method: 'GET',
    }).then(function (data) {
      console.log(data);
      jQuery.each(data, function (i, obj) {
        if (route === "notes") {
          notesList.append(`<li id="${obj.id}" class="list-group-item ui-state-default"><i class="fa fa-arrows-v" aria-hidden="true"></i>
                                <span>${obj.title}</span><i class="fa fa-trash text-danger" aria-hidden="true"></i>
                                </li>`);

          //data binding to LI element
          $(`li#${obj.id}`).data({
            "id": obj.id,
            "note": obj.note,
            "title": obj.title
          });

        }
      });

      // JQuery UI draggable library for each Note in the List
      
      $("#sortable").disableSelection();
      $("#sortable").sortable();

      // This logs an array of all the items in the sortable UL with their id's and their current index
      $('#sortable').sortable({
        stop: function (e, ui) {
          console.log($.map($(this).find('li'), function (el) {
            return $(el).attr('id') + ' = ' + $(el).index();
          }));
        }
      });

      //  display Note on the page--On Note click
      listItem = $('#sortable li span');

      listItem.click(function () {
        let $this = $(this).parent(),
          obj = $this.data();

        chosenEditNoteId = obj.id;
        $('#note-title').val(obj.title);
        $('#note-text').val(obj.note);

        newNote = false;
        newNoteBtn.css("display", "block");
      });

      /* Delete certain Note */
      deleteIcons = $('ul.list-group li.list-group-item i.fa-trash');

      deleteIcons.click(function () {
        noteId = $(this).parent().attr("id");
        $.ajax({
          url: `/api/notes/${noteId}`,
          method: "DELETE"
        }).then(function () {
          $(`li#${noteId}`).remove();
          $("#note-title").val('');
          $('#note-text').val('');
        });
        newNote = true;
        newNoteBtn.css("display", "none");
      });

    });
  }

  //Get all Notes---MySql DB
  getRecords("notes");

  function saveRecord(route, record, method) {
    $.ajax({
        url: route,
        method: method,
        data: record
      })
      .then(function (data) {
        console.log(data);
        if (data) {
          console.log("Note Saved Sucessfully");
          $(`#sortable li`).remove();
          getRecords("notes");
        } else {
          alert("Error adding Note");
        }

        if (newNote) {
          // Clear the txt when submitting
          clearForm();
        }
      });
  }

  function clearForm() {
    $("#note-title").val("");
    $("#note-text").val("");
  }

  newNoteBtn.click(function () {
    newNote = true;
    clearForm();
    newNoteBtn.css("display", "none");
  });

  //Go into Edit Mode
  writeIcon.click(function () {
    editMode = true;
    writeIcon.css("display", "none");
    saveIcon.css("display", "block");
    $('#note-title').prop("readonly", false);
    $('#note-text').prop("readonly", false);
    clearTimeout(savePopOverTimeout);
    savePopOverShow();
  });

  //shows edit popOver for 10 secs
  function editPopOverShow() {
    $('i.fa-save').popover('hide');
    $('i.fa-pencil').popover('show');
    editPopOverTimeout = setTimeout(function () {
      $('i.fa-pencil').popover('hide');
    }, 10000);
  }

  //shows save PopOVer for 15 secs
  function savePopOverShow() {
    $('i.fa-pencil').popover('hide');
    $('i.fa-save').popover('show');

    savePopOverTimeout = setTimeout(function () {
      $('i.fa-save').popover('hide');
    }, 15000);
  }

  //Get out of Edit mode, pressing the ESC key
  document.onkeydown = function (evt) {
    if (editMode) {
      evt = evt || window.event;
      if (evt.keyCode == 25) {
        editMode = false;
        $('i.fa-save').popover('hide');
        saveIcon.css("display", "none");
        writeIcon.css("display", "block");

        $('#note-title').prop("readonly", true);
        $('#note-text').prop("readonly", true);
        clearTimeout(editPopOverTimeout);
        editPopOverShow();
      }
    }
  };

  //Save new or Update existing Note
  saveIcon.click(function (event) {
    let url,
      note,
      method;

    // Get the form data
    note = {
      title: $("#note-title").val().trim(),
      note: $("#note-text").val().trim()
    };

    if (newNote) {
      url = `/api/notes`;
      method = "POST"
    } else if (!newNote) {
      url = `/api/addNote/${chosenEditNoteId}`;
      method = "PUT"
    }

    saveRecord(url, note, method);

    saveIcon.css("display", "none");
    writeIcon.css("display", "block");
    editPopOverShow();

    

  });
});