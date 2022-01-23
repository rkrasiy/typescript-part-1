class DOMHelper {
  static clearEventListener(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }
  static moveElement(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newDestinationSelector);
    destinationElement.append(element)
  }
}


class Component {
  constructor(hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElementId = document.getElementById(hostElementId);
    } else {
      this.hostElementId = document.body;
    }
    this.insertBefore = insertBefore;
  }
  detach = () => {
    if (this.element) {
      this.element.remove();
    }
  }
  attach() {
    this.hostElementId.insertAdjacentElement(this.insertBefore ? 'afterbegin' : 'beforeend', this.element)
  }
}


class Tooltip extends Component {
  constructor(closeNotefierFn) {
    super();
    this.closeNotifier = closeNotefierFn;
    this.render();
  }
  closeTooltip = () => {
    this.detach();
  }

  render() {
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'card';
    tooltipElement.textContent = 'Dummy';
    tooltipElement.addEventListener('click', this.closeTooltip);
    this.element = tooltipElement;
  }

}

class ProjectItem {

  hasActiveTooltip = false;

  constructor(id, updateProjectListFunction, type) {
    this.id = id;
    this.updateProjectListHandler = updateProjectListFunction;
    this.connectMoreInfoButton();
    this.connectSwithButton(type);
  };



  connectSwithButton(type) {
    const projectItemElement = document?.getElementById(this.id);
    let switchBtn = projectItemElement?.querySelector('button:last-of-type');
    switchBtn = DOMHelper.clearEventListener(switchBtn);
    switchBtn.textContent = type === 'active' ? 'Finish' : 'Active';
    switchBtn?.addEventListener('click', this.updateProjectListHandler.bind(null, this.id));
  }

  showMoreInfoHandler() {
    if (this.hasActiveTooltip) return
    const tooltip = new Tooltip(() => { this.hasActiveTooltip = false });
    tooltip.attach();
    this.hasActiveTooltip = true;
  }
  update(updateProjectListFn, type) {
    this.updateProjectListHandler = updateProjectListFn;
    this.connectSwithButton(type);
  }
  connectMoreInfoButton() {
    const projectItemElement = document?.getElementById(this.id);
    const moreInfoBtn = projectItemElement.querySelector('button:first-of-type');
    moreInfoBtn.addEventListener('click', this.showMoreInfoHandler)
  }
}

class ProjectListItems {
  projects = [];
  constructor(type) {
    this.type = type;
    const prjItems = document.querySelectorAll(`#${type}-projects li`);
    for (const prjItem of prjItems) {
      this.projects.push(new ProjectItem(prjItem.id, this.switchProject.bind(this), this.type));
    }
  }

  setSwitchHandlerFunction(fn) {
    this.switchHandler = fn;
  }
  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProject.bind(this), this.type)
  }
  switchProject(projectId) {
    this.switchHandler(this.projects.find(p => p.id === projectId))
    this.projets = this.projects.filter(p => p.id !== projectId)
  }
}


class App {
  static init() {
    const activeProject = new ProjectListItems('active');
    const finishedProjectList = new ProjectListItems('finished');
    activeProject.setSwitchHandlerFunction(finishedProjectList.addProject.bind(finishedProjectList));

    finishedProjectList.setSwitchHandlerFunction(activeProject.addProject.bind(activeProject))
  }
}

App.init();