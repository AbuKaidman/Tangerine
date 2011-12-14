var Router;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Router = (function() {
  __extends(Router, Backbone.Router);
  function Router() {
    Router.__super__.constructor.apply(this, arguments);
  }
  Router.prototype.routes = {
    "assessment/:id": "assessment",
    "print/:id": "print",
    "student_printout/:id": "student_printout",
    "login": "login",
    "logout": "logout",
    "manage": "manage",
    "assessments": "assessments",
    "": "assessments"
  };
  Router.prototype.manage = function() {
    return $.couch.session({
      success: function(session) {
        var assessmentCollection;
        $.enumerator = session.userCtx.name;
        Tangerine.router.targetroute = document.location.hash;
        if (!session.userCtx.name) {
          Tangerine.router.navigate("login", true);
          return;
        }
        assessmentCollection = new AssessmentCollection();
        return assessmentCollection.fetch({
          success: function() {
            $("#content").html("              <h1>Manage</h1>              <button>Update Tangerine</button><br/>              <button href='/" + Tangerine.config.db_name + "/_design/tangerine-cloud/index.html'>New Assessment Wizard</button><br/>              <br/>              Existing Assessments:              <ul id='manage-assessments'></ul>            ");
            _.each($('button:contains(New Assessment Wizard)'), function(button) {
              return new MBP.fastButton(button, function(ev) {
                return document.location = $(ev.target).attr("href");
              });
            });
            _.each($('button:contains(Update Tangerine)'), function(button) {
              return new MBP.fastButton(button, function(ev) {
                var source;
                source = "http://mikeymckay.iriscouch.com/" + Tangerine.config.db_name;
                $("#content").prepend("<span id='message'>Updating from: " + source + "</span>");
                return $.couch.replicate("http://mikeymckay.iriscouch.com/" + Tangerine.config.db_name, Tangerine.config.db_name, {
                  success: function() {
                    return $("#message").html("Finished");
                  }
                });
              });
            });
            return $.couch.allDbs({
              success: function(databases) {
                return assessmentCollection.each(function(assessment) {
                  var assessmentElement, assessmentName;
                  assessmentName = assessment.get("name");
                  assessmentElement = "<li>" + assessmentName;
                  if (!_.include(databases, assessmentName.toLowerCase().dasherize())) {
                    assessmentElement += "<button>Initialize Database</button>";
                  }
                  assessmentElement += "<button style='color:gray'>Edit</button>                                        <button style='color:gray'>Delete Database</button>                                        <button style='color:gray'>Upload Data to Central Server</button>                                      </li>";
                  $("#manage-assessments").append(assessmentElement);
                  return _.each($("#manage-assessments li button:contains(Initialize Database)"), function(button) {
                    return new MBP.fastButton(button, function() {
                      return Utils.createResultsDatabase(assessment.targetDatabase);
                    });
                  });
                });
              }
            });
          }
        });
      }
    });
  };
  Router.prototype.assessments = function() {
    return $.couch.session({
      success: function(session) {
        var assessmentListView;
        $.enumerator = session.userCtx.name;
        Tangerine.router.targetroute = document.location.hash;
        $("#message").html(session.userCtx.name);
        if (!session.userCtx.name) {
          Tangerine.router.navigate("login", true);
          return;
        }
        $('#current-student-id').html("");
        $('#enumerator').html($.enumerator);
        assessmentListView = new AssessmentListView();
        return assessmentListView.render();
      }
    });
  };
  Router.prototype.login = function() {
    $("#content").html("      <form id='login-form'>        <label for='name'>Enumerator Name</label>        <input id='name' name='name'></input>        <label for='password'>Password</label>        <input id='password' type='password' name='password'></input>        <div id='message'></div>        <button type='button'>Login</button>      </form>    ");
    return new MBP.fastButton(_.last($("button:contains(Login)")), function() {
      var name, password;
      name = $('#name').val();
      password = $('#password').val();
      return $.couch.login({
        name: name,
        password: password,
        success: function() {
          $('#enumerator').html(name);
          $.enumerator = name;
          return Tangerine.router.navigate(Tangerine.router.targetroute, true);
        },
        error: function(status, error, reason) {
          $("#message").html("Creating new user");
          return $.couch.signup({
            name: name
          }, password, {
            success: function() {
              return $.couch.login({
                name: name,
                password: password,
                success: function() {
                  $('#current-name').html(name);
                  return Tangerine.router.navigate(Tangerine.router.targetroute, true);
                }
              });
            },
            error: function(status, error, reason) {
              if (error === "conflict") {
                return $("#message").html("Either you have the wrong password or '" + ($('#name').val()) + "' has already been used as a valid name. Please try again.");
              } else {
                return $("#message").html("" + error + ": " + reason);
              }
            }
          });
        }
      });
    });
  };
  Router.prototype.logout = function() {
    return $.couch.logout({
      success: function() {
        $.enumerator = null;
        $('#current-name').html("Not logged in");
        return Tangerine.router.navigate("login", true);
      }
    });
  };
  Router.prototype.assessment = function(id) {
    return $.couch.session({
      success: function(session) {
        $.enumerator = session.userCtx.name;
        Tangerine.router.targetroute = document.location.hash;
        if (!session.userCtx.name) {
          Tangerine.router.navigate("login", true);
          return;
        }
        $('#enumerator').html($.enumerator);
        console.log("AFSA");
        return Assessment.load(id, function(assessment) {
          return assessment.render();
        });
      }
    });
  };
  Router.prototype.print = function(id) {
    return Assessment.load(id, function(assessment) {
      return assessment.toPaper(function(result) {
        var style;
        style = "          body{            font-family: Arial;          }          .page-break{            display: block;            page-break-before: always;          }          input{            height: 50px;              border: 1px          }        ";
        $("body").html(result);
        return $("link").remove();
      });
    });
  };
  Router.prototype.student_printout = function(id) {
    return Assessment.load(id, function(assessment) {
      return assessment.toPaper(function(result) {
        var style;
        style = "          <style>            body{              font-family: Arial;              font-size: 200%;            }            .page-break{              display: none;            }            input{              height: 50px;                border: 1px;            }            .subtest.ToggleGridWithTimer{              page-break-after: always;              display:block;              padding: 15px;            }            .subtest, button, h1{              display:none;            }            .grid{              display: inline;              margin: 5px;            }          </style>        ";
        $("style").remove();
        $("body").html(result + style);
        $("span:contains(*)").parent().remove();
        $("link").remove();
        return $('.grid').each(function(index) {
          if (index % 10 === 0) {
            return $(this).nextAll().andSelf().slice(0, 10).wrapAll('<div class="grid-row"></div>');
          }
        });
      });
    });
  };
  return Router;
})();
Tangerine.router = new Router();
Backbone.history.start();