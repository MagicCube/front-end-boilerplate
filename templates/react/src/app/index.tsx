import styles from './index.module.less';

export function App() {
  return (
    <div className={styles.container}>
      <h1>Hello, {{name}}!</h1>
    </div>
  );
}
