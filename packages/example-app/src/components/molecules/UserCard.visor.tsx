import { jsx } from 'alumina';
import { UserCard } from '~/components/molecules/UserCard';

export default {
  default: () => <UserCard userName="yamada" />,
  longName: () => (
    <UserCard userName="foo bar buzz nantoka kantoka are kore sore dore" />
  ),
};
