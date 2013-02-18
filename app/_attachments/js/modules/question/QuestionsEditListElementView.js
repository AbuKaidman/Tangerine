// Generated by CoffeeScript 1.4.0
var QuestionsEditListElementView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

QuestionsEditListElementView = (function(_super) {

  __extends(QuestionsEditListElementView, _super);

  function QuestionsEditListElementView() {
    this.getSurveys = __bind(this.getSurveys, this);
    return QuestionsEditListElementView.__super__.constructor.apply(this, arguments);
  }

  QuestionsEditListElementView.prototype.className = "question_list_element";

  QuestionsEditListElementView.prototype.tagName = "li";

  QuestionsEditListElementView.prototype.events = {
    'click .edit': 'edit',
    'click .show_copy': 'showCopy',
    'change .copy_select': 'copy',
    'click .delete': 'toggleDelete',
    'click .delete_cancel': 'toggleDelete',
    'click .delete_delete': 'delete'
  };

  QuestionsEditListElementView.prototype.showCopy = function(event) {
    var $copy;
    $copy = this.$el.find(".copy_container");
    $copy.html("      Copy to <select class='copy_select'><option disabled='disabled' selected='selected'>Loading...</option></select>    ");
    return this.getSurveys();
  };

  QuestionsEditListElementView.prototype.getSurveys = function() {
    var _this = this;
    return $.ajax({
      "url": Tangerine.settings.urlView("local", "subtestsByAssessmentId"),
      "type": "POST",
      "dataType": "json",
      "contentType": "application/json",
      "data": JSON.stringify({
        key: this.question.get("assessmentId")
      }),
      "success": function(data) {
        var row, subtests;
        subtests = _.compact((function() {
          var _i, _len, _ref, _results;
          _ref = data.rows;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            row = _ref[_i];
            _results.push(row.value.prototype === "survey" ? row.value : void 0);
          }
          return _results;
        })());
        return _this.populateSurveySelect(subtests);
      }
    });
  };

  QuestionsEditListElementView.prototype.populateSurveySelect = function(subtests) {
    var htmlOptions, subtest;
    subtests.push({
      _id: 'cancel',
      name: this.text.cancel_button
    });
    subtests.unshift({
      _id: '',
      name: this.text.select
    });
    htmlOptions = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = subtests.length; _i < _len; _i++) {
        subtest = subtests[_i];
        _results.push("<option data-subtestId='" + subtest._id + "' " + (subtest.attrs || "") + ">" + subtest.name + "</option>");
      }
      return _results;
    })()).join("");
    return this.$el.find(".copy_select").html(htmlOptions);
  };

  QuestionsEditListElementView.prototype.copy = function(event) {
    var $target, subtestId;
    $target = $(event.target).find("option:selected");
    subtestId = $target.attr("data-subtestId");
    if (subtestId === "cancel") {
      this.$el.find(".copy_container").empty();
      return;
    }
    return this.question.save({
      "_id": Utils.guid(),
      "subtestId": subtestId
    }, {
      success: function() {
        Tangerine.router.navigate("subtest/" + subtestId, true);
        return Utils.midAlert("Question copied to " + ($target.html()));
      },
      error: function() {
        return Utils.midAlert("Copy error");
      }
    });
  };

  QuestionsEditListElementView.prototype.edit = function(event) {
    this.trigger("question-edit", this.question.id);
    return false;
  };

  QuestionsEditListElementView.prototype.toggleDelete = function() {
    return this.$el.find(".delete_confirm").fadeToggle(250);
  };

  QuestionsEditListElementView.prototype["delete"] = function(event) {
    this.question.collection.remove(this.question.id);
    this.question.destroy();
    this.trigger("deleted");
    return false;
  };

  QuestionsEditListElementView.prototype.initialize = function(options) {
    this.text = {
      "edit": t("QuestionsEditListElementView.help.edit"),
      "delete": t("QuestionsEditListElementView.help.delete"),
      "copy": t("QuestionsEditListElementView.help.copy_to"),
      "cancel_button": t("QuestionsEditListElementView.button.cancel"),
      "delete_button": t("QuestionsEditListElementView.button.delete"),
      "select": t("QuestionsEditListElementView.label.select"),
      "loading": t("QuestionsEditListElementView.label.loading"),
      "delete_confirm": t("QuestionsEditListElementView.label.delete_confirm")
    };
    this.question = options.question;
    return this.$el.attr("data-id", this.question.id);
  };

  QuestionsEditListElementView.prototype.render = function() {
    this.$el.html("      <table>        <tr>          <td>            <img src='images/icon_drag.png' class='sortable_handle'>          </td>          <td>            <span>" + (this.question.get('prompt')) + "</span> <span>[<small>" + (this.question.get('name')) + ", " + (this.question.get('type')) + "</small>]</span>                        <img src='images/icon_edit.png' class='link_icon edit' title='" + this.text.edit + "'>            <img src='images/icon_copy_to.png' class='link_icon show_copy' title='" + this.text.copy + "'>            <div class='copy_container'></div>            <img src='images/icon_delete.png' class='link_icon delete' title='" + this.text["delete"] + "'><br>            <div class='confirmation delete_confirm'>              <div class='menu_box'>" + this.text.delete_confirm + "<br><button class='delete_delete command_red'>Delete</button><button class='delete_cancel command'>" + this.text.delete_button + "</button>            </div>          </td>        </tr>      </table>      ");
    return this.trigger("rendered");
  };

  return QuestionsEditListElementView;

})(Backbone.View);
