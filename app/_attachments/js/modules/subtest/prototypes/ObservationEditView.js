var ObservationEditView,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

ObservationEditView = (function(_super) {

  __extends(ObservationEditView, _super);

  function ObservationEditView() {
    ObservationEditView.__super__.constructor.apply(this, arguments);
  }

  ObservationEditView.prototype.initialize = function(options) {
    var surveyAttributes;
    this.model = options.model;
    surveyAttributes = $.extend(this.model.get('surveyAttributes'), {
      "_id": this.model.id
    });
    this.surveyModel = new Backbone.Model(surveyAttributes);
    return this.surveyView = new SurveyEditView({
      "model": this.surveyModel
    });
  };

  ObservationEditView.prototype.save = function() {
    return this.model.set({
      totalSeconds: parseInt(this.$el.find("#total_seconds").val()),
      intervalLength: parseInt(this.$el.find("#interval_length").val()),
      variableName: this.$el.find("#variable_name").val().safetyDance(),
      displayName: this.$el.find("#display_name").val().safetyDance(),
      surveyAttributes: this.surveyModel.attributes
    });
  };

  ObservationEditView.prototype.render = function() {
    var displayName, intervalLength, totalSeconds, variableName;
    totalSeconds = this.model.get("totalSeconds") || 0;
    intervalLength = this.model.get("intervalLength") || 0;
    variableName = this.model.get("variableName") || "";
    displayName = this.model.get("displayName") || "";
    this.$el.html("      <div class='label_value'>        <label for='variable_name'>Variable name</label>        <input id='variable_name' value='" + variableName + "'><br>        <label for='display_name'>Display name</label>        <input id='display_name' value='" + displayName + "'><br>        <label for='total_seconds'>Total seconds</label>        <input id='total_seconds' value='" + totalSeconds + "' type='number'>        <label for='interval_length' title='In seconds'>Interval length</label>        <input id='interval_length' value='" + intervalLength + "' type='number'>      </div>      <div id='survey_editor'></div>    ");
    this.surveyView.setElement(this.$el.find("#survey_editor"));
    return this.surveyView.render();
  };

  return ObservationEditView;

})(Backbone.View);
