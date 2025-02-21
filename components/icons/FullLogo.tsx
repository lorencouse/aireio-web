import Image from 'next/image';
const FullLogo = (props: { width: number; height: number }) => (
  <Image
    src="/images/aireio-logo-full.jpg"
    alt="aireio Full Logo"
    width={props.width}
    height={props.height}
    className="object-contain rounded-full"
  />
);

export default FullLogo;
