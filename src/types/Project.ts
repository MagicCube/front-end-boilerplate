export interface Project {
  name: string;
  template: 'react' | 'node';
  rootPath: string;
  author: string;
  ownerType: 'personal' | 'bytedance';
}
