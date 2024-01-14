import Image from 'next/image';

import loadingIcon from '../../public/loading.svg';

export default function Loading() {
  return <Image priority src={loadingIcon} alt="loading icon" />;
}
