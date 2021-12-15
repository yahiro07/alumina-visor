import { FC, jsx, css } from 'alumina';

interface Props {
  spec: string;
  size?: number;
}

export const Icon: FC<Props> = ({ spec, size }) => (
  <i class={spec} css={style(size)} />
);

const style = (size?: number) => css`
  font-size: ${size ? `${size}px` : 'inherit'};
`;
