import { css, FC, jsx, useState } from 'alumina';

type Props = {
  step?: number;
};

export const Counter: FC<Props> = ({ step = 1 }) => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + step);
  return (
    <div class={style} onClick={increment}>
      {count}
    </div>
  );
};

const style = css`
  min-width: 40px;
  height: 40px;
  border: solid 2px blue;
`;
