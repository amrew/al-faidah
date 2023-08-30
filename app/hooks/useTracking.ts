import ReactGA from "react-ga4";

export function useTracking() {
  const trackCategory = (category: string) => {
    const trackEvent = (params: {
      action: string;
      label?: string;
      value?: number;
    }) => {
      ReactGA.event({
        category: category,
        action: params.action,
        label: params.label,
        value: params.value,
      });
    };
    return trackEvent;
  };
  return { trackCategory };
}
