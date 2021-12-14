import { css, FC, jsx } from 'alumina';
import { Counter } from '~/components/atoms/Counter';

type Props = {
  userName: string;
};
export const UserCard: FC<Props> = ({ userName }) => (
  <div class={style}>
    {userName}
    <Counter />
  </div>
);

const style = css`
  border: solid 4px #f80;
  width: 200px;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
