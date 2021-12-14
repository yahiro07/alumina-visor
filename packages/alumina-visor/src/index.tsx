import {
  applyGlobalStyle,
  css,
  FC,
  jsx,
  render,
  useEffect,
  useLocal,
} from 'alumina';
import { FlatListSelector } from './FlatListSelector';
import visorEnumeratedEntries from './visorEnumeratedEntries';

type IVisualEntry = Record<string, FC | JSX.Element>;

const visualSource: Record<string, IVisualEntry> = visorEnumeratedEntries;

const visualOptions = Object.keys(visualSource).map((it) => ({
  value: it,
  label: it.replace(/Examples$/, ''),
}));

export const ComponentCatalogPage: FC = () => {
  const local = useLocal({
    selectedVisualKey: '',
  });

  const currentVisual = visualSource[local.selectedVisualKey || ''];

  useEffect(() => {
    const storageKey = 'component-catalog-selected-component-key';
    const key = localStorage.getItem(storageKey);
    if (key) {
      local.selectedVisualKey = key;
    }
    return () => localStorage.setItem(storageKey, local.selectedVisualKey);
  }, []);

  return (
    <div css={style}>
      <div className="selection-area">
        <h3>Components</h3>
        <FlatListSelector
          className="visual-selector"
          options={visualOptions}
          value={local.selectedVisualKey}
          setValue={(value) => (local.selectedVisualKey = value)}
          size={30}
        />
      </div>
      <div className="preview-area">
        {currentVisual && (
          <div className="preview-content">
            {Object.entries(currentVisual).map(([key, value]) => (
              <div className="row" key={key}>
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
    width: 240px;
    flex-shrink: 0;
    background: #ccc;
    padding: 15px;

    h3 {
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
