"use strict";

/**
 *
 * @param {FormPage} formPage
 * @returns {FormEvents}
 */

function FormEvents(formPage) {

  this.formPage = formPage;
  this.updateFormDataEvent = new Event("updateFormData");
  var thisRef = this;


  this.removeOptions = function () {
    var jq_options = $(".options");
    if (jq_options.length > 0) {
      jq_options.remove();
      $(".editnow").removeClass("editnow");
      thisRef.formPage.update();
    }
  };
  this.updateOptions = function (elem) {
    this.showOptions(elem, false);

  };
  this.showOptions = function (elem, fadein) {
    fadein = typeof fadein !== 'undefined' ? fadein : true;
    thisRef.removeOptions();
    elem.addClass("editnow");
    var elem_id = elem.attr("id");
    var component = this.formPage.idGen.getById(elem_id);

    var options = component.getOptions();

    var elem_type = elem.attr("data-type");

    var options_html = $('<div data-target_id ="' + elem_id + '" style="display:none" class="options form-horizontal">');

    var button_delete = $('<button type="button" class="delete_options btn btn-danger"><i class="fa fa-trash-o"></i></button>');


    if($(elem).hasClass("formrow")) {
      button_delete.on("click", function () {
        thisRef.formPage.removeRow(component);
        thisRef.removeOptions();
      });
    } else {
      button_delete.on("click", function () {
        component.parent.removeComponent(component);
        thisRef.removeOptions();
      });
    }

    var button_between = $('<button type="button" class="btn btn-info"><i class="fa fa-question"></i></button>');
    button_between.on("click", function () {
      show_component_info_alert(elem_type, component);
    });
    var button_close = $('<button type="button" class="close_options btn btn-primary"><i class="fa fa-times"></i></button>');
    button_close.on("click", function () {
      thisRef.removeOptions();
    });
    var button_top_group = $('<div class="btn-group windowoptions pull-right" role="group">').append(button_delete).append(button_between).append(button_close);
    options_html.append(button_top_group);
    //options_html.append(button_delete);
    //options_html.append(button_close);
    options_html.append($('<h3>Einstellungen für ' + elem_type + ' <span style="font-size:10px"> ' + elem_id + '</span></h3>'));

    var option2input = function (option, removable) {
      var inputfield;
      var valuetagfield;
      removable = typeof removable !== 'undefined' ? removable : false;

      var live_edit_binder = function (_inputfield, _option) {
        _inputfield.on("keyup change blur", function () {
          console.log(option);
          var opt_val = $(this).val();
          if(!opt_val) return;
          //no [ or ] allowed ...
          var opt_val_safe = opt_val.replace(/[\"'[\]]/gi, '');
          if (opt_val != opt_val_safe) {
            $(this).val(opt_val_safe);
          }
          _option.value = opt_val_safe;
          component.setChanged();
          component.update();
        });
      };

      var live_edit_binder_unsafe = function (_inputfield, _option) {
        _inputfield.on("keyup change blur", function () {
          console.log(option);
          _option.value = $(this).val();
          component.setChanged();
          component.update();
        });
      };

      var live_edit_valutetag_binder = function (_inputfield, _option) {
        _inputfield.on("keyup change blur", function () {
          console.log(option);
          _option.valuetag = $(this).val();
          component.setChanged();
          component.update();
        });
      };

      var live_edit_rowcondition_binder = function (_inputfield, _option) {
        _inputfield.on("keyup change blur", function () {
          console.log(option);
          _option[$(this).attr("name")] = $(this).val();{}

          component.setChanged();
          component.update();
        });
      };


      if (option.editable === false) {
        return null;
      }
      if (option.type === C_Option.prototype.TYPE_BIGTEXT) {

        var editor_id = "editor_" + option.editname;
        var toolbar = "\
                  <div class='btn-toolbar' data-role='editor-toolbar' data-target='#" + editor_id + "'>\
				<div class='btn-group'>\
					<a class='btn btn-default dropdown-toggle' data-toggle='dropdown' id='btn-fs' title='Schriftgröße'><i class='fa fa-text-height'></i>&nbsp;<b class='caret'></b></a>\
					<ul class='dropdown-menu'>\
						<li><a data-edit='fontSize 5' class='fs-Five' id='btn-fs-5'>Sehr groß</a></li>\
						<li><a data-edit='fontSize 4' class='fs-Four' id='btn-fs-4'>Groß</a></li>\
						<li><a data-edit='fontSize 3' class='fs-Three' id='btn-fs-3'>Normal</a></li>\
						<li><a data-edit='fontSize 2' class='fs-Two' id='btn-fs-2'>Klein</a></li>\
						<li><a data-edit='fontSize 1' class='fs-One' id='btn-fs-1'>Sehr klein</a></li>\
					</ul>\
				</div>\
				<div class='btn-group'>\
					<a class='btn btn-default' data-edit='bold' title='Fett (Ctrl/Cmd+B)'><i class='fa fa-bold'></i></a>\
					<a class='btn btn-default' data-edit='italic' title='Kursiv (Ctrl/Cmd+I)'><i class='fa fa-italic'></i></a>\
					<a class='btn btn-default' data-edit='underline' title='Unterstrichen (Ctrl/Cmd+U)'><i class='fa fa-underline'></i></a>\
				</div>\
				<div class='btn-group'>\
					<a class='btn btn-default' data-edit='insertunorderedlist' title='Listenpunkt'><i class='fa fa-list-ul'></i></a>\
					<a class='btn btn-default' data-edit='insertorderedlist' title='Listenpunkt (Numerisch)'><i class='fa fa-list-ol'></i></a>\
				</div>\
				<div class='btn-group'>\
					<a class='btn btn-default' data-edit='justifyleft' title='Linksbündig (Ctrl/Cmd+L)'><i class='fa fa-align-left'></i></a>\
					<a class='btn btn-default' data-edit='justifycenter' title='Zentriert (Ctrl/Cmd+E)'><i class='fa fa-align-center'></i></a>\
					<a class='btn btn-default' data-edit='justifyright' title='Rechtsbündig (Ctrl/Cmd+R)'><i class='fa fa-align-right'></i></a>\
					<a class='btn btn-default' data-edit='justifyfull' title='Block (Ctrl/Cmd+J)'><i class='fa fa-align-justify'></i></a>\
				</div>\
				<div class='btn-group'>\
						<a class='btn btn-default dropdown-toggle' data-toggle='dropdown' title='URL'><i class='fa fa-link'></i></a>\
						<div class='dropdown-menu input-append'>\
							<input placeholder='URL' type='text' data-edit='createLink' />\
							<button class='btn' type='button'>Add</button>\
						</div>\
                                        <a class='btn btn-default' data-edit='unlink' title='URL löschen'><i class='fa fa-unlink'></i></a>\
                                        <span class='btn btn-default pictureBtn'  data-edit='insertImage' title='Bild einfügen (oder Drag & Drop)'> <i class='fa fa-picture-o'></i>\
                                                <input class='imgUpload' style='position:absolute;top:0;left:0;opacity:0;width:30px;height:30px;' type='file' data-role='magic-overlay' data-target='.pictureBtn' data-edit='insertImage' />\
                                        </span>\
                                </div>\
	</div>";
        inputfield = $("<div id='" + editor_id + "' class='form-control wysiwyg_editor'>").html(option.value);
        (function (_inputfield, _option) {
          _inputfield.on("keyup change blur", function () {
            _option.value = $(this).html();
            component.setChanged();
            component.update();
          })
        })(inputfield, option);

        return $('<div class="form-group">').append($("<div class='col-sm-10 col-sm-offset-1'>").append(toolbar).append(inputfield));


      } else if (option.type === C_Option.prototype.TYPE_INT) {
        inputfield = $("<input type='number' class='form-control'/>").val(option.value);
        live_edit_binder(inputfield, option);
        return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-10">').append(inputfield))

      } else if (option.type === C_Option.prototype.TYPE_TEXT) {
        inputfield = $("<input type='text' class='form-control'/>").val(option.value);
        live_edit_binder(inputfield, option);
        if (removable) {

          var button_delete_option = $('<button type="button" class="delete_options btn btn-default btn-sm"><i class="fa fa-trash-o"></i></button>');
          button_delete_option.on("click", function () {
            component.removeElement(option);
            thisRef.updateOptions(elem);
          });
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-8">').append(inputfield)).append($('<div class="col-sm-1">').append(button_delete_option));
        } else {
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-10">').append(inputfield))
        }

      } else if (option.type === C_Option.prototype.TYPE_BIGPLAINTEXT) {
        inputfield = $("<input type='text' class='form-control'/>").val(option.value);
        live_edit_binder_unsafe(inputfield, option);
        if (removable) {

          var button_delete_option = $('<button type="button" class="delete_options btn btn-default btn-sm"><i class="fa fa-trash-o"></i></button>');
          button_delete_option.on("click", function () {
            component.removeElement(option);
            thisRef.updateOptions(elem);
          });
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-8">').append(inputfield)).append($('<div class="col-sm-1">').append(button_delete_option));
        } else {
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-10">').append(inputfield))
        }

      } else if (option.type === C_Option.prototype.TYPE_DATAFIELD) {
        inputfield = $("<input id='inputOptionDatafield' type='text' class='form-control' autocomplete='off'/>").val(option.value);

        live_edit_binder(inputfield, option);

        if (removable) {
          var button_delete_option = $('<button type="button" class="delete_options btn btn-default btn-sm"><i class="fa fa-trash-o"></i></button>');
          button_delete_option.on("click", function () {
            component.removeElement(option);
            thisRef.updateOptions(elem);
          });
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-8">').append(inputfield)).append($('<div class="col-sm-1">').append(button_delete_option));
        } else {
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-10">').append(inputfield))
        }

      } else if (option.type === C_Option.prototype.TYPE_MULTIOPTION) {
        inputfield = $("<input type='text' class='form-control'/>").val(option.value);
        valuetagfield = $("<input type='text' class='form-control valuetag'/>").val(option.valuetag);
        live_edit_binder(inputfield, option);
        live_edit_valutetag_binder(valuetagfield, option);

        if (removable) {
          var button_delete_option = $('<button type="button" class="delete_options btn btn-default btn-sm"><i class="fa fa-trash-o"></i></button>');
          button_delete_option.on("click", function () {
            component.removeElement(option);
            thisRef.updateOptions(elem);
          });
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-9">').append(inputfield).append(valuetagfield)).append($('<div class="col-sm-1">').append(button_delete_option));
        } else {
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-10">').append(inputfield).append(valuetagfield))
        }


      } else if (option.type === C_Option.prototype.TYPE_ADDRESSTYPESELECT) {
        inputfield = $("<select type='text' class='form-control' />");
        var arr = [
          {val: 'street', text: 'Straße'},
          {val: 'houseNumber', text: 'Hausnummer'},
          {val: 'zip', text: 'Postleitzahl'},
          {val: 'city', text: 'Stadt'},
          {val: 'country', text: 'Deutschland'}
        ];
        $(arr).each(function () {
          inputfield.append($("<option>").attr('value', this.val).text(this.text));
        });
        inputfield.val(option.value);
        live_edit_binder(inputfield, option);
        if (removable) {

          var button_delete_option = $('<button type="button" class="delete_options btn btn-default btn-sm"><i class="fa fa-trash-o"></i></button>');
          button_delete_option.on("click", function () {
            component.removeElement(option);
            thisRef.updateOptions(elem);
          });
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-9">').append(inputfield)).append($('<div class="col-sm-1">').append(button_delete_option));
        } else {
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-10">').append(inputfield))
        }

      } else if (option.type === C_Option.prototype.TYPE_INPUTTYPE) {
        inputfield = $("<select type='text' class='form-control' />");
        var arr = [
          {val: 'text', text: 'Text'},
          {val: 'email', text: 'E-Mail'},
          {val: 'number', text: 'Nummer'},
          {val: 'date', text: 'Datum'},
          {val: 'tel', text: 'Telefon'},
          {val: 'password', text: 'Passwort'},
          {val: 'url', text: 'URL'},
        ];
        $(arr).each(function () {
          inputfield.append($("<option>").attr('value', this.val).text(this.text));
        });
        inputfield.val(option.value);
        live_edit_binder(inputfield, option);

        if(removable) {

          var button_delete_option = $('<button type="button" class="delete_options btn btn-default btn-sm"><i class="fa fa-trash-o"></i></button>');
          button_delete_option.on("click", function () {
            component.removeElement(option);
            thisRef.updateOptions(elem);
          });

          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-9">').append(inputfield)).append($('<div class="col-sm-1">').append(button_delete_option));
        } else {
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-10">').append(inputfield))
        }

      } else if (option.type === C_Option.prototype.TYPE_SHOWLABLE) {
        inputfield = $("<select type='text' class='form-control' />");
        var arr = [
          {val: 'true', text: 'Anzeigen'},
          {val: 'printOrMobile', text: 'Nur Druck & Mobil'},
          {val: 'false', text: 'Verstecken'},
        ];
        $(arr).each(function () {
          inputfield.append($("<option>").attr('value', this.val).text(this.text));
        });
        inputfield.val(option.value);
        live_edit_binder(inputfield, option);

        if (removable) {

          var button_delete_option = $('<button type="button" class="delete_options btn btn-default btn-sm"><i class="fa fa-trash-o"></i></button>');
          button_delete_option.on("click", function () {
            component.removeElement(option);
            thisRef.updateOptions(elem);
          });
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-9">').append(inputfield)).append($('<div class="col-sm-1">').append(button_delete_option));
        } else {
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-10">').append(inputfield))
        }

      } else if (option.type === C_Option.prototype.TYPE_INPUTBOOL) {
        inputfield = $("<select type='text' class='form-control' />");
        var arr = [
          {val: '0', text: 'Nein'},
          {val: '1', text: 'Ja'},
        ];
        $(arr).each(function () {
          inputfield.append($("<option>").attr('value', this.val).text(this.text));
        });
        inputfield.val(option.value);
        live_edit_binder(inputfield, option);
        if (removable) {

          var button_delete_option = $('<button type="button" class="delete_options btn btn-default btn-sm"><i class="fa fa-trash-o"></i></button>');
          button_delete_option.on("click", function () {
            component.removeElement(option);
            thisRef.updateOptions(elem);
          });
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-9">').append(inputfield)).append($('<div class="col-sm-1">').append(button_delete_option));
        } else {
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-10">').append(inputfield));
        }

      } else if (option.type === C_Option.prototype.TYPE_ROWSHOW) {
        inputfield = $("<select type='text' class='form-control' />");
        live_edit_binder(inputfield, option);
        var arr = [
          {val: 'always', text: 'Immer'},
          {val: 'condition', text: 'Bei Bedingnung'},
          {val: 'never', text: 'Nie'},
        ];
        $(arr).each(function () {
          inputfield.append($("<option>").attr('value', this.val).text(this.text));
        });
        inputfield.val(option.value);

        return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-10">').append(inputfield));

      } else if (option.type === C_Option.prototype.TYPE_ROWMATCHES) {
        inputfield = $("<select type='text' class='form-control' />");
        live_edit_binder(inputfield, option);
        var arr = [
          {val: 'all', text: 'Alle'},
          {val: 'one', text: 'Eine'},
        ];
        $(arr).each(function () {
          inputfield.append($("<option>").attr('value', this.val).text(this.text));
        });
        inputfield.val(option.value);

        return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-10">').append(inputfield));

      } else if (option.type === C_Option.prototype.TYPE_CONDITION) {
        var condition = $("<select class='form-control row condition' name='condition'> \
           <option value='IF'>WENN</option> \
           <option value='IF NOT'>WENN NICHT</option> \
          </select>");

        var data1 = $("<input class='form-control row data' type='text' name='data1' VALUE='DATA1' />");
        var data2 = $("<input class='form-control row data' type='text' name='data2' VALUE='DATA2' />");

        var operator = $("<select class='form-control row operator' name='operator'> \
            <option value='=='>==</option> \
            <option value='!='>!=</option> \
            <option value='<'>&lt;</option> \
            <option value='>'>&gt;</option> \
            <option value='<='>&lt;=</option> \
            <option value='>='>&gt;=</option> \
          </select>");

        condition.val(option.condition);
        data1.val(option.data1);
        data2.val(option.data2);
        operator.val(option.operator);

        live_edit_rowcondition_binder(condition, option);
        live_edit_rowcondition_binder(data1, option);
        live_edit_rowcondition_binder(data2, option);
        live_edit_rowcondition_binder(operator, option);


        if (removable) {
          var button_delete_option = $('<button type="button" class="delete_options btn btn-default btn-sm"><i class="fa fa-trash-o"></i></button>');
          button_delete_option.on("click", function () {
            component.removeElement(option);
            thisRef.updateOptions(elem);
          });
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + "Regel" + '</label>').append($('<div class="col-sm-10">').append(condition).append(data1).append(operator).append(data2).append(button_delete_option));
        } else {
          return $('<div class="form-group"><label class="col-sm-2 control-label">' + "Regel" + '</label>').append($('<div class="col-sm-10">').append(condition).append(data1).append(operator).append(data2));
        }


      } else {
        console.log(C_Option.prototype.TYPE_TEXT);
        console.log("unknown type " + option.type);
        inputfield = $("<input type='text' class='form-control' rows='3' />").val(option.value);
        live_edit_binder(inputfield, option);
        return $('<div class="form-group"><label class="col-sm-2 control-label">' + option.editname + '</label>').append($('<div class="col-sm-10">').append(inputfield))

      }
    };

    var option_html_advaned = $('<div>');
    for (var x in options) {
      var option = options[x];
      var option_arr = [];
      if (Array.isArray(option)) {
        //flat option array[0,1,2,..]{x,y,z,...} to 1D-Array[0,1,2,3,4,...] sorry for z and z2 :)
        for (var z in option) {
          for (var z2 in option[z]) {
            option_arr.push(option[z][z2]);
          }
        }
      } else {
        option_arr.push(option);
      }
      for (var y in option_arr) {
        var is_removable = Array.isArray(option);
        var inputfield = option2input(option_arr[y], is_removable);
        if (inputfield == null) {
          return;
        }
        if (option_arr[y].editmode == C_Option.prototype.MODE_NORMAL) {
          options_html.append(inputfield);
        } else if (option_arr[y].editmode == C_Option.prototype.MODE_ADVANCED) {
          option_html_advaned.append(inputfield);
        } else {
          console.log("mode unknown: " + option_arr[y].editmode);
        }
      }

      if (Array.isArray(option)) {
        var button_plus = $('<button type="button" class="btn btn-default addOptionButton"><i class="fa fa-plus"></i></button>');
        //var button_minus = $('<button type="button" class="btn btn-default"><i class="fa fa-minus"></i></button>');
        //closure to solve reference problems
        button_plus.on("click", function () {
          component.addElement();
          thisRef.updateOptions(elem);
          return false;
        });
        /*
                 button_minus.on("click", function () {
                 console.log("button minus");
                 component.removeElement();
                 thisRef.updateOptions(elem);
                 });
                 if(component.countElements() < 1){
                 button_minus.hide();
                 }*/

        if(typeof component.showAddButton == "undefined" || component.showAddButton) {
          options_html.append($('<div class="form-group">').append($('<div class="col-sm-10 col-sm-offset-2">').append($('<div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group">').append(button_plus))));
        }

      }
    }
    var $open_advanced = $('<a class="">Erweiterte Einstellungen <i class="fa fa-caret-down"></i></a>');
    $open_advanced.on("click", function () {
      if (option_html_advaned.is(":hidden")) {
        $(this).html('Erweiterte Einstellungen <i class="fa fa-caret-up"></i>');
      } else {
        $(this).html('Erweiterte Einstellungen <i class="fa fa-caret-down"></i>');
      }
      option_html_advaned.fadeToggle();
      if(!options_html.isFullOnScreen()) {
        $('html, body').animate({
          scrollTop: options_html.offset().top - $(window).height() + options_html.outerHeight() + 50
        }, 450);
      }
      return false;
    });
    options_html.append($open_advanced);
    options_html.append(option_html_advaned.hide());
    //var button_close = $('<button type="button" class="close_options btn btn-primary">Schließen</button>');
    //button_close.on("click", function () {
    //    thisRef.removeOptions();
    //});
    //options_html.append($('<div class="row-fluid">').append($('<div class="col-lg-12">').append($('<div class="btn-group pull-right">').append(button_close))));
    var $insert_options = elem;//.closest(".component");
//        if($insert_options.width() < 300){ //hasClass("col-sm-2") || $insert_options.hasClass("col-sm-3")){
//            $insert_options = elem.closest(".row");
//        }

    options_html.css("left", (thisRef.formPage.$ele.offset().left - 30) + "px");
    options_html.css("width", (thisRef.formPage.$ele.width() + 60) + "px");
    options_html.css("top", ($insert_options.offset().top + $insert_options.height() + 20) + "px");
    //$insert_options.after(options_html);
    $("body").prepend(options_html);
    if (fadein) {
      options_html.fadeIn();
    } else {
      options_html.show();
    }

    //late init any rich text editor
    $('.wysiwyg_editor').wysiwyg();

    if(!options_html.isFullOnScreen()) {
      $('html, body').animate({
        scrollTop: options_html.offset().top - $(window).height() + options_html.outerHeight() + 50
      }, 450);
    }


  };
  this.handlers = [];
  this.adressGroups = [];
  this.eventHandler = function (scope, action, selector, func) {
    $(scope).on(action, selector, func);
    this.handlers.push({scope: scope, action: action, selector: selector});

  };
  this.removeEventHandlers = function () {

    //destroy previous contextMenues!
    if ($.hasOwnProperty("contextMenu")) {
      $.contextMenu('destroy');
    }
    for (var i = 0; i < this.handlers.length; i++) {
      $(this.handlers[i].scope).off(this.handlers[i].action, this.handlers[i].selector);
    }
  };

  this.dragStartHandler = function (event) {
    thisRef.removeOptions();
    event.dataTransfer.setData("text", event.target.id);
    $("#" + event.target.id).addClass("isDragging");
    thisRef.formPage.$id_wrapper.addClass("formDragging");
  };
  this.dragEndHandler = function (event) {
    $(".isDragging").removeClass("isDragging");
    $(".drophover").removeClass("drophover");
    thisRef.formPage.$id_wrapper.removeClass("formDragging");
  };
  this.setupEventHandler = function () {
    this.removeEventHandlers();
    this.eventHandler("html", "dragover", ".dropin", function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    });
    this.eventHandler("html", "dragenter", ".dropin", function (event) {
      $(".drophover").removeClass("drophover");
      $(this).addClass("drophover");
      event.preventDefault();
      event.stopPropagation();
      console.log("dragenter" + $(this).attr("id"));
    });

    this.eventHandler("body", "blur", ".form_name", function (event) {
      thisRef.formPage.name = $(this).text();
      thisRef.formPage.setChanged();
    });

    /*

     this.eventHandler("html", "dragleave", ".dropin", function (event) {
     event.preventDefault();
     event.stopPropagation();
     console.log("dragleave" + $(this).attr("id"));
     });
     */
    this.eventHandler("html", "click", ".dinA4_edit .component", function (event) {
      event.preventDefault();
      event.stopPropagation();

      thisRef.showOptions($(this));
    });

    this.eventHandler("html", "click", ".formRowIcon", function (event) {
      event.preventDefault();
      event.stopPropagation();
      thisRef.showOptions($(this).parent(), true);
    });

    //remove options if you click outside options!
    this.eventHandler("html", "click", "", function (event) {
      if (!$(event.target).closest('.options').length && !$(event.target).closest('.autosuggest').length) {
        thisRef.removeOptions();
      }
    });

    this.eventHandler("html", "drop", ".dinA4_edit .dropin,.dinA4_structure .dropin", function (event) {
      event.preventDefault();
      event.stopPropagation();

      $(".isDragging").removeClass("isDragging");
      $(".drophover").removeClass("drophover");
      thisRef.formPage.$id_wrapper.removeClass("formDragging");

      var dragEle_id = event.originalEvent.dataTransfer.getData("text");
      var dragEle = null;
      if (formPage.idGen.exists(dragEle_id)) {
        dragEle = formPage.idGen.getById(dragEle_id);
      }

      if (formPage.mode == "structure" && dragEle != null && !(dragEle instanceof Column)) {
        dragEle = dragEle.parent;
      }


      var action = $('#' + dragEle_id).attr("data-action");

      var target_drop_elem = $(event.target).closest(".dropin");
      var formEle_id = target_drop_elem.attr("id");
      var formEle = formPage.idGen.getById(formEle_id);

      var formColumn = null;
      if (formEle instanceof Column) {
        formColumn = formEle;
      } else if (typeof formEle != "undefined") {
        //formele is a component, parent is a column
        formColumn = formEle.parent;
      }
      if (formColumn == null) {
        console.log("no column found for dropin ...");
        return;
      }

      if (action == "row") {
        formColumn.parent.parent.addRow(1, formColumn.parent);
      }
      if (action == "column") {
        formColumn.parent.addColumn(null, formColumn);
      }
      if (action == "text") {
        formColumn.addC_Text(formEle_id);
      } else if (action == "input") {
        formColumn.addC_Input(formEle_id);
      } else if (action == "checkbox") {
        formColumn.addC_Checkbox(formEle_id);
      } else if (action == "dropzone") {
        formColumn.addC_Dropzone(formEle_id);
      } else if (action == "radio") {
        formColumn.addC_Radio(formEle_id);
      } else if (action == "select") {
        formColumn.addC_Select(formEle_id);
      } else if (action == "urlSelect") {
        formColumn.addC_URLSelect(formEle_id);
      } else if (action == "signature") {
        formColumn.addC_Signature(formEle_id);
      } else if (action == "suggestInput") {
        formColumn.addC_SuggestInput(formEle_id);
      } else if (action == "horizontalrule") {
        formColumn.addC_Horizontalrule(formEle_id);
      } else if (action == "changeDatafield") {
        if (formEle.hasOwnProperty("options") && formEle.options.hasOwnProperty("apibind")) {
          formEle.options.apibind.value = $('#' + dragEle_id).attr("data-datafield");
          formEle.setChanged();
          formEle.update();
        }

      } else if (dragEle != null) {
        //do not drag and drop yourself ...
        if (dragEle_id == formEle_id || dragEle_id == formColumn.getId()) {
          console.log("ignore drop, same source / target!");
          return;
        }
        if (dragEle instanceof Column) {
          console.log("drop column into new row ...");
          //drop / switch columns ...
          formColumn.parent.addColumn(dragEle, formColumn);


        } else {
          //drop component into new column ...
          console.log("drop component into new column ...");
          formColumn.addC(dragEle, formEle.getId());

        }
      }
      thisRef.formPage.update();
      console.log("drop done");

    });

    this.eventHandler("html", "dragstart", ".toolbar button", function (event) {
      //event.preventDefault();
      //event.stopPropagation();
      thisRef.dragStartHandler(event.originalEvent);
    });
    this.eventHandler("html", "dragstart", ".dinA4_edit .component", function (event) {
      console.log("START COMPONENT DRAG");
      thisRef.dragStartHandler(event.originalEvent);
      console.log(event);
    });
    this.eventHandler("html", "dragend", ".component,.compcontainer", function (event) {
      console.log("END DRAG");
      thisRef.dragEndHandler(event.originalEvent);
    });
    this.eventHandler("html", "dragstart", ".dinA4_edit .compcontainer,.dinA4_structure .compcontainer", function (event) {
      console.log("START CONTAINER DRAG");
      thisRef.dragStartHandler(event.originalEvent);
      console.log(event);
    });
    this.eventHandler("html", "click", '.modeselection .btn', function () {
      thisRef.removeOptions();
      var mode = $(this).attr("data-mode");
      console.log("Mode changed to " + mode);
      $(this).parent().find(".active, .btn-primary").removeClass("active btn-primary");
      $(this).addClass("active btn-primary");
      formPage.setMode(mode);
      //$('#btn_live_preview').blur();
      formPage.update();
    });

    if ($.hasOwnProperty("contextMenu")) {
      $.contextMenu({
        selector: '.formrow', //#' + thisRef.formPage.$id_wrapper.attr("id"),
        callback: function (key, options) {
          var m = "clicked: " + key;
          console.log(m);
          console.log(options);
          if (key == "delete") {
            var formEle = thisRef.formPage.idGen.getById(options.$trigger.attr("id"));
            thisRef.formPage.removeRow(formEle);
          }
          if (key == "column1") {
            var formEle = thisRef.formPage.idGen.getById(options.$trigger.attr("id"));
            formEle.addColumns(1);
            formEle.setChanged();
          }
          if (key == "row1") {
            var formEle = thisRef.formPage.idGen.getById(options.$trigger.attr("id"));
            formEle.parent.addRow(1, formEle);
            formEle.setChanged();
          }


          thisRef.formPage.update();
        },
        items: {
          /*"row1": {name: "Neue Zeile", icon: "edit"},
           "row2": {name: "Neue Zeile - 2 Spalten", icon: "edit"},
           "row3": {name: "Neue Zeile - 3 Spalten", icon: "edit"},
           "row4": {name: "Neue Zeile - 4 Spalten", icon: "edit"},
           "row6": {name: "Neue Zeile - 6 Spalten", icon: "edit"},*/
          //"paste": {name: "Paste", icon: "paste"},
          "row1": {name: "Neue Zeile", icon: "edit"},
          "column1": {name: "Neue Spalte", icon: "edit"},
          "delete": {name: "Zeile löschen", icon: "delete"},
          "sep1": "---------",
          "quit": {name: "Quit", icon: "quit"}
        }
      });
      $.contextMenu({
        selector: '.compcontainer', //#' + thisRef.formPage.$id_wrapper.attr("id"),
        callback: function (key, options) {
          var m = "clicked: " + key;
          console.log(m);
          console.log(options);
          if (key == "delete") {
            var formEle = thisRef.formPage.idGen.getById(options.$trigger.attr("id"));
            formEle.parent.removeColumn(formEle);
          }
          if (key == "column1") {
            var formEle = thisRef.formPage.idGen.getById(options.$trigger.attr("id"));
            formEle.parent.addColumns(1);
            formEle.parent.setChanged();
          }
          if (key == "row1") {
            var formEle = thisRef.formPage.idGen.getById(options.$trigger.attr("id"));
            formEle.parent.parent.addRow(1, formEle.parent);
            formEle.parent.setChanged();
          }

          thisRef.formPage.update();
        },
        items: {
          /*"row1": {name: "Neue Zeile", icon: "edit"},
           "row2": {name: "Neue Zeile - 2 Spalten", icon: "edit"},
           "row3": {name: "Neue Zeile - 3 Spalten", icon: "edit"},
           "row4": {name: "Neue Zeile - 4 Spalten", icon: "edit"},
           "row6": {name: "Neue Zeile - 6 Spalten", icon: "edit"},*/
          //"paste": {name: "Paste", icon: "paste"},
          "row1": {name: "Neue Zeile", icon: "edit"},
          "column1": {name: "Neue Spalte", icon: "edit"},
          "delete": {name: "Spalte löschen", icon: "delete"},
          "sep1": "---------",
          "quit": {name: "Quit", icon: "quit"}
        }
      });
      $.contextMenu({
        selector: '.component', //#' + thisRef.formPage.$id_wrapper.attr("id"),
        callback: function (key, options) {
          var m = "clicked: " + key;
          console.log(m);
          console.log(options);
          if (key == "delete") {
            var formEle = thisRef.formPage.idGen.getById(options.$trigger.attr("id"));
            formEle.parent.removeComponent(formEle);
          }
          if (key == "column1") {
            var formEle = thisRef.formPage.idGen.getById(options.$trigger.attr("id"));
            formEle.parent.parent.addColumns(1);
            formEle.parent.parent.setChanged();
          }
          if (key == "row1") {
            var formEle = thisRef.formPage.idGen.getById(options.$trigger.attr("id"));
            formEle.parent.parent.parent.addRow(1, formEle.parent.parent);
            formEle.parent.parent.setChanged();
          }

          thisRef.formPage.update();
        },
        items: {
          /*"row1": {name: "Neue Zeile", icon: "edit"},
           "row2": {name: "Neue Zeile - 2 Spalten", icon: "edit"},
           "row3": {name: "Neue Zeile - 3 Spalten", icon: "edit"},
           "row4": {name: "Neue Zeile - 4 Spalten", icon: "edit"},
           "row6": {name: "Neue Zeile - 6 Spalten", icon: "edit"},*/
          //"paste": {name: "Paste", icon: "paste"},
          "row1": {name: "Neue Zeile", icon: "edit"},
          "column1": {name: "Neue Spalte", icon: "edit"},
          "delete": {name: "Element löschen", icon: "delete"},
          "sep1": "---------",
          "quit": {name: "Quit", icon: "quit"}
        }
      });
      $.contextMenu({
        selector: '#' + thisRef.formPage.$id_wrapper.attr("id"),
        callback: function (key, options) {
          var m = "clicked: " + key;
          console.log(m);
          console.log(options);
          if (key == "row1") {
            console.log("add new line");
            thisRef.formPage.addRow();
          }
          if (key == "row2") {
            console.log("add new line 2");
            thisRef.formPage.addRow(2);
          }
          if (key == "row3") {
            console.log("add new line 3");
            thisRef.formPage.addRow(3);
          }
          if (key == "row4") {
            console.log("add new line 3");
            thisRef.formPage.addRow(4);
          }
          if (key == "row6") {
            console.log("add new line 3");
            thisRef.formPage.addRow(6);
          }
          thisRef.formPage.update();
        },
        items: {
          "row1": {name: "Neue Zeile", icon: "edit"},
          "row2": {name: "Neue Zeile - 2 Spalten", icon: "edit"},
          "row3": {name: "Neue Zeile - 3 Spalten", icon: "edit"},
          "row4": {name: "Neue Zeile - 4 Spalten", icon: "edit"},
          "row6": {name: "Neue Zeile - 6 Spalten", icon: "edit"},
          //"paste": {name: "Paste", icon: "paste"},
          //"delete": {name: "Delete", icon: "delete"},
          //"sep1": "---------",
          //"quit": {name: "Quit", icon: "quit"}
        }
      });
    }
  };
  this.setupEventHandler();
}

