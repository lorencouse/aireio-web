import Image from 'next/image';
const Logo = (props: { width: number; height: number }) => (
  <div className="bg-white rounded-full p-2">
    <Image
      src="/images/logo.png"
      alt="Logo"
      width={props.width}
      height={props.height}
    
    />
  </div>
);

export default Logo;
