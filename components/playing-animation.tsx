export type PlayingAnimationProps = {
  className?: string;
};

export function PlayingAnimation(props: PlayingAnimationProps) {
  const { className = "" } = props;
  return (
    <div className="playing w-4 h-6">
      <span className={`playing-bar playing-bar1 ${className}`}></span>
      <span className={`playing-bar playing-bar2 ${className}`}></span>
      <span className={`playing-bar playing-bar3 ${className}`}></span>
    </div>
  );
}