function IdGenerator() {
  this.ids = {};

  this.getNextId = function (obj) {
    while (true) {
      var new_id = "id_" + (new Date().getTime() + "").substring(5) + "_" + Math.round(Math.random() * 8999 + 1000);
      if (new_id in this.ids) {
        continue;
      }
      this.ids[new_id] = obj;
      break;
    }
    return new_id;
  };
  this.getById = function (id) {
    if (this.ids.hasOwnProperty(id) === false) {
      throw "Property " + id + " unknown";
    }
    return this.ids[id];
  };

  this.exists = function (id) {
    return (this.ids.hasOwnProperty(id) !== false);
  };

  this.refresh = function () {
    for (var i in this.ids) {
      if (typeof this.ids[i] == "Formpage") {
        continue;
      }
      if (this.ids[i].parent == null) {
        delete this.ids[i];
      }
    }
  }
}

function BasicElement(parent, $ele) {
  this.changed = true;
  this.parent = parent;
  this.id = null;

  this.topparent = this;
  while (this.topparent.parent !== null) {
    this.topparent = this.topparent.parent;
  }
  if (this.topparent.constructor.name !== "FormPage") {
    //IE hack ...
    if (!this.topparent instanceof FormPage) {
      throw "Topparent is not instace of FormPage ...";
    }
  }
  this.$ele = $ele;

  this.isChanged = function () {
    return this.changed === true;
  };
  this.setChanged = function () {
    this.changed = true;
    if (typeof this.parent !== "undefined" && this.parent !== null) {
      this.parent.setChanged();
    }
  };
  this.getId = function () {
    return this.id;
  };
  this.setId = function (newId) {
    this.id = newId;
    this.$ele.attr("id", this.id);
  };
  this.update = function () {
    this.changed = false;
  };

  this.setId(this.topparent.idGen.getNextId(this));

}

