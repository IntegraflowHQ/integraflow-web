import '../styles/globals.css';

import { onDOMReady } from '../utils';

export interface RootFrameContainer {
  name: string;
  element: HTMLDivElement;
}

export class RootFrame {
  public readonly element: HTMLDivElement;
  public readonly containers: RootFrameContainer[];
  
  constructor() {
    this.element = document.createElement('div');
    this.element.id = 'formily-container';
    this.containers = [];
    
    onDOMReady(() => document.body.appendChild(this.element));
  }
  
  createContainer(name: string) {
    const container = {
      name,
      element: document.createElement('div')
    };
    
    container.element.id = `formily-container-${name}`;
    this.element.appendChild(container.element);
    
    this.containers.push(container);
    
    return container;
  }
  
  removeContainer(name: string) {
    const idx = this.containers.findIndex(container => container.name === name);
    this.containers.splice(idx, 1);
  }
}
