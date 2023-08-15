import { twMerge } from "tailwind-merge";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container(props: ContainerProps) {
  return (
    <div className={twMerge("max-w-5xl mx-auto relative", props.className)}>
      {props.children}
    </div>
  );
}