function FormLoader() {
  this.VERSION = 2;

  this.loadVersion = function (jsonObj, $id_wrapper, mode) {

    if (!jsonObj.hasOwnProperty("version")) {
      throw "Datei ungültig, keine Versionsinformationen erkannt.";
    }
    var version = jsonObj.version;
    var loadfunction = "loadVersion" + version;

    if (this.hasOwnProperty(loadfunction)) {
      return this[loadfunction](jsonObj, $id_wrapper, mode);
    } else {
      throw "Datei veraltet bzw. die Version wird nicht unterstützt.";
    }
  };

  this.loadVersion2 = function (jsonObj, $id_wrapper, mode) {
    if (jsonObj.version != 2) {
      throw "wrong version to load ...";
    }

    var myForm3 = new FormPage(jsonObj.form.name, $id_wrapper);
    myForm3.name = jsonObj.form.name;
    myForm3.version = jsonObj.form.version;
    if (typeof mode !== "undefined") {
      myForm3.setMode(mode);
    }
    myForm3.version = (typeof jsonObj.form.version === 'undefined') ? 0 : jsonObj.form.version;
    myForm3.versiondate = (typeof jsonObj.form.versionversiondate === 'undefined') ? 0 : jsonObj.form.versionversiondate;

    for (var i = 0; i < jsonObj.form.rows.length; i++) {
      // ROW START
      var row = myForm3.addRow(0);
      var rowOption = jsonObj.form.rows[i].options;
      //build options:
      var options = {};
      for (var x in rowOption) {
        var options_element = rowOption[x];
        if (!Array.isArray(options_element)) {
          options[x] = new C_Option();
          for (var y in options_element) {
            options[x][y] = options_element[y];
          }
        } else {
          options[x] = [];
          for (var p = 0; p < options_element.length; p++) {
            var option_new = {};
            for (var y in options_element[p]) {
              option_new[y] = new C_Option();
              for (var z in options_element[p][y]) {
                option_new[y][z] = options_element[p][y][z];
              }
            }
            options[x].push(option_new);
          }
        }

      }

      row.setOptions(options);

      for (var k = 0; k < jsonObj.form.rows[i].columns.length; k++) {
        var column = row.addColumns(1)[0];
        column.columnLength = jsonObj.form.rows[i].columns[k].columnLength || null;
        for (var n = 0; n < jsonObj.form.rows[i].columns[k].components.length; n++) {
          var element = jsonObj.form.rows[i].columns[k].components[n];
          var component = column["add" + element.type]();
          //build options:
          var options = {};
          for (var x in element.options) {
            var options_element = element.options[x];
            if (!Array.isArray(options_element)) {
              options[x] = new C_Option();
              for (var y in options_element) {
                options[x][y] = options_element[y];
              }
            } else {
              options[x] = [];
              for (var p = 0; p < options_element.length; p++) {
                var option_new = {};
                for (var y in options_element[p]) {
                  option_new[y] = new C_Option();
                  for (var z in options_element[p][y]) {
                    option_new[y][z] = options_element[p][y][z];
                  }
                }
                options[x].push(option_new);
              }
            }

          }

          component.setOptions(options);
          //change id, if not existent, else keep the new generated.
          //double existing ids will bug the whole formular
          if (myForm3.idGen.ids.hasOwnProperty(element.id) == false) {
            delete myForm3.idGen.ids[component.getId()];
            component.setId(element.id);
            myForm3.idGen.ids[component.id] = component;
          }
          component.setChanged();
        }
        column.setChanged();
      }

      row.setChanged();
    }
    myForm3.setChanged();
    myForm3.update();
    return myForm3;

  };
  this.loadVersion3 = function (jsonObj, $id_wrapper, mode) {
    if (jsonObj.version != 2) {
      throw "wrong version to load ...";
    }

    var myForm2 = new FormPage(jsonObj.form.name, $id_wrapper);
    myForm2.name = jsonObj.form.name;
    myForm2.version = jsonObj.form.version;
    if (typeof mode !== "undefined") {
      myForm2.setMode(mode);
    }
    myForm2.version = (typeof jsonObj.form.version === 'undefined') ? 0 : jsonObj.form.version;
    myForm2.versiondate = (typeof jsonObj.form.versionversiondate === 'undefined') ? 0 : jsonObj.form.versionversiondate;

    for (var i = 0; i < jsonObj.form.rows.length; i++) {
      var row = myForm2.addRow(0);
      for (var k = 0; k < jsonObj.form.rows[i].columns.length; k++) {
        var column = row.addColumns(1)[0];
        for (var n = 0; n < jsonObj.form.rows[i].columns[k].components.length; n++) {
          var element = jsonObj.form.rows[i].columns[k].components[n];
          var component = column["add" + element.type]();
          //build options:
          var options = {};
          for (var x in element.options) {
            var options_element = element.options[x];
            if (!Array.isArray(options_element)) {
              options[x] = new C_Option();
              for (var y in options_element) {
                options[x][y] = options_element[y];
              }
            } else {
              options[x] = [];
              for (var p = 0; p < options_element.length; p++) {
                var option_new = {};
                for (var y in options_element[p]) {
                  option_new[y] = new C_Option();
                  for (var z in options_element[p][y]) {
                    option_new[y][z] = options_element[p][y][z];
                  }
                }
                options[x].push(option_new);
              }
            }

          }

          component.setOptions(options);
          //change id, if not existent, else keep the new generated.
          //double existing ids will bug the whole formular
          if (myForm2.idGen.ids.hasOwnProperty(element.id) == false) {
            delete myForm2.idGen.ids[component.getId()];
            component.setId(element.id);
            myForm2.idGen.ids[component.id] = component;
          }
          component.setChanged();
        }
        column.setChanged();
      }
      row.setOptions(options);
      row.setChanged();
    }
    myForm2.setChanged();

    return myForm2;

  };
  this.loadVersion1 = function (jsonObj, $id_wrapper) {
    if (jsonObj.version != 1) {
      throw "wrong version to load ...";
    }

    var myForm2 = new FormPage(jsonObj.form.name, $id_wrapper);
    for (var i = 0; i < jsonObj.form.content.length; i++) {
      var row = myForm2.addRow(0);
      for (var k = 0; k < jsonObj.form.content[i].length; k++) {
        var column = row.addColumns(1)[0];
        for (var n = 0; n < jsonObj.form.content[i][k].length; n++) {
          var element = jsonObj.form.content[i][k][n];
          var component = column["add" + element.type]();
          component.setOptions(element.options);
          //change id, if not existent, else keep the new generated.
          //double existing ids will bug the whole formular
          if (myForm2.idGen.ids.hasOwnProperty(component.id) == false) {
            delete myForm2.idGen.ids[component.getId()];
            component.setId(element.id);
            myForm2.idGen.ids[component.id] = component;
          }
          component.setChanged();
        }
        column.setChanged();
      }
      row.setChanged();
    }
    myForm2.setChanged();
    return myForm2;

  };

  this.save = function (formPage) {
    var saveobj = {};
    saveobj.version = this.VERSION;
    saveobj.form = {};
    saveobj.form.name = formPage.name;
    saveobj.form.version = formPage.incrVersion();
    saveobj.form.versiondate = formPage.versiondate;
    saveobj.form.rows = [];
    for (var i = 0; i < formPage.rows.length; i++) {
      saveobj.form.rows.push({});
      saveobj.form.rows[i].columns = [];
      saveobj.form.rows[i].options = formPage.rows[i].getOptions();
      for (var k = 0; k < formPage.rows[i].columns.length; k++) {
        saveobj.form.rows[i].columns.push({});
        saveobj.form.rows[i].columns[k].columnLength = formPage.rows[i].columns[k].columnLength;
        saveobj.form.rows[i].columns[k].components = [];

        for (var n = 0; n < formPage.rows[i].columns[k].components.length; n++) {
          var component = formPage.rows[i].columns[k].components[n];
          saveobj.form.rows[i].columns[k].components.push({});
          saveobj.form.rows[i].columns[k].components[n].id = component.getId();
          saveobj.form.rows[i].columns[k].components[n].type = component.constructor.name;
          saveobj.form.rows[i].columns[k].components[n].options = component.options;
        }
      }
    }
    //delete all references ...
    return JSON.parse(JSON.stringify(saveobj));
  };
}

