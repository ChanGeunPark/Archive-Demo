import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
};

export function CakeIcon({ width = 24, height = 24, ...rest }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...rest}>
      <path d="M4.2002 9.13647L19.8002 12.0118V19.2L4.2002 15.6974V9.13647Z" fill="#FFFACC" />
      <path d="M4.2002 14.919L19.8002 18.3815V19.1999L4.2002 15.6974V14.919Z" fill="#B79848" />
      <path d="M4.2002 9.13647L19.8002 12.0118V14.0576L4.2002 11.0054V9.13647Z" fill="#EEC401" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.98113 16.6731C3.52461 16.5706 3.2002 16.1653 3.2002 15.6974V9.13653C3.2002 8.83958 3.33217 8.5579 3.56038 8.3679C6.01934 6.48503 8.97882 5.48242 12.0232 5.48242H12.2927C12.5061 5.48242 12.7139 5.55069 12.8857 5.67724L20.3783 11.1956C20.636 11.3784 20.8002 11.6787 20.8002 12.0117V19.1999C20.8002 19.5036 20.6622 19.7909 20.4251 19.9807C20.188 20.1704 19.8775 20.2422 19.5811 20.1756L3.98113 16.6731Z"
        fill="#303338"
      />
      <path d="M19.8002 12.0118L12.2927 6.48242H12.0232C9.19453 6.48242 6.44486 7.41531 4.2002 9.13653L19.8002 12.0118Z" fill="#F3CC00" />
    </svg>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-alertMain" {...props}>
      <path d="M20 7h-1.18C19.4 5.84 18.3 5 17 5c-1.1 0-2.1.6-2.6 1.5L12 9.5 9.6 6.5C9.1 5.6 8.1 5 7 5 5.7 5 4.6 5.84 4.18 7H3c-1.1 0-2 .9-2 2v2c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V9c0-1.1-.9-2-2-2Zm-8 0V5h2v2h-2Zm8 6H4v6c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-6Z" />
    </svg>
  );
}

export function RefreshIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
      <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08a5.99 5.99 0 0 1-5.65 4c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35Z" />
    </svg>
  );
}

export function InformationIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z" />
    </svg>
  );
}

export function PlusIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z" />
    </svg>
  );
}

export function GoldTiaraIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" className={className} {...rest}>
      <path d="M2 18 8 8l6 6 6-10 6 14H2Z" />
    </svg>
  );
}

export function LevelStarterBadge({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...rest}>
      <path
        d="M10.3127 5.65122C11.0986 4.41631 12.9014 4.41631 13.6873 5.65122L15.2616 8.12494C15.4187 8.37185 15.6282 8.58127 15.8751 8.7384L18.3488 10.3127C19.5837 11.0986 19.5837 12.9014 18.3488 13.6873L15.8751 15.2616C15.6282 15.4187 15.4187 15.6282 15.2616 15.8751L13.6873 18.3488C12.9014 19.5837 11.0986 19.5837 10.3127 18.3488L8.7384 15.8751C8.58127 15.6282 8.37185 15.4187 8.12494 15.2616L5.65122 13.6873C4.41631 12.9014 4.41631 11.0986 5.65122 10.3127L8.12494 8.7384C8.37185 8.58127 8.58127 8.37185 8.7384 8.12494L10.3127 5.65122Z"
        fill="#FFC46B"
        stroke="#484C51"
      />
    </svg>
  );
}

export function Level10Badge(props: IconProps) {
  return <LevelStarterBadge {...props} />;
}
