import {
  applyGlobalStyle,
  css,
  FC,
  jsx,
  render,
  useEffect,
  useState,
} from 'alumina';
import { FlatListSelector } from './FlatListSelector';
import visorEnumeratedEntries from './visorEnumeratedEntries';

type IVisualEntry = Record<string, FC | JSX.Element>;

const visualSource: Record<string, IVisualEntry> = visorEnumeratedEntries;

const visualOptions = Object.keys(visualSource).map((it) => ({
  value: it,
  label: it.replace(/Examples$/, ''),
}));

const storageKey = 'alumina-visor-selected-component-key';

export const ComponentCatalogPage: FC = () => {
  const [selectedVisualKey, setSelectedVisualKeyInternal] = useState('');

  const setSelectedVisualKey = (key: string) => {
    setSelectedVisualKeyInternal(key);
    localStorage.setItem(storageKey, key);
  };

  const currentVisual = visualSource[selectedVisualKey || ''];

  useEffect(() => {
    const key = localStorage.getItem(storageKey);
    if (key) {
      setSelectedVisualKey(key);
    }
  }, []);

  return (
    <div class={style}>
      <div class="selection-area">
        <h2>VISOR</h2>
        <h3>Components</h3>
        <FlatListSelector
          class="visual-selector"
          options={visualOptions}
          value={selectedVisualKey}
          setValue={setSelectedVisualKey}
          size={30}
        />
      </div>
      <div class="preview-area">
        {currentVisual && (
          <div class="preview-content">
            {Object.entries(currentVisual).map(([key, value]) => (
              <div class="row" key={key}>
                {typeof value === 'function' ? value({}) : value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const style = css`
  height: 100%;
  display: flex;

  > .selection-area {
    width: 280px;
    flex-shrink: 0;
    background: #ccc;
    padding: 7px;

    h3 {
      margin-top: 5px;
      font-size: 18px;
    }

    > .visual-selector {
      margin-top: 5px;
      width: 100%;
      outline: none;
    }
  }

  > .preview-area {
    flex-grow: 1;
    background: #f0f0f0;
    /* background: #444; */
    padding: 20px;

    > .preview-content {
      > * + * {
        margin-top: 20px;
      }
      > .row {
        display: flex;
      }
    }
  }
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
  const appDiv = document.createElement('app');
  appDiv.id = 'app';
  document.body.appendChild(appDiv);
  render(() => <ComponentCatalogPage />, appDiv);
});