function FormPage(name, $id_wrapper) {

  this.idGen = new IdGenerator();
  BasicElement.call(this, null, $('<div>'));
  this.id = "formpage";
  this.$ele.attr("id", this.id);

  this.version = 0;
  this.versiondate = 0;
  this.name = name || "";
  this.rows = [];
  this.mode = FormPage.prototype.MODE_EDIT;
  this.header = null;
  this.footer = null;
  this.$id_wrapper = $id_wrapper;

  this.addressFieldGroups = [];

  $id_wrapper.empty();
  $id_wrapper.append(this.$ele);
  this.$add_row_button = $('<button class="btn btn-sm btn-default" data-toggle="tooltip" data-placement="bottom" title="Neue Zeile einfügen" style="position:absolute;right:0px;"><i class="fa fa-plus"></i></button>');

  this.formevents = new FormEvents(this);

  /**
   * increments and updates version and returns uptodate version number.
   * @returns {number|*}
   */
  this.incrVersion = function () {
    this.version = this.version + 1;
    this.versiondate = Math.floor(Date.now() / 1000);
    return this.version;
  };
  this.setMode = function (mode) {
    if (mode === this.mode) {
      return true;
    }
    //go from live mode to non live mode ...
    if (this.mode === FormPage.prototype.MODE_LIVE) {
      this.formevents.setupEventHandler();
    }
    //go from non live mode into live mode!
    if (mode === FormPage.prototype.MODE_LIVE) {
      this.formevents.removeEventHandlers();
    }
    this.mode = mode;
    //every child needs to be changed!
    this.setChanged();
    for (var i = 0; i < this.rows.length; i++) {
      for (var k = 0; k < this.rows[i].columns.length; k++) {
        for (var n = 0; n < this.rows[i].columns[k].components.length; n++) {
          this.rows[i].columns[k].components[n].setChanged();
        }
        this.rows[i].columns[k].setChanged();
      }

      this.rows[i].setChanged();

    }


    return true;

  };

  this.getFormData = function () {
    var formdata = {};
    for (var i in this.idGen.ids) {
      var element = this.idGen.ids[i];
      if (element.hasOwnProperty("inputdata")) {
        for (var k in element.inputdata) {
          formdata[k] = element.inputdata[k];
        }
      }
    }
    return formdata;
  };

  this.getFormDataWithVersion = function () {
    var formdata = {};
    formdata.version = this.version;
    formdata.data = {};
    for (var i in this.idGen.ids) {
      var element = this.idGen.ids[i];
      if (element.hasOwnProperty("inputdata")) {
        for (var k in element.inputdata) {
          formdata.data[k] = element.inputdata[k];
        }
      }
    }
    return formdata;
  };

  this.validate = function (success_func, fail_func) {

    var isValid = true;
    for (var i in this.idGen.ids) {
      var element = this.idGen.ids[i];
      if (element.hasOwnProperty("inputdata")) {
        isValid = element.inputvalidate() && isValid;
      }
    }
    if (isValid) {
      success_func();
      return true;
    }
    fail_func();
    return false;

  };
  this.setFormData = function (jsonObj) {

    // TODO SELECT and MULTIPLE SELECTS!

    var form_data = jsonObj.data;
    for (var i in this.idGen.ids) {
      var element = this.idGen.ids[i];
      if (element.hasOwnProperty("inputdata")) {
        //reset element inputdata
        for (var k in element.inputdata) {
          element.inputdata[k] = null;
        }
        for (var k2 in form_data) {
          if (element.inputdata.hasOwnProperty(k2.replace("#", ""))) {
            element.inputdata[k2.replace("#", "")] = form_data[k2];
            if (k2.indexOf("#") !== -1) {
              element.isDisabled = true;
            }
          }
        }
        element.setChanged();
      }
    }
    this.update();
    return true;
  };
  this.isMode_edit = function () {
    return this.mode == FormPage.prototype.MODE_EDIT;
  };
  this.isMode_live = function () {
    return this.mode == FormPage.prototype.MODE_LIVE;
  };

  this.update = function () {
    if (this.isChanged() == false) {
      return;
    }
    if (this.mode == FormPage.prototype.MODE_STRUCTURE) {
      this.$ele.removeClass().addClass('dinA4_structure');
    } else if (this.mode == FormPage.prototype.MODE_LIVE) {
      this.$ele.removeClass().addClass('dinA4_live');
    } else if (this.mode == FormPage.prototype.MODE_PREVIEW) {
      this.$ele.removeClass().addClass('dinA4_live');
    } else if (this.mode == FormPage.prototype.MODE_EDIT) {
      this.$ele.removeClass().addClass('dinA4_edit');
    }
    this.$ele.empty();
    for (var i = 0; i < this.rows.length; i++) {
      var row = this.rows[i];
      row.update();
      this.$ele.append(row.$ele);
    }
    if (this.mode != FormPage.prototype.MODE_LIVE && this.mode != FormPage.prototype.MODE_PREVIEW) {
      var thisRef = this;
      this.$ele.append(this.$add_row_button);
      this.$add_row_button.off("click");
      this.$add_row_button.on("click", function () {
        thisRef.addRow(1);
        thisRef.update();
        return false;
      });
    }
    $('.form_name').text(this.name);
    $('[data-toggle="tooltip"]').tooltip();


    this.changed = false;
  };


  /**
   * @param {Row} row
   * @returns {Boolean}
   */
  this.removeRow = function (row) {
    this.setChanged();
    for (var i = 0; i < this.rows.length; i++) {
      if (this.rows[i] === row) {
        //inform every column ...
        for (var k = 0; k < this.rows.length; k++) {
          this.rows[k].setChanged();
        }
        this.rows.splice(i, 1);
        row.parent = null;
        return true;
      }
    }
    return false;
  };
  /**
   *
   * @param {int} column_count
   * @returns {Row|FormPage.addRow.row}
   */
  this.addRow = function (column_count, insert_after_this_row) {
    column_count = (typeof column_count === 'undefined') ? 1 : column_count;
    var $ele = $('<div>');
    var row = new Row(this, $ele);
    row.addColumns(column_count);
    this.setChanged();

    if (typeof insert_after_this_row === "undefined") {
      this.rows.push(row);
    } else {
      for (var i = 0; i < this.rows.length; i++) {
        if (this.rows[i] === insert_after_this_row) {
          this.rows.splice(i, 0, row);
          break;
        }

      }
    }
    this.update();
    return row;

  };

}

function Row(formpage, $ele) {
  BasicElement.call(this, formpage, $ele);
  this.options = {};
  this.columns = [];
  this.options.rowShow = new C_Option("always", C_Option.prototype.TYPE_ROWSHOW, "Zeile anzeigen: ");
  this.options.rowMatches = new C_Option("all", C_Option.prototype.TYPE_ROWMATCHES, "Bedingung zutreffend: ");
  this.options.conditions = [];

  this.formpage = formpage;

  var ref1 = this;
  var optionsRef = this.options;

  var hidden = false;

  this.$ele.addClass("formrow row");
  this.rowIcon = $("<span class='formRowIcon'><i class='fa fa-hand-o-right' aria-hidden='true'></i></span>");

  this.addColumn = function (column, after_this_column) {

    if (column === null) {   
      column = new Column(this, $('<div>'));
    }

    this.setChanged();
    var is_already_part = false;
    var is_already_part_position = 0;

    for (var i = 0; i < this.columns.length; i++) {
      this.columns[i].setChanged();
      if (this.columns[i] == column) {
        is_already_part = true;
        is_already_part_position = i;
      }
    }
    if (is_already_part == false) {

      if (this.columns.length >= 6) {
        show_alert("warning", "Nicht möglich", "Mehr als 6 Spalten pro Reihe werden leider nicht unterstützt.");
        return false;
      }
      column.parent.removeColumn(column);
    }
    column.parent = this;
    column.setChanged();
    var inserted = false;
    for (var i = 0; !inserted && i < this.columns.length; i++) {
      if (this.columns[i] == after_this_column) {
        if (is_already_part === true) {
          var temp_pos = this.columns[i];
          this.columns[i] = this.columns[is_already_part_position];
          this.columns[is_already_part_position] = temp_pos;
          inserted = true;
        } else {
          //this.components[i].$ele.after(component.$ele);
          this.columns.splice(Math.max(0, i), 0, column);
          inserted = true;
        }
      }
    }
    if (!inserted) {
      this.columns.push(column);
      this.$ele.after(column.$ele);
    }
    this.update();
    return true;

  };

  /**
   *
   * @param {int} column_count
   * @returns {Column[]}
   */
  this.addColumns = function (column_count) {
    column_count = (typeof column_count === 'undefined') ? 1 : column_count;
    this.setChanged();
    var newCols = [];
    for (var i = 0; i < column_count; i++) {

      if (this.columns.length >= 6) {
        show_alert("warning", "Nicht möglich", "Mehr als 6 Spalten pro Reihe werden leider nicht unterstützt.");
        return false;
      }

      var $column_ele = $('<div>');
      var column = new Column(this, $column_ele);
      //this.addColumn(column);
      this.columns.push(column);
      newCols.push(column);
    }
    for (var i = 0; i < this.columns.length; i++) {
      this.columns[i].setChanged();
    }
    return newCols;
  };
  this.removeColumn = function (column) {
    for (var i = 0; i < this.columns.length; i++) {
      if (this.columns[i] === column) {
        //inform every column ...
        for (var k = 0; k < this.columns.length; k++) {
          this.columns[k].setChanged();
        }
        this.columns.splice(i, 1);
        column.parent = null;
        break;
      }
    }
    if (this.columns.length == 0) {
      this.parent.removeRow(this);
    }

  };
  this.update = function () {
    if (this.isChanged() == false) {
      return;
    }
    this.$ele.empty();
    this.$ele.attr("data-type", "Zeile");
    if (this.topparent.mode !== FormPage.prototype.MODE_LIVE) {
      this.$ele.append(this.rowIcon);
    }

    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      column.update();
      this.$ele.append(column.$ele);
    }

    this.changed = false;
    this.parent.update();

    if (this.options.rowShow && (this.options.rowShow.value == "condition" || this.options.rowShow.value == "never")) {
      this.changed = true;
      this.parent.update();

      if (this.options.rowShow.value == "never" || !this.checkConditions()) {
        this.$ele.addClass("hiddenRow");
      } else {
        this.$ele.removeClass("hiddenRow");
      }
    }


  };

  this.checkConditions = function () {
    var bool = false;
    for (var i = 0; i < this.options.conditions.length; i++) {

      var e = this.options.conditions[i];
      var condition = e.rowCondition.condition;
      var data1 = e.rowCondition.data1;
      var data2 = e.rowCondition.data2;
      var operator = e.rowCondition.operator;
      var formData = formpage.getFormData();

      if(data1 == "DATA" && data2 == "DATA") {
        return true;
      }

      console.log("##### CHECK #####");

      if (data1.substring(0, 2) == "$(") {
        var id = data1.substring(data1.lastIndexOf("$(") + 2, data1.lastIndexOf(")"));

        data1 = formData[id];
        var inputName = id;
        (function (thisRef, _inputName) {
          var condition_name = 'condition_' + ref1.id;
          thisRef.formpage.$ele.off("blur." + condition_name + " change." + condition_name + " click." + condition_name, '[name="' + _inputName + '"]');
          thisRef.formpage.$ele.on( "blur." + condition_name + " change." + condition_name + " click." + condition_name, '[name="' + _inputName + '"]', function (event) {
            if($(this).is("select") && event.type == "click") {
              return true;
            }
            console.log("Inputfield '" + _inputName + "' with conditional relation has changed by " +  event.type);
            thisRef.setChanged();
            thisRef.update();
            $(this).focus();
            return true;
          });
        }(ref1, inputName));
      }

      if (data2.substring(0, 2) == "$(") {
        var id = data2.substring(data2.lastIndexOf("$(") + 2, data2.lastIndexOf(")"));
        data2 = formData[id];
        console.table(formData);
        var inputName = id;
        (function (thisRef, _inputName) {
          var condition_name = 'condition_' + ref1.id;
          thisRef.formpage.$ele.off("blur." + condition_name + "  change." + condition_name + " click." + condition_name, '[name="' + _inputName + '"]');
          thisRef.formpage.$ele.on("blur." + condition_name + " change." + condition_name + " click." + condition_name, '[name="' + _inputName + '"]', function () {
            if($(this).is("select") && event.type == "click") {
              return true;
            }
            console.log("Inputfield '" + _inputName + "' with conditional relation has changed!");
            thisRef.setChanged();
            thisRef.update();
            $(this).focus();
            return true;
          });
        }(ref1, inputName));
      }

      if(!data1) {
        data1 = 0;
      }

      if(!data2) {
        data2 = 0;
      }

      console.log("'" + data1 + "' " + operator + " '" + data2 + "'");
      bool = eval("'" + data1 + "' " + operator + " '" + data2 + "'");

      if (condition == "IF NOT") bool = !bool;
      if (optionsRef.rowMatches.value == "one" && bool) return bool;
      if (optionsRef.rowMatches.value == "all" && !bool) return bool;
    }
    return bool;

  };

  this.getOptions = function () {
    return this.options;
  };

  this.addElement = function (label) {
    var row = {rowCondition: new R_Condition()};
    this.options.conditions.push(row);
    return row;
  };

  this.countElements = function () {
    return this.options.conditions.length;
  };

  this.removeElement = function (optionsToRemove) {
    if (this.options.conditions.length == 0) {
      return false;
    }
    optionsToRemove = typeof optionsToRemove !== 'undefined' ? optionsToRemove : null;
    if (optionsToRemove === null) {
      this.options.selects.pop();
    } else {
      for (var i = 0; i < this.options.conditions.length; i++) {
        var optionsToCheck = this.options.conditions[i];
        if (optionsToCheck.rowCondition === optionsToRemove) {
          this.options.conditions.splice(i, 1);
          break;
        }
      }
    }
    this.setChanged();
    this.update();
  };

  this.getTotalColumnsLength = function () {
    var totalLength = 0;

    // ignore last child => auto calc;
    for (var i = 0; i + 1 < this.columns.length; i++) {
      totalLength += this.columns[i].columnLength;
    }

    return totalLength;
  }

  this.getColumnsNeedToCalc = function () {
    var elementsNeedtoCalc = 1;

    // ignore last child => auto calc;
    for (var i = 0; i + 1 < this.columns.length; i++) {
      if (this.columns[i].columnLength == null) {
        elementsNeedtoCalc++;
      }
    }

    return elementsNeedtoCalc;
  }

  this.setOptions = function (options) {
    for (var i in options) {
      if (this.options[i] == options[i]) {
        continue;
      }
      if (i == "apibind") {
        //reset input data ...
        this.inputdata = {};
      }
      this.options[i] = options[i];
    }

    if (this.options.conditions.length == 0) {
      this.addElement();
    }
    this.setChanged();
    this.update();
  };

}


