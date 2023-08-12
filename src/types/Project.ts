export interface Project {
  name: string;
  template: string;
  rootPath: string;
  author: string;
  ownerType: 'personal' | 'bytedance';
  dependencies: string[];
}
