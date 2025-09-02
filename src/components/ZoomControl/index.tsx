import { useState, useEffect } from "react";
import { Switch } from "../Switch/Switch";

interface ZoomControlProps {
  className?: string;
  showLabel?: boolean;
}

declare global {
  interface Window {
    zoomControl: {
      enable: () => void;
      disable: () => void;
      toggle: () => void;
      isEnabled: () => boolean;
    };
  }
}

export function ZoomControl({
  className,
  showLabel = false,
}: ZoomControlProps) {
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.zoomControl) {
      setIsZoomEnabled(window.zoomControl.isEnabled());
    }
  }, []);

  const handleZoomToggle = (enabled: boolean) => {
    if (typeof window !== "undefined" && window.zoomControl) {
      if (enabled) {
        window.zoomControl.enable();
      } else {
        window.zoomControl.disable();
      }
      setIsZoomEnabled(enabled);
    }
  };

  if (showLabel) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Switch
          id="zoom-control"
          checked={isZoomEnabled}
          onCheckedChange={handleZoomToggle}
        />
        <label htmlFor="zoom-control" className="text-sm font-medium">
          Habilitar zoom
        </label>
      </div>
    );
  }

  return (
    <Switch
      checked={isZoomEnabled}
      onCheckedChange={handleZoomToggle}
      className={className}
    />
  );
}

export default ZoomControl;
