import Image from 'next/image';
const Logo = (props: { width: number; height: number }) => (
  <Image
    src="/images/logo.png"
    alt="Logo"
    width={props.width}
    height={props.height}
  />
);

export default Logo;
