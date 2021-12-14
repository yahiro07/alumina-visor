import { applyGlobalStyle, css, jsx, render } from 'alumina';
import { Counter, UserCard } from '~/components';

const AppRoot = () => {
  return (
    <div class={style}>
      hello
      <UserCard userName="yamada" />
      <Counter />
    </div>
  );
};

const style = css`
  height: 100%;
  border: solid 5px #08f;
`;

applyGlobalStyle(css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html,
  body,
  #app {
    height: 100%;
  }
`);

window.addEventListener('load', () => {
  render(() => <AppRoot />, document.getElementById('app'));
});
