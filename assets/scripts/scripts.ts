class Tooltip {

}

class ProjectItem {
  id: string
  constructor(id: string) {
    this.id = id;
  };

  connectSwithButton(): void {
    const projectItemElement = document?.getElementById(this.id);
    const switchBtn = projectItemElement?.querySelector('button:last-of-type');
    switchBtn?.addEventListener('click',)
  }

  connectMoreInfoButton() { }


}

type fn = (a: string) => void;

class ProjectList {
  projects: Array<any> = [];
  type: string;
  switchHandler: fn
  constructor(type: string, switchHandlerFunction: fn) {
    this.type = type;
    this.switchHandler = switchHandlerFunction;
    const prjItems: NodeListOf<Element> = document.querySelectorAll(`#${type}-projects li`);
    for (const prjItem of prjItems as any) {
      this.projects.push(new ProjectItem(prjItem.id))
    }
  }

  addProject(): void { };
  switchProject(projectId: string): void {
    this.switchHandler(this.projects.find((p));
    this.projects = this.projects.filter((p): => p.id !== projectId)
  };

}
class App {
  init(): void {
    console.log('Start');
    const activeProjectList = new ProjectList('active');
    const finishedProjectList = new ProjectList('finished')
  }
}

const app = new App();
app.init();