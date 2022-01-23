class Component {
  constructor(hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElement = document.getElementById(hostElementId);
    } else {
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
  }
  detach = () => {
    if (this.element) {
      this.element.remove();
    }
  }
  attach() {
    this.hostElement.insertAdjacentElement(this.insertBefore ? 'afterbegin' : 'beforeend', this.element)
  }
}


class Tooltip extends Component {
  constructor(fn, text, hostElementId) {
    super(hostElementId);
    this.closeNotifier = fn;
    this.text = text;
    this.render();
  }
  closeTooltip = () => {
    this.detach();
    this.closeNotifier();
  }

  render() {
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'card';
    const tooltipTemplate = document.getElementById('tooltip');
    const tooltipBody = document.importNode(tooltipTemplate.content, true);
    tooltipBody.querySelector('p').textContent = this.text;
    tooltipElement.append(tooltipBody)

    const hostElPosLeft = this.hostElement.offsetLeft;
    const hostElPosTop = this.hostElement.offsetTop;
    const hostElHeight = this.hostElement.clientHeight;
    const parentElementScrolling = this.hostElement.parentElement.scrollTop;

    const x = hostElPosLeft + 20;
    const y = hostElPosTop + hostElHeight - parentElementScrolling - 10;
    tooltipElement.style.position = 'absolute';
    tooltipElement.style.left = x + 'px';
    tooltipElement.style.top = y + 'px';

    tooltipElement.addEventListener('click', this.closeTooltip);
    this.element = tooltipElement;
  }

}

class DOMHelper {
  static clearEventListener(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }
  static moveElement(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newDestinationSelector);
    destinationElement.append(element);
    element.scrollIntoView({ behavior: 'smooth' });
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
    if (this.hasActiveTooltip) return;
    const projectElement = document.getElementById(this.id);
    const tooltipText = projectElement.dataset.extraInfo;
    const tooltip = new Tooltip(() => {
      this.hasActiveTooltip = false
    },
      tooltipText,
      this.id);
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
    moreInfoBtn.addEventListener('click', this.showMoreInfoHandler.bind(this))
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

    finishedProjectList.setSwitchHandlerFunction(activeProject.addProject.bind(activeProject));

    document.getElementById('start-analytics-btn').addEventListener('click', this.startAnalitics);
  }
  static startAnalitics() {
    const analiticsScript = document.createElement('script');
    analiticsScript.src = 'assets/scripts/analytic.js';
    analiticsScript.defer = true;
    document.head.append(analiticsScript);
  }
}

App.init();