/**
 *
 * @param {Row} row
 * @param {type} $ele
 * @property {Component[]} components
 * @returns {Column}
 */

function Column(row, $ele) {
  BasicElement.call(this, row, $ele);
  /**
   * @member {Component[]}
   */
  this.components = [];
  this.columnLength = null;

  this.$ele.addClass("dropin compcontainer col-sm-12");
  $ele.attr("draggable", (this.topparent.mode !== FormPage.prototype.MODE_LIVE) ? true : null);


  this.calcColumnWidth = function () {
    var numberOfColumns = this.parent.columns.length;
    var isAuto = (this.parent.columns[(numberOfColumns - 1)] === this);
    var isCalculated = this.columnLength != null;
    var needCalc = (isAuto || !isCalculated);

    if (!needCalc) {
      return this.columnLength;
    }

    var elementsNeedToCalc = this.parent.getColumnsNeedToCalc();
    var totalLength = this.parent.getTotalColumnsLength();

    if (totalLength > 12) {
      console.error("Fehler. Die Spalte isr größer als 12. Größe: " + totalLength);
      for (var i = 0; i < numberOfColumns; i++) {
        this.parent.columns[i].columnLength = parseInt(Math.floor((12 / elementsNeedToCalc)));
      }
    } else {
      return parseInt(Math.floor((12 - totalLength) / elementsNeedToCalc));
    }

    return this.columnLength;
  }


  this.update = function () {
    if (this.isChanged() == false) {
      return;
    }

    this.$ele.attr("draggable", (this.topparent.mode !== FormPage.prototype.MODE_LIVE) ? true : null);
    this.$ele.empty();

    if (this.topparent.mode === FormPage.prototype.MODE_STRUCTURE) {
      var columnWidthControl = $("" +
        "<div class=\"columnWidthControl\">\n" +
        "  <div class=\"input-group\">\n" +
        "    <span id=\"minusButtonSpan\" class=\"input-group-btn\"></span>\n" +
        "    <span id=\"plusButtonSpan\" class=\"input-group-btn\"></span>\n" +
        "   </div>\n" +
        "</div>");


      var inputField = $("<input>", {
        "id": this.id + "_columnWidthField",
        "type": "text",
        "class": "form-control input-numbers",
        "value": 10,
        "min": 1,
        "max": 12
      });


      var minusButton = $("<button>", {
        "id": this.id + "_minusButton",
        "type": "button",
        "class": "btn btn-danger btn-number",
        "data-type": "minus",
      });

      var plusButton = $("<button>", {
        "id": this.id + "_plusButton",
        "type": "button",
        "class": "btn btn-success btn-number",
        "data-type": "plus"
      });

      minusButton.html("-");
      plusButton.html("+");


      inputField.insertAfter($(columnWidthControl.find("#minusButtonSpan")));

      inputField.val(this.columnLength);

      if(this !== this.parent.columns[(this.parent.columns.length - 1)]) {
        this.columnLength = this.columnLength || this.calcColumnWidth();
        inputField.prop('disabled', false);

        // if value is 1
        if(this.columnLength > 1) {
          columnWidthControl.find("#minusButtonSpan").append(minusButton);
          inputField.css("border-radius", "");
        } else {
          inputField.css({"border-radius": "5px 0px 0px 5px", "padding": "8px" });
          plusButton.css("width", "28px");
        }

        columnWidthControl.find("#plusButtonSpan").append(plusButton);
      } else {
        inputField.val("Auto");
        inputField.prop('disabled', true);
        inputField.css("border-radius", "5px");
      }

      var thisRef = this;

      (function (thisRef) {
        $('body').off("click", '[id="' + thisRef.id + '_minusButton"]');
        $('body').on("click", '[id="' + thisRef.id + '_minusButton"]', function () {
          thisRef.columnLength = thisRef.columnLength || thisRef.calcColumnWidth();
          if ((thisRef.columnLength - 1) > 0) {
            thisRef.columnLength--;
          }
          console.log("Minus-Button");

          for (var i = 0; i < thisRef.parent.columns.length; i++) {
            thisRef.parent.columns[i].setChanged();
          }
          thisRef.parent.update();
        });
      }(this));

      (function (thisRef) {
        $('body').off("click", '[id="' + thisRef.id + '_plusButton"]');
        $('body').on("click", '[id="' + thisRef.id + '_plusButton"]', function () {
          thisRef.columnLength = thisRef.columnLength || thisRef.calcColumnWidth();
          var totalLength = 0;
          for (var i = 0; i < thisRef.parent.columns.length; i++) {
            thisRef.parent.columns[i].setChanged();
            if(thisRef.parent.columns.length == (i + 1)) {
              totalLength++;
            } else {
              totalLength += thisRef.parent.columns[i].columnLength;
            }
          }

          if (totalLength + 1 <= 12) {
            thisRef.columnLength++;
          }

          thisRef.parent.update();
        });
      }(this));


      (function (thisRef) {
        $('body').off("blur", '[id="' + thisRef.id + '_columnWidthField"]');
        $('body').on("blur", '[id="' + thisRef.id + '_columnWidthField"]', function () {
          var fieldValue = parseInt($(this).val());
          var totalLength = 0;

          if(isNaN(fieldValue) || fieldValue <= 0) {
            $(this).val(thisRef.columnLength);
            return;
          }

          // Prüfe, ob Wert zuweisbar ist.
          for (var i = 0; i < thisRef.parent.columns.length; i++) {
            thisRef.parent.columns[i].setChanged();
            if(thisRef.parent.columns[i] === thisRef) {
              continue;
            }

            // Letzes Feld muss mindestins die Breite 1 haben.
            if(thisRef.parent.columns.length == (i + 1)) {
              totalLength++;
            } else {
              totalLength += thisRef.parent.columns[i].columnLength;
            }
          }

          if ((totalLength + fieldValue) <= 12) {
            thisRef.columnLength = fieldValue;
          }

          thisRef.parent.update();
        });
      }(this));

      this.$ele.append(columnWidthControl);
    }

    for (var i = 0; i < this.components.length; i++) {
      this.components[i].update();
      this.$ele.append(this.components[i].$ele);
    }

    this.$ele.removeClass(function (index, css) {
      return (css.match(/(^|\s)col-sm-\S+/g) || []).join(' ');
    }).addClass("col-sm-" + this.calcColumnWidth());

    this.changed = false;
  };


  /**
   * @param {string} insert_after_this_id
   * @returns {undefined}
   */
  this.addC_Text = function (insert_after_this_id) {
    var comp = new C_Text(this, $('<div>'), "");
    return this.addC(comp, insert_after_this_id);
  };

  this.addC_Input = function (insert_after_this_id) {
    var comp = new C_Input(this, $('<div>'), "");
    return this.addC(comp, insert_after_this_id);
  };
  this.addC_Checkbox = function (insert_after_this_id) {
    var comp = new C_Checkbox(this, $('<div>'), "");
    return this.addC(comp, insert_after_this_id);
  };
  this.addC_Dropzone = function (insert_after_this_id) {
    var comp = new C_Dropzone(this, $('<div>'), "");
    return this.addC(comp, insert_after_this_id);
  };
  this.addC_Radio = function (insert_after_this_id) {
    var comp = new C_Radio(this, $('<div>'), "");
    return this.addC(comp, insert_after_this_id);
  };

  this.addC_Select = function (insert_after_this_id) {
    var comp = new C_Select(this, $('<div>'), "");
    return this.addC(comp, insert_after_this_id);
  };

  this.addC_Signature = function (insert_after_this_id) {
    var comp = new C_Signature(this, $('<div>'), "");
    return this.addC(comp, insert_after_this_id);
  };

  this.addC_URLSelect = function (insert_after_this_id) {
    var comp = new C_URLSelect(this, $('<div>'), "");
    return this.addC(comp, insert_after_this_id);
  };

  this.addC_SuggestInput = function (insert_after_this_id) {
    var comp = new C_SuggestInput(this, $('<div>'), "");
    return this.addC(comp, insert_after_this_id);
  };

  this.addC_AddressInput = function (insert_after_this_id) {
    var comp = new C_AddressInput(this, $('<div>'), "");
    return this.addC(comp, insert_after_this_id);
  };

  this.addC_Horizontalrule = function (insert_after_this_id) {
    var comp = new C_Horizontalrule(this, $('<div>'), "");
    return this.addC(comp, insert_after_this_id);
  };

  this.removeComponent = function (component) {
    for (var i = 0; i < this.components.length; i++) {
      if (this.components[i] == component) {
        component.setChanged();
        component.parent = null;
        this.components.splice(i, 1);
        return component;
      }
    }
    return null;
  };

  this.addC = function (component, insert_after_this_id) {
    this.setChanged();
    var is_already_part = false;
    var is_already_part_position = 0;

    for (var i = 0; i < this.components.length; i++) {
      if (this.components[i] == component) {
        is_already_part = true;
        is_already_part_position = i;
        break;
      }
    }
    if (is_already_part == false && component.parent != null) {
      component.parent.removeComponent(component);
    }

    component.parent = this;

    for (var i = 0; i < this.components.length; i++) {
      if (this.components[i].getId() == insert_after_this_id) {
        this.components[i].setChanged();
        component.setChanged();

        if (is_already_part === true) {
          var temp_pos = this.components[i];
          this.components[i] = this.components[is_already_part_position];
          this.components[is_already_part_position] = temp_pos;
        } else {
          //this.components[i].$ele.after(component.$ele);
          this.components.splice(i, 0, component);
        }
        this.update();
        return component;
      }
    }
    this.components.push(component);
    this.$ele.prepend(component.$ele);
    this.update();
    return component;
  };
}

function Component(column, $ele) {
  BasicElement.call(this, column, $ele);
  $ele.addClass("component dropin");
  $ele.attr("draggable", true);

  this.options = {};
  this.inputdata = {};
  this.showAddButton = true;

  this.options.apibind = new C_Option("", C_Option.prototype.TYPE_DATAFIELD, "Datenname");
  this.options.apibind.editmode = C_Option.prototype.MODE_ADVANCED;

  this.getOptions = function () {
    return this.options;
  };

  this.setOptions = function (options) {
    for (var i in options) {
      if (this.options[i] == options[i]) {
        continue;
      }
      if (i == "apibind") {
        //reset input data ...
        this.inputdata = {};
      }
      this.options[i] = options[i];
    }
    //this.options = options;
    this.setChanged();
    this.update();
  };

  this.setInput = function (key, value) {
    if (this.inputdata[key] != value) {
      this.setChanged();
    }
    this.inputdata[key] = value;
  };

  this.setDraggableState = function () {
    this.$ele.attr("draggable", (this.topparent.mode !== FormPage.prototype.MODE_LIVE) ? true : null);
  };

  this.inputvalidate = function () {
    return true;
  }
}

function C_Text(column, $ele) {
  Component.call(this, column, $ele);
  this.options.text = new C_Option("freier text", C_Option.prototype.TYPE_BIGTEXT, "Freitext");
  this.$ele.addClass("component_text");
  this.$ele.attr("data-type", "text");
  this.options.apibind = {};
  this.inputdata = {"BlaBla": "12"};

  var thisRef = this;

  this.update = function () {
    if (this.isChanged() == false) {
      return;
    }
    this.setDraggableState();
    /*
     var htmls = [];
     var lines = this.options.text.value.split(/\n/);
     var tmpDiv = jQuery(document.createElement('div'));
     for (var i = 0 ; i < lines.length ; i++) {
     htmls.push(tmpDiv.text(lines[i]).html());
     }
     this.$ele.html(htmls.join("<br/>"));
     */

    this.replacePlaceholder();

    this.$ele.html(this.options.text.value);
    this.changed = true;
  };

  this.replacePlaceholder = function() {
    // let replace = /%%(.*)%%/;
    let replace = /%%(.*?)%%/g;

    let formData = this.topparent.getFormData();

    this.options.text.value = this.options.text.value.replace(replace, function(match) {
      let newMatch = match.replace(/%%/g, "");

      if(!(newMatch in thisRef.inputdata)) {
        thisRef.inputdata[newMatch] = "";
      }
      if(newMatch in thisRef.inputdata && thisRef.inputdata[newMatch] && thisRef.inputdata[newMatch] != "") {
        return thisRef.inputdata[newMatch];
      } else {
        return match;
      }
    });
  }
}

function C_Horizontalrule(column, $ele) {
  Component.call(this, column, $ele);
  this.options.width = new C_Option("1", C_Option.prototype.TYPE_INT, "Breite in Pixel");
  this.$ele.addClass("component_horizontalrule");
  this.$ele.attr("data-type", "Linie");


  this.update = function () {
    if (this.isChanged() == false) {
      return;
    }
    this.setDraggableState();

    this.$ele.empty();
    this.$ele.append($('<hr>').css("border-top", parseInt(this.options.width.value) + "px solid #ccc"));
    this.changed = false;
  };
}

/**
 * component_input: '<div class="component dropin component_input"  data-type="input" ><div class="form-group"><label>Eingabename</label><input type="text" class="form-control" placeholder="Eingabe ..."></div></div>',

 * @param {type} column
 * @param {type} $ele
 * @returns {Column.C_Input}
 */
