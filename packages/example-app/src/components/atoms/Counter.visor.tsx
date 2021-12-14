import { jsx } from 'alumina';
import { Counter } from '~/components/atoms/Counter';

export default {
  default: () => <Counter />,
  twoStep: () => <Counter step={2} />,
  fixed: <Counter />,
};
