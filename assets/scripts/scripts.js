var Tooltip = /** @class */ (function () {
    function Tooltip() {
    }
    return Tooltip;
}());
var ProjectItem = /** @class */ (function () {
    function ProjectItem(id) {
        this.id = id;
    }
    ;
    ProjectItem.prototype.connectSwithButton = function () {
        var projectItemElement = document === null || document === void 0 ? void 0 : document.getElementById(this.id);
        var switchBtn = projectItemElement === null || projectItemElement === void 0 ? void 0 : projectItemElement.querySelector('button:last-of-type');
    };
    ProjectItem.prototype.connectMoreInfoButton = function () { };
    return ProjectItem;
}());
var ProjectList = /** @class */ (function () {
    function ProjectList(type) {
        this.projects = [];
        var prjItems = document.querySelectorAll("#".concat(type, "-projects li"));
        for (var _i = 0, _a = prjItems; _i < _a.length; _i++) {
            var prjItem = _a[_i];
            this.projects.push(new ProjectItem(prjItem.id));
        }
        console.log(this.projects);
    }
    return ProjectList;
}());
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.init = function () {
        console.log('Start');
        var activeProjectList = new ProjectList('active');
        var finishedProjectList = new ProjectList('finished');
    };
    return App;
}());
var app = new App();
app.init();