function C_Input(column, $ele) {
  Component.call(this, column, $ele);
  this.$ele.addClass("component_input");
  this.$ele.attr("data-type", "input");

  this.options.label = new C_Option("Eingabename", C_Option.prototype.TYPE_TEXT, "Titel");
  this.options.showLable = new C_Option("text", C_Option.prototype.TYPE_SHOWLABLE, "Titel Anzeigen");
  this.options.showLable.editmode = C_Option.prototype.MODE_ADVANCED;
  
  this.options.helpText = new C_Option("", C_Option.prototype.TYPE_TEXT, "Hilfetext");
  this.options.helpText.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.hideElement = new C_Option("0", C_Option.prototype.TYPE_INPUTBOOL, "Inputfeld verstecken");
  this.options.hideElement.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.placeholder = new C_Option("", C_Option.prototype.TYPE_TEXT, "Platzhalter");
  this.$ele.html('<div class="form-group"><label></label><span class=\'dataname\' style=\'color: lightgrey; font-size: 0.7em; display: none\'> - </span><input type="text" class="form-control" required placeholder=""></div>');

  this.options.datatype = new C_Option("text", C_Option.prototype.TYPE_INPUTTYPE, "Eingabetyp");
  this.options.datatype.editmode = C_Option.prototype.MODE_ADVANCED;
  this.isDisabled = false;


  this.update = function () {
    if (this.isChanged() == false) {
      return;
    }
    this.setDraggableState();
    if (this.options.datatype.value == "date") {
      this.$ele.html("<div class=\"form-group\">\n" +
        "  <label></label>\n" +
        "  <span class='dataname' style='color: lightgrey; font-size: 0.7em; display: none'> - </span>\n" +
        "  <div class=\"date\">\n" +
        "    <div class=\"input-group input-append date\" data-provide=\"datepicker\">\n" +
        "      <input style=\"margin-top: 0px;\" type=\"text\" class=\"form-control datepicker\"/>\n" +
        "      <span class=\"input-group-addon add-on\"><span style=\"font-size: 0.9em;\" class=\"fa fa-lg fa-calendar\"></span></span>\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>");
    }

    var $label = this.$ele.find("label");
    var labelText;
    
    if (this.topparent.mode == FormPage.prototype.MODE_LIVE || this.topparent.mode == FormPage.prototype.MODE_PREVIEW) {
      $label.html(this.options.label.value);
      
      if(this.options.helpText.value.trim().length > 0) {
        let $helpButton = $("<a style='margin-left:5px;' class=''  data-toggle=\"tooltip\" data-original-title='" + this.options.helpText.value + "' title='" + this.options.helpText.value +"'><i class='fa fa-question-circle'></i></a>");
        $label.append($helpButton);
      }
      this.$ele.find(".dataname").hide();
      
      switch (this.options.showLable.value) {
        case "true":
          $label.show();
          break;
        case "printOrMobile":
          $label.hide();
          $label.addClass("printOrMobile");
          break;
        case "false":
          $label.hide();
          break;

        default:
          break;
      }
      if (this.options.label.value === "") $label.hide();
    } else {

      labelText = (this.options.label.value == "" ? this.options.placeholder.value : this.options.label.value);
      var apibindValueText = this.options.apibind.value;

      if (this.options.hideElement.value == true) {
        apibindValueText = apibindValueText + " (Versteckt)";
      }

      $label.html(labelText);
      
      if (this.topparent.mode === FormPage.prototype.MODE_EDIT) {
        this.$ele.find(".dataname").html(apibindValueText);
        this.$ele.find(".dataname").show();
      }

    }

    var $input = this.$ele.find("input");
    var inputName = this.options.apibind.value == "" ? this.getId() : this.options.apibind.value;

    if (this.inputdata.hasOwnProperty(inputName) === false) {
      this.inputdata[inputName] = "";
    }
    var value = this.inputdata[inputName];


    $input.attr("placeholder", this.options.placeholder.value);
    $input.attr("name", inputName);
    if(this.options.datatype.value != "date") {
      $input.attr("type", this.options.datatype.value);
    }
    $input.attr("title", labelText);
    $input.attr("rel", "txtTooltip");

    if (this.isDisabled) {
      $input.prop('disabled', true);
    } else {
      $input.prop('disabled', false);
    }
    
    if (this.options.hideElement.value == true && (this.topparent.mode === FormPage.prototype.MODE_LIVE || this.topparent.mode === FormPage.prototype.MODE_PREVIEW)) {
      $input.addClass("hidden");
    } else if (this.options.hideElement.value == true) {
      $input.removeClass("hidden");
      $input.css("background-color", "rgba(255, 167, 12, 0.5)");
    } else {
      $input.removeClass("hidden");
    }

    $input.val(value);

    (function (thisRef, _inputName) {
      $('body').off("click keyup blur change", '[name="' + _inputName + '"]');
      $('body').on("click keyup blur change", '[name="' + _inputName + '"]', function (event) {
        if(!(event.target.type == "checkbox" || event.target.type == "radio") && event.type == "click") {

        }
        thisRef.inputdata[_inputName] = $(this).val();
        if(!$(event.target).hasClass("datepicker")) {
          thisRef.setChanged();
          thisRef.parent.parent.setChanged();
          // return;
        }

        thisRef.update();
      });
    }(this, inputName));
    this.changed = false;
  };

  this.inputvalidate = function () {

    var isValid   = true;
    var inputName = this.options.apibind.value == "" ? this.getId() : this.options.apibind.value;
    var value     = this.inputdata[inputName];
    var type      = this.options.datatype.value;

    if (value + "" == "") {
      isValid = false;
    }

    switch (type) {
      case "text":
        break;
      case "email":
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        isValid = isValid && re.test(value);
        break;
      case "number":
        var re = /^\d+$/;
        isValid = isValid && re.test(value);
        break;
      case "date":
        // var dateReg = /^\d{2}([.])\d{2}\1\d{4}$/;
        // if(value.match(dateReg)) {
        //   var parts = value.split(".");
        //   value = parts[2] + "-" + parts[1] + "-" + parts[0];
        // };
        break;
      case "tel":
        break;
      case "url":
        break;
      default:
        isValid = false;
    }

    //accept empty elements
    if (!value) {
      isValid = true;
    }


    if (isValid) {
      this.$ele.addClass("inputvalid");
      this.$ele.removeClass("inputNotvalid");

    } else {
      this.$ele.addClass("inputNotvalid");
      this.$ele.removeClass("inputvalid");

    }
    return isValid;
  }
}

function C_SuggestInput(column, $ele) {
  Component.call(this, column, $ele);
  this.$ele.addClass("component_input");
  this.$ele.attr("data-type", "URL-Input");

  this.options.label = new C_Option("Eingabename", C_Option.prototype.TYPE_TEXT, "Titel");
  this.options.showLable = new C_Option("text", C_Option.prototype.TYPE_SHOWLABLE, "Titel Anzeigen");
  this.options.showLable.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.placeholder = new C_Option("", C_Option.prototype.TYPE_TEXT, "Platzhalter");
  this.$ele.html('<div class="form-group"><label></label><span class=\'dataname\' style=\'color: lightgrey; font-size: 0.7em; display: none\'> - </span><input type="text" class="form-control" required placeholder=""></div>');

  this.options.helpText = new C_Option("", C_Option.prototype.TYPE_TEXT, "Hilfetext");
  this.options.helpText.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.hideElement = new C_Option("0", C_Option.prototype.TYPE_INPUTBOOL, "Inputfeld verstecken");
  this.options.hideElement.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.sourceURL = new C_Option("sourceURL", C_Option.prototype.TYPE_BIGPLAINTEXT, "URL");
  this.options.sourceURL.editmode = C_Option.prototype.MODE_NORMAL;

  this.options.inputVar = new C_Option("input", C_Option.prototype.TYPE_TEXT, "URL-Parameter");
  this.options.inputVar.editmode = C_Option.prototype.MODE_NORMAL;

  this.options.customJSFunction = new C_Option("", C_Option.prototype.TYPE_BIGPLAINTEXT, "JavaScript Funktion");
  this.options.customJSFunction.editmode = C_Option.prototype.MODE_ADVANCED;

  this.autoSuggestInitialized = false;

  this.update = function () {
    if (this.isChanged() == false) {
      return;
    }
    this.setDraggableState();
    var $label = this.$ele.find("label");


    var labelText;

    if (this.topparent.mode === FormPage.prototype.MODE_LIVE || this.topparent.mode === FormPage.prototype.MODE_PREVIEW) {
      $label.html(this.options.label.value);
      if(this.options.helpText.value.trim().length > 0) {
        let $helpButton = $("<a style='margin-left:5px;' class=''  data-toggle=\"tooltip\" data-original-title='" + this.options.helpText.value + "' title='" + this.options.helpText.value +"'><i class='fa fa-question-circle'></i></a>");
        $label.append($helpButton);
      }
      switch (this.options.showLable.value) {
        case "true":
          $label.show();
          break;
        case "printOrMobile":
          $label.hide();
          $label.addClass("printOrMobile");
          break;
        case "false":
          $label.hide();
          break;

        default:
          break;
      }
      if (this.options.label.value === "") $label.hide();
    } else {
      labelText = (this.options.label.value == "" ? this.options.placeholder.value : this.options.label.value);
      var apibindValueText = this.options.apibind.value;

      if (this.options.hideElement.value == true) {
        apibindValueText = apibindValueText + " (Versteckt)";
      }

      $label.html(labelText);

      if (this.topparent.mode === FormPage.prototype.MODE_EDIT) {
        this.$ele.find(".dataname").html(apibindValueText);
        this.$ele.find(".dataname").show();
      }
    }

    var $input = this.$ele.find("input");
    var inputName = this.options.apibind.value == "" ? this.getId() : this.options.apibind.value;

    this.changed = false;


    if (this.inputdata.hasOwnProperty(inputName) === false) {
      this.inputdata[inputName] = "";
    }
    var value = this.inputdata[inputName];

    $input.attr("placeholder", this.options.placeholder.value);
    $input.attr("name", inputName);
    $input.attr("title", labelText);
    $input.attr("rel", "txtTooltip");

    var inputID;
    var autoSuggestInitialized;

    if (document.getElementsByName(inputName).length > 0) {
      while (inputID != null) {
        inputID = document.getElementById(inputName + '' + i);
      }
    } else {
      inputID = inputName;
    }

    $input.attr("id", inputID);

    // $input.tooltip({'trigger':'focus', 'title': "TEST"});
    $input.val(value);


    (function (thisRef, _inputName, _inputID) {
      $('body').off("click keyup blur change", '[name="' + _inputName + '"]');
      $('body').on("click keyup blur change", '[name="' + _inputName + '"]', function () {
        thisRef.inputdata[_inputName] = $(this).val();
        thisRef.setChanged();
      });

      $('body').on("click focus", '[id="' + _inputID + '"]', function () {
        var functionContent = thisRef.options.customJSFunction.value || "";
        var callbackFunction = Function("obj", functionContent);


        var options = {
          script: thisRef.options.sourceURL.value,
          varname: thisRef.options.inputVar.value,
          json: true,
          maxresults: 5,
          callback: callbackFunction
        };


        if (thisRef.options.sourceURL.value && thisRef.options.sourceURL.value != "" && thisRef.options.inputVar.value && thisRef.options.inputVar.value != "" && thisRef.autoSuggestInitialized != true) {
          thisRef.autoSuggestInitialized = true;
          console.log("initOnce");
          var as = new bsn.AutoSuggest(_inputID, options);
        }

      });
    }(this, inputName, inputID));
    this.changed = false;
  };


  this.inputvalidate = function () {

    var isValid = true;
    var inputName = this.options.apibind.value == "" ? this.getId() : this.options.apibind.value;
    if(!this.options.datatype) {
      return true;
    }
    var value = this.inputdata[inputName];
    var type = this.options.datatype.value;
    if (value + "" == "") {
      isValid = false;
    }

    switch (type) {
      case "text":
        break;
      case "email":
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        isValid = isValid && re.test(value);
        break;
      case "number":
        var re = /^\d+$/;
        isValid = isValid && re.test(value);
        break;
      case "date":
        break;
      case "tel":
        break;
      case "url":
        break;
      default:
        isValid = false;
    }

    //accept empty elements
    if (!value) {
      isValid = true;
    }


    if (isValid) {
      this.$ele.addClass("inputvalid");
      this.$ele.removeClass("inputNotvalid");

    } else {
      this.$ele.addClass("inputNotvalid");
      this.$ele.removeClass("inputvalid");

    }
    return isValid;
  }
}

function C_AddressInput(column, $ele) {
  Component.call(this, column, $ele);

  this.$ele.addClass("component_input");
  this.$ele.attr("data-type", "input");

  this.options.label = new C_Option("Eingabename", C_Option.prototype.TYPE_TEXT, "Titel");
  this.options.showLable = new C_Option("text", C_Option.prototype.TYPE_SHOWLABLE, "Titel Anzeigen");
  this.options.showLable.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.placeholder = new C_Option("", C_Option.prototype.TYPE_TEXT, "Platzhalter");
  this.$ele.html('<div class="form-group"><label></label><input type="text" class="form-control" required placeholder=""></div>');

  this.options.addressFieldType = new C_Option("addressFieldType ", C_Option.prototype.TYPE_TEXT, "Feldtyp");
  this.options.addressFieldType.editmode = C_Option.prototype.MODE_NORMAL;

  this.options.helpText = new C_Option("", C_Option.prototype.TYPE_TEXT, "Hilfetext");
  this.options.helpText.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.fieldGroup = new C_Option("fieldGroup ", C_Option.prototype.TYPE_SELECTOPTION, "Adressfeldgruppe");
  this.options.addressFieldType.editmode = C_Option.prototype.MODE_NORMAL;

  this.autoSuggestInitialized = false;

  this.update = function () {
    if (this.isChanged() == false) {
      return;
    }
    this.setDraggableState();
    var $label = this.$ele.find("label");


    var labelText;

    if (this.topparent.mode === FormPage.prototype.MODE_LIVE || this.topparent.mode === FormPage.prototype.MODE_PREVIEW) {
      $label.html(this.options.label.value);
      if(this.options.helpText.value.trim().length > 0) {
        let $helpButton = $("<a style='margin-left:5px;' class=''  data-toggle=\"tooltip\" data-original-title='" + this.options.helpText.value + "' title='" + this.options.helpText.value +"'><i class='fa fa-question-circle'></i></a>");
        $label.append($helpButton);
      }
      switch (this.options.showLable.value) {
        case "true":
          $label.show();
          break;
        case "printOrMobile":
          $label.hide();
          $label.addClass("printOrMobile");
          break;
        case "false":
          $label.hide();
          break;

        default:
          break;
      }
      if (this.options.label.value === "") $label.hide();
    } else {
      labelText = (this.options.label.value == "" ? this.options.placeholder.value : this.options.label.value);
      $label.html(labelText + "<span style='color: lightgrey; font-size: 0.7em;'> - " + this.options.apibind.value);
    }

    var $input = this.$ele.find("input");
    var inputName = this.options.apibind.value == "" ? this.getId() : this.options.apibind.value;

    this.changed = false;


    if (this.inputdata.hasOwnProperty(inputName) === false) {
      this.inputdata[inputName] = "";
    }
    var value = this.inputdata[inputName];


    var adressClass = "adressInput" + this.options.fieldGroup.value;

    $input.attr("placeholder", this.options.placeholder.value);
    $input.attr("name", inputName);
    $input.attr("title", labelText);
    $input.attr("rel", "txtTooltip");

    if (this.options.fieldGroup.value && this.options.fieldGroup.value != "") {
      this.topparent.addressFieldGroups.push(this.options.fieldGroup.value);
      $input.addClass(adressClass);
    }

    var inputID;
    var autoSuggestInitialized;

    if (document.getElementsByName(inputName).length > 0) {
      while (inputID != null) {
        inputID = document.getElementById(inputName + '' + i);
      }
    } else {
      inputID = inputName;
    }

    $input.attr("id", inputID);

    // $input.tooltip({'trigger':'focus', 'title': "TEST"});
    $input.val(value);


    (function (thisRef, _inputName, _inputID) {
      $('body').off("click keyup blur change", '[name="' + _inputName + '"]');
      $('body').on("click keyup blur change", '[name="' + _inputName + '"]', function () {
        thisRef.inputdata[_inputName] = $(this).val();
        thisRef.setChanged();
      });

      $('body').on("click focus", '[id="' + _inputID + '"]', function () {
        var options = {
          script: thisRef.options.sourceURL.value,
          varname: thisRef.options.inputVar.value,
          json: true,
          maxresults: 5
        };


        if (thisRef.options.sourceURL.value && thisRef.options.sourceURL.value != "" && thisRef.options.inputVar.value && thisRef.options.inputVar.value != "" && thisRef.autoSuggestInitialized != true) {
          thisRef.autoSuggestInitialized = true;
          console.log("initOnce");
          var as = new bsn.AutoSuggest(_inputID, options);
        }

      });
    }(this, inputName, inputID));
    this.changed = false;
  };

}

