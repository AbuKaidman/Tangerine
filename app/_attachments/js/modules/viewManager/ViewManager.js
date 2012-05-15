var ViewManager,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

ViewManager = (function(_super) {

  __extends(ViewManager, _super);

  function ViewManager() {
    ViewManager.__super__.constructor.apply(this, arguments);
  }

  ViewManager.prototype.show = function(view) {
    var _ref,
      _this = this;
    window.scrollTo(0, 0);
    if ((_ref = this.currentView) != null) _ref.close();
    this.currentView = view;
    this.currentView.on("rendered", function() {
      $("#content").append(_this.currentView.el);
      return $("#content .richtext").cleditor();
    });
    return this.currentView.render();
  };

  return ViewManager;

})(Backbone.View);
