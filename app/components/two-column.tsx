export type TwoColumnProps = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export function TwoColumn(props: TwoColumnProps) {
  return (
    <div
      className={`flex flex-col md:flex-row-reverse justify-end p-4 md:px-8 gap-4 lg:gap-16`}
    >
      <div className="w-full md:w-5/12 xl:w-4/12 hidden md:block">
        <div className="flex flex-col gap-4 sticky top-16 py-4">
          {props.right}
        </div>
      </div>
      <div className="w-full md:w-7/12 xl:w-8/12">{props.left}</div>
    </div>
  );
}