/**
 * component_input: '<div class="component dropin component_input"  data-type="input" ><div class="form-group"><label>Eingabename</label><input type="text" class="form-control" placeholder="Eingabe ..."></div></div>',

 * @param {type} column
 * @param {type} $ele
 * @returns {Column.C_Input}
 */
function C_Dropzone(column, $ele) {
  Component.call(this, column, $ele);
  this.$ele.addClass("component_dropzone");
  this.$ele.attr("data-type", "dropzone");

  this.options.label = new C_Option("Datei auswählen", C_Option.prototype.TYPE_TEXT, "Titel");
  this.$ele.html('<div class="form-group"></div>');

  this.update = function () {
    if (this.isChanged() == false) {
      return;
    }
    this.$ele.empty();
    this.setDraggableState();

    if (this.options.label.value !== "") {
      this.$ele.append($("<label>").text(this.options.label.value));
    }

    var inputName = this.options.apibind.value == "" ? this.getId() : this.options.apibind.value;

    var $dropzone = $('<div>');
    $dropzone.addClass("dropzone");
    $dropzone.attr("id", "dropzone_" + inputName);

    $dropzone.dropzone({
      forceFallback: false,
      fallback: function () {
        $dropzone.text("Dateiupload wird für Ihren Browser nicht unterstützt.");
      },
      addRemoveLinks: true,
      autoProcessQueue: false,
      uploadMultiple: true,
      maxFiles: 5,
      maxFilesize: 3,
      parallelUploads: 5,
      dictRemoveFile: "Datei entfernen",
      dictDefaultMessage: "Datei hier auswählen.",
      dictInvalidFileType: "Dateityp nicht unterstützt.",
      dictFileTooBig: "Datei zu groß ({{filesize}} MiB). Max erlaubt: {{maxFilesize}} MiB.",
      dictMaxFilesExceeded: "Mehr Dateiuploads sind nicht erlaubt",
      renameFilename: function (name) {
        //http://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
        var ext = name.substr((~-name.lastIndexOf(".") >>> 0) + 2);
        if (ext != "") {
          ext = "." + ext;
        }

        return inputName + ext;
        //return name.toLowerCase().replace(/[^[A-Za-z0-9\._]/gi, '');
      },
      url: "dummy/dumm"
    });
    this.$ele.append($dropzone);

    this.changed = false;
  };
}

/**
 * component_checkbox: '<div class="component dropin component_input"  data-type="checkbox" ><div class="form-group"><label>Checkbox Überschrift</label><div class="checkbox"><label><input type="checkbox"> Checkbox</label></div></div></div></div>',
 * @param {type} column
 * @param {type} $ele
 * @returns {Column.C_Input}
 */
function C_Checkbox(column, $ele) {
  Component.call(this, column, $ele);
  this.$ele.addClass("component_checkbox");
  this.$ele.attr("data-type", "checkbox");
  this.options.label = new C_Option("Checkbox", C_Option.prototype.TYPE_TEXT, "Titel");
  this.options.checks = [];

  this.options.helpText = new C_Option("", C_Option.prototype.TYPE_TEXT, "Hilfetext");
  this.options.helpText.editmode = C_Option.prototype.MODE_ADVANCED;

  this.addElement = function (label) {
    if(!label) {
      label = "Option " + (this.options.checks.length + 1);
    }
    var row = {label: new C_Option(label, C_Option.prototype.TYPE_MULTIOPTION, "Option")};
    this.options.checks.push(row);
    return row;
  };
  this.countElements = function () {
    return this.options.checks.length;
  };
  this.removeElement = function (optionsToRemove) {
    if (this.options.checks.length == 0) {
      return false;
    }
    optionsToRemove = typeof optionsToRemove !== 'undefined' ? optionsToRemove : null;
    if (optionsToRemove === null) {
      this.options.checks.pop();
    } else {
      for (var i = 0; i < this.options.checks.length; i++) {
        var optionsToCheck = this.options.checks[i];
        if (optionsToCheck.label === optionsToRemove) {
          this.options.checks.splice(i, 1);
          break;
        }
      }
    }
    this.setChanged();
    this.update();
  };
  this.update = function () {
    if (this.isChanged() === false) {
      return;
    }
    this.$ele.empty();
    this.setDraggableState();
    if (this.options.label.value !== "") {
      this.$ele.append($("<label>").text(this.options.label.value));
      if(this.options.helpText.value.trim().length > 0) {
        let $helpButton = $("<a style='margin-left:5px;' class=''  data-toggle=\"tooltip\" data-original-title='" + this.options.helpText.value + "' title='" + this.options.helpText.value +"'><i class='fa fa-question-circle'></i></a>");
        $label.append($helpButton);
      }
    }
    for (var i = 0; i < this.options.checks.length; i++) {
      var coptions = this.options.checks[i];
      var counter = "_" + i;
      if (i == 0) {
        counter = "";
      }
      var inputName_id = this.getId() + "_" + this.options.apibind.value + counter;
      var inputName = (this.options.apibind.value === "" ? this.getId() : this.options.apibind.value) + counter;

      if (coptions.label.valuetag && coptions.label.valuetag != "-" && coptions.label.valuetag != "") {
        inputName = coptions.label.valuetag;
      }

      var checkbox = $('<div class="checkbox"><label><input id="' + inputName_id + '" name="' + inputName + '" type="checkbox" /><span>' + coptions.label.value + '</span></label><span class=\'dataname\' style=\'color: lightgrey; font-size: 0.7em; display: none\'> - </span></div>');

      if (this.inputdata.hasOwnProperty(inputName) === false) {
        this.inputdata[inputName] = null;
      }

      checkbox.find("input").prop("checked", this.inputdata[inputName] == true);

      this.$ele.append(checkbox);
      (function (thisRef, _i) {
        $('body').off("click", '[type="checkbox"][name="' + inputName + '"]');
        $('body').on("click", '[type="checkbox"][name="' + inputName + '"]', function () {
          thisRef.inputdata[_i] = ($(this).prop("checked")) ? "1" : "0";
          thisRef.setChanged();
        });
      }(this, inputName));
    }
    this.changed = false;
  };

  this.addElement("Checkbox 1");

}

/**
 * component_radio: '<div class="component dropin component_input"  data-type="radio"><div class="form-group"><label>Auswahl für ...</label><div class="radio"><label><input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>Option 1</label></div><div class="radio"><label><input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">Option 2</label></div></div></div></div></div>',
 * @param {type} column
 * @param {type} $ele
 * @returns {Column.C_Input}
 */
function C_Radio(column, $ele) {
  Component.call(this, column, $ele);
  this.$ele.addClass("component_radio");
  this.$ele.attr("data-type", "radio");

  this.options.label = new C_Option("Radio", C_Option.prototype.TYPE_TEXT, "Titel");
  this.options.radios = [];

  this.options.helpText = new C_Option("", C_Option.prototype.TYPE_TEXT, "Hilfetext");
  this.options.helpText.editmode = C_Option.prototype.MODE_ADVANCED;

  this.addElement = function (label) {
    if(!label) {
      label = "Auswahl " + (this.options.radios.length + 1);
    }
    var row = {label: new C_Option(label, C_Option.prototype.TYPE_MULTIOPTION, "Option")};
    this.options.radios.push(row);
    this.setChanged();
    return row;
  };
  this.countElements = function () {
    return this.options.radios.length;
  };
  this.removeElement = function (optionsToRemove) {
    if (this.options.radios.length == 0) {
      return false;
    }
    optionsToRemove = typeof optionsToRemove !== 'undefined' ? optionsToRemove : null;
    if (optionsToRemove === null) {
      this.options.radios.pop();
    } else {
      for (var i = 0; i < this.options.radios.length; i++) {
        var optionsToCheck = this.options.radios[i];
        if (optionsToCheck.label === optionsToRemove) {
          this.options.radios.splice(i, 1);
          break;
        }
      }
    }
    this.setChanged();
    this.update();
  };
  this.update = function () {
    if (this.isChanged() === false) {
      return;
    }
    this.setDraggableState();
    this.$ele.empty();
    if (this.options.label.value != "") {
      this.$ele.append($("<label>").text(this.options.label.value));
      if(this.options.helpText.value.trim().length > 0) {
        let $helpButton = $("<a style='margin-left:5px;' class=''  data-toggle=\"tooltip\" data-original-title='" + this.options.helpText.value + "' title='" + this.options.helpText.value +"'><i class='fa fa-question-circle'></i></a>");
        $label.append($helpButton);
      }
    }

    var inputName = this.options.apibind.value === "" ? this.getId() : this.options.apibind.value;
    if (this.inputdata.hasOwnProperty(inputName) === false) {
      this.inputdata[inputName] = null;
    }
    for (var i = 0; i < this.options.radios.length; i++) {
      var coptions = this.options.radios[i];
      var value;

      if (coptions.label.valuetag && coptions.label.valuetag != "-" && coptions.label.valuetag != "") {
        value = coptions.label.valuetag;
      } else {
        value = i;
      }


      var radio = $('<div class="radio"><label><input type="radio" name="' + inputName + '" value="' + value + '" /><span>' + coptions.label.value + '</span></label></div>');

      if (this.inputdata[inputName] == value) {
        radio.find("input").prop("checked", true);
      }

      this.$ele.append(radio);

      (function (thisRef, _inputName, _value) {
        $('body').off("click", '[type="radio"][name="' + _inputName + '"][value="' + _value + '"]');
        $('body').on("click", '[type="radio"][name="' + _inputName + '"][value="' + _value + '"]', function () {
          thisRef.inputdata[_inputName] = _value;
          thisRef.setChanged();
        });
      }(this, inputName, value));
    }
    this.changed = false;
  };

  this.addElement("Auswahl 1");
  this.addElement("Auswahl 2");

}

/**
 * component_select: '<div class="component dropin component_input"  data-type="select"><div class="form-group"><label>Auswahl für ...</label><div class="select"><label><input type="select" name="optionsRadios" id="optionsRadios1" value="option1" checked>Option 1</label></div><div class="select"><label><input type="select" name="optionsRadios" id="optionsRadios2" value="option2">Option 2</label></div></div></div></div></div>',
 * @param {type} column
 * @param {type} $ele
 * @returns {Column.C_Input}
 */
function C_Select(column, $ele) {
  Component.call(this, column, $ele);
  this.$ele.addClass("component_select");

  this.$ele.attr("data-type", "select");
  this.options.label = new C_Option("Select", C_Option.prototype.TYPE_TEXT, "Titel");
  this.options.selects = [];

  this.options.multipleselect = new C_Option(0, C_Option.prototype.TYPE_INPUTBOOL, "Mehrfachliste");
  this.options.multipleselect.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.helpText = new C_Option("", C_Option.prototype.TYPE_TEXT, "Hilfetext");
  this.options.helpText.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.showLable = new C_Option("text", C_Option.prototype.TYPE_SHOWLABLE, "Titel Anzeigen");
  this.options.showLable.editmode = C_Option.prototype.MODE_ADVANCED;

  this.addElement = function (label) {
    var row = {label: new C_Option(label, C_Option.prototype.TYPE_MULTIOPTION, "Option")};
    this.options.selects.push(row);
    this.setChanged();
    return row;
  };
  this.countElements = function () {
    return this.options.selects.length;
  };
  this.removeElement = function (optionsToRemove) {
    if (this.options.selects.length == 0) {
      return false;
    }
    optionsToRemove = typeof optionsToRemove !== 'undefined' ? optionsToRemove : null;
    if (optionsToRemove === null) {
      this.options.selects.pop();
    } else {
      for (var i = 0; i < this.options.selects.length; i++) {
        var optionsToCheck = this.options.selects[i];
        if (optionsToCheck.label === optionsToRemove) {
          this.options.selects.splice(i, 1);
          break;
        }
      }
    }
    this.setChanged();
    this.update();
  };

  this.update = function () {
    if (this.isChanged() === false) {
      return;
    }
    this.setDraggableState();
    this.$ele.empty();

    var $label = $("<label>");
    this.$ele.append($label);

    var labelText;

    if (this.topparent.mode === FormPage.prototype.MODE_LIVE || this.topparent.mode === FormPage.prototype.MODE_PREVIEW) {
      $label.html(this.options.label.value);
      if(this.options.helpText.value.trim().length > 0) {
        let $helpButton = $("<a style='margin-left:5px;' class=''  data-toggle=\"tooltip\" data-original-title='" + this.options.helpText.value + "' title='" + this.options.helpText.value +"'><i class='fa fa-question-circle'></i></a>");
        $label.append($helpButton);
      }
      switch (this.options.showLable.value) {
        case "true":
          $label.show();
          break;
        case "printOrMobile":
          $label.hide();
          $label.addClass("printOrMobile");
          break;
        case "false":
          $label.hide();
          break;

        default:
          break;
      }
      if (this.options.label.value === "") $label.hide();
    } else {
      labelText = this.options.label.value;
      $label.html(labelText + "<span style='color: lightgrey; font-size: 0.7em;'> - " + this.options.apibind.value);
    }

    var inputName = this.options.apibind.value === "" ? this.getId() : this.options.apibind.value;
    if (this.inputdata.hasOwnProperty(inputName) === false) {
      this.inputdata[inputName] = null;
    }
    var $select = $('<select>');
    $select.addClass("form-control");
    $select.prop("name", inputName);
    $select.attr("title", this.options.label.value);
    $select.attr("rel", "txtTooltip");


    if (this.options.multipleselect.value == 1) {
      $select.prop("multiple", true);
      //$select.prop("name",inputName+"[]");
    } else {
      $select.prop("multiple", null);
    }

    var $dropdown = $('<option>');
    $dropdown.text("-");
    $dropdown.val("");
    $select.append($dropdown);

    for (var i = 0; i < this.options.selects.length; i++) {
      var coptions = this.options.selects[i];
      var value;

      if (coptions.label.valuetag && coptions.label.valuetag != "-") {
        value = coptions.label.valuetag;
      } else {
        value = i;
      }

      var $dropdown = $('<option>');
      $dropdown.text(coptions.label.value);
      $dropdown.val(value);
      if (this.options.multipleselect.value == 1) {
        for (var x in this.inputdata[inputName]) {
          if (value + "" == "" + this.inputdata[inputName][x]) {
            $dropdown.attr("selected", true);
          }
        }

      } else {
        if (value + "" == "" + this.inputdata[inputName]) {
          $dropdown.attr("selected", true);
        }
      }
      $select.append($dropdown);
    }

    (function (thisRef, _inputName, _value) {
      console.log("DATANAME: " +  _inputName);
      $('body').off("change.element", '[name="' + _inputName + '"]');
      $('body').on("change.element", '[name="' + _inputName + '"]', function () {
        thisRef.inputdata[_inputName] = $(this).val();
        thisRef.setChanged();
        console.log(thisRef.parent);
        console.log("SELECT changed");
        thisRef.update();

        thisRef.parent.parent.setChanged();
        thisRef.parent.parent.update();
        document.dispatchEvent(thisRef.topparent.formevents.updateFormDataEvent);
      });
    }(this, inputName, value));

    var formGroup = $("<div class='form-group'>");
    formGroup.append($select);
    this.$ele.append(formGroup);

    this.changed = false;
  };

  this.addElement("Auswahl 1");
  this.addElement("Auswahl 2");

}

function C_Signature(column, $ele) {
  Component.call(this, column, $ele);
  this.$ele.addClass("component_signature");

  this.$ele.attr("data-type", "canvas");
  this.options.label = new C_Option("Unterschrift", C_Option.prototype.TYPE_TEXT, "Titel");

  this.options.showLable = new C_Option("text", C_Option.prototype.TYPE_SHOWLABLE, "Titel Anzeigen");
  this.options.showLable.editmode = C_Option.prototype.MODE_ADVANCED;


  this.update = function () {
    if (this.isChanged() === false) {
      return;
    }
    this.setDraggableState();
    this.$ele.empty();

    var $label = $("<label>");
    this.$ele.append($label);

    var labelText;

    if (this.topparent.mode === FormPage.prototype.MODE_LIVE || this.topparent.mode === FormPage.prototype.MODE_PREVIEW) {
      $label.html(this.options.label.value);
      switch (this.options.showLable.value) {
        case "true":
          $label.show();
          break;
        case "printOrMobile":
          $label.hide();
          $label.addClass("printOrMobile");
          break;
        case "false":
          $label.hide();
          break;

        default:
          break;
      }
      if (this.options.label.value === "") $label.hide();
    } else {
      labelText = this.options.label.value;
      $label.html(labelText + "<span style='color: lightgrey; font-size: 0.7em;'> - " + this.options.apibind.value);
    }

    var inputName = this.options.apibind.value === "" ? this.getId() : this.options.apibind.value;
    if (this.inputdata.hasOwnProperty(inputName) === false) {
      this.inputdata[inputName] = null;
    }

    var $select = $('<div id="signature-pad" class="signature-pad">\n' +
      '    <div class="signature-pad--body">\n' +
      '      <canvas id="canvas" width="500" height="200"></canvas>\n' +
      '    </div>\n' +
      '    <div class="signature-pad--footer">\n' +
      '\n' +
      '      <div class="signature-pad--actions">\n' +
      '        <div>\n' +
      '          <button type="button" class="button clear" data-action="clear">Löschen</button>\n' +
      '          <button type="button" class="button" data-action="undo">Rückgängig</button>\n' +
      '\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </div>' +
      '');

    this.wrapper = $select;
    this.canvas = $select.find("canvas").get(0);


    $select.prop("name", inputName);
    $select.attr("title", this.options.label.value);
    $select.attr("rel", "txtTooltip");


    (function (thisRef, _inputName, _value) {


      var signaturePad = new SignaturePad(thisRef.canvas, {
        backgroundColor: 'rgba(255, 255, 255, 0)'
      });


      function resizeCanvas() {
        var ratio = Math.max(window.devicePixelRatio || 1, 1);

        // This part causes the canvas to be cleared
        thisRef.canvas.width = thisRef.canvas.offsetWidth * ratio;
        thisRef.canvas.height = thisRef.canvas.offsetHeight * ratio;
        thisRef.canvas.getContext("2d").scale(ratio, ratio);

        signaturePad.clear();
      }


      function download(dataURL, filename) {
        var blob = dataURLToBlob(dataURL);
        var url = window.URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.style = "display: none";
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
      }

      function dataURLToBlob(dataURL) {
        // Code taken from https://github.com/ebidel/filer.js
        var parts = dataURL.split(';base64,');
        var contentType = parts[0].split(":")[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
      }

      thisRef.wrapper.find("[data-action=clear]").get(0).addEventListener("click", function (event) {
        signaturePad.clear();
      });

      thisRef.wrapper.find("[data-action=undo]").get(0).addEventListener("click", function (event) {
        var data = signaturePad.toData();

        if (data) {
          data.pop(); // remove the last dot or line
          signaturePad.fromData(data);
        }
      });

      window.onresize = resizeCanvas;

    }(this, inputName, null));

    this.$ele.append($select);
    this.changed = false;
  };


}

function C_URLSelect(column, $ele) {
  Component.call(this, column, $ele);
  this.$ele.addClass("component_urlselect");
  this.showAddButton = false;

  this.$ele.attr("data-type", "urlSelect");
  this.options.label = new C_Option("URL-Auswahl", C_Option.prototype.TYPE_TEXT, "Titel");
  this.options.selects = [];

  this.options.multipleselect = new C_Option(0, C_Option.prototype.TYPE_INPUTBOOL, "Mehrfachliste");
  this.options.multipleselect.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.dataURL = new C_Option("url", C_Option.prototype.TYPE_TEXT, "Daten URL");
  this.options.dataURL.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.dataAttribute = new C_Option("", C_Option.prototype.TYPE_TEXT, "Attribut für Daten");
  this.options.dataAttribute.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.helpText = new C_Option("", C_Option.prototype.TYPE_TEXT, "Hilfetext");
  this.options.helpText.editmode = C_Option.prototype.MODE_ADVANCED;

  this.options.showLable = new C_Option("text", C_Option.prototype.TYPE_SHOWLABLE, "Titel Anzeigen");
  this.options.showLable.editmode = C_Option.prototype.MODE_ADVANCED;



  this.addElement = function (label) {

  };
  this.countElements = function () {

  };
  this.removeElement = function (optionsToRemove) {
    if (this.options.selects.length == 0) {
      return false;
    }
    optionsToRemove = typeof optionsToRemove !== 'undefined' ? optionsToRemove : null;
    if (optionsToRemove === null) {
      this.options.selects.pop();
    } else {
      for (var i = 0; i < this.options.selects.length; i++) {
        var optionsToCheck = this.options.selects[i];
        if (optionsToCheck.label === optionsToRemove) {
          this.options.selects.splice(i, 1);
          break;
        }
      }
    }
    this.setChanged();
    this.update();
  };
  this.update = function () {
    if (this.isChanged() === false) {
      return;
    }
    this.setDraggableState();
    this.$ele.empty();

    var $label = $("<label>");
    this.$ele.append($label);

    var labelText;

    if (this.topparent.mode === FormPage.prototype.MODE_LIVE || this.topparent.mode === FormPage.prototype.MODE_PREVIEW) {
      $label.html(this.options.label.value);
      if(this.options.helpText.value.trim().length > 0) {
        let $helpButton = $("<a style='margin-left:5px;' class=''  data-toggle=\"tooltip\" data-original-title='" + this.options.helpText.value + "' title='" + this.options.helpText.value +"'><i class='fa fa-question-circle'></i></a>");
        $label.append($helpButton);
      }
      switch (this.options.showLable.value) {
        case "true":
          $label.show();
          break;
        case "printOrMobile":
          $label.hide();
          $label.addClass("printOrMobile");
          break;
        case "false":
          $label.hide();
          break;

        default:
          break;
      }
      if (this.options.label.value === "") $label.hide();
    } else {
      labelText = this.options.label.value;
      $label.html(labelText + "<span style='color: lightgrey; font-size: 0.7em;'> - " + this.options.apibind.value);
    }

    var inputName = this.options.apibind.value === "" ? this.getId() : this.options.apibind.value;
    if (this.inputdata.hasOwnProperty(inputName) === false) {
      this.inputdata[inputName] = null;
    }
    var $select = $('<select>');
    $select.addClass("form-control");
    $select.prop("name", inputName);
    if (this.options.multipleselect.value == 1) {
      $select.prop("multiple", true);
      //$select.prop("name",inputName+"[]");
    } else {
      $select.prop("multiple", null);
    }

    $select.attr("title", this.options.label.value);
    $select.attr("rel", "txtTooltip");

    var $dropdown = $('<option>');
    $dropdown.text("-");
    $dropdown.val("");
    $select.append($dropdown);


    var thisRef = this;
    if (this.options.dataURL.value && this.options.dataURL.value != "" && this.options.dataURL.value != "url") {

      $.getJSON(this.options.dataURL.value, function (data) {
        if(thisRef.options.dataAttribute.value && thisRef.options.dataAttribute.value != "") {
          data = data[thisRef.options.dataAttribute.value];
        }
        for (var i = 0; i < data.length; i++) {
          var coptions = data[i];
          var value = coptions.value_name;

          var $dropdown = $('<option>');
          $dropdown.text(coptions.value_text);
          $dropdown.val(value);

          if (thisRef.options.multipleselect.value == 1) {
            for (var x in thisRef.inputdata[inputName]) {
              if (value + "" == "" + thisRef.inputdata[inputName][x]) {
                $dropdown.attr("selected", true);
              }
            }

          } else {
            if (value + "" == "" + thisRef.inputdata[inputName]) {
              $dropdown.attr("selected", true);
            }
          }
          $select.append($dropdown);
        }
        (function (thisRef, _inputName, _value) {
          $('body').off("change", '[name="' + _inputName + '"]');
          $('body').on("change", '[name="' + _inputName + '"]', function () {
            thisRef.inputdata[_inputName] = $(this).val();
            thisRef.setChanged();
            document.dispatchEvent(thisRef.topparent.formevents.updateFormDataEvent);

          });
        }(thisRef, inputName, value));

      });

      var formGroup = $("<div class='form-group'>");
      formGroup.append($select);
      this.$ele.append(formGroup);

      this.changed = false;
    }
  };

  this.addElement("Auswahl 1");
  this.addElement("Auswahl 2");

}

function C_Option(value, type, editname, valuetag) {

  this.valuetag = valuetag || "-";
  this.value = value;
  this.type = type;
  this.editname = editname;
  this.editmode = C_Option.prototype.MODE_NORMAL;
}

function R_Option(type, show, statementsNeeded, rules) {

  this.type = type;
  this.show = show;
  this.statementsNeeded = statementsNeeded;
  this.rules = rules;

  this.editmode = C_Option.prototype.MODE_NORMAL;
}

function R_Condition(condition, data1, data2, operator) {
  this.condition = condition || "IF";
  this.data1 = data1 || "DATA";
  this.data2 = data2 || "DATA";
  this.operator = operator || "==";
  this.type = C_Option.prototype.TYPE_CONDITION;
  this.editmode = C_Option.prototype.MODE_NORMAL;
}

C_Option.prototype.TYPE_TEXT = "text";
C_Option.prototype.TYPE_DATAFIELD = "datafield";
C_Option.prototype.TYPE_INT = "int";
C_Option.prototype.TYPE_BIGTEXT = "bigtext";
C_Option.prototype.TYPE_BIGPLAINTEXT = "bigplaintext";
C_Option.prototype.TYPE_INPUTTYPE = "inputtype";
C_Option.prototype.TYPE_SHOWLABLE = "showlable";
C_Option.prototype.TYPE_INPUTBOOL = "inputbool";
C_Option.prototype.TYPE_MULTIOPTION = "radiooption";
C_Option.prototype.TYPE_SELECTOPTION = "selectoption";
C_Option.prototype.TYPE_ADDRESSTYPESELECT = "addresstypeselect";
C_Option.prototype.TYPE_ROW = "row";
C_Option.prototype.TYPE_CONDITION = "rowCondition";
C_Option.prototype.TYPE_ROWSHOW = "rowShow";
C_Option.prototype.TYPE_ROWMATCHES = "rowMatches";
C_Option.prototype.MODE_NORMAL = 1;
C_Option.prototype.MODE_ADVANCED = 2;
C_Option.prototype.MODE_HIDDEN = 3;
FormPage.prototype.MODE_EDIT = "edit";
FormPage.prototype.MODE_PREVIEW = "preview";
FormPage.prototype.MODE_LIVE = "live";
FormPage.prototype.MODE_STRUCTURE = "structure";


//CONSTANTS
function Server() {
}

Server.post = function (action, data, success) {

  if (data == null) {
    data = {};
  }
  data.action = action;
  $.post("server.php", data, function (resp) {
    success(resp);
  }, "json");
};
Server.ACTIONS = {
  getForm: "getForm",
  getForms: "getForms",
  getFormData: "getFormData",
  getTemplateList: "getTemplateList",
  getDataFields: "getDataFields",
  setFormsOrder: "setFormsOrder",
  newForm: "newForm",
  editForm: "editForm",
  saveForm: "saveForm",
  saveFormData: "saveFormData"
};

$.fn.isFullOnScreen = function(){

  var win = $(window);

  var viewport = {
    top : win.scrollTop(),
    left : win.scrollLeft()
  };
  viewport.right = viewport.left + win.width();
  viewport.bottom = viewport.top + win.height();

  var bounds = this.offset();
  bounds.right = bounds.left + this.outerWidth();
  bounds.bottom = bounds.top + this.outerHeight();

  console.log("Viewport: ");
  console.table(viewport);
  console.log("Bounds: ");
  console.table(bounds);

  return (viewport.bottom > bounds.bottom && viewport.top < bounds.top);

};
