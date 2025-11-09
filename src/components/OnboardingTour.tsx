import { memo, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  title: string;
  description: string;
  target?: string; // CSS selector for the element to highlight
  position: "top" | "bottom" | "left" | "right" | "center";
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to Jin!",
    description: "Let's take a quick tour of the key features. This will only take a minute.",
    position: "center",
  },
  {
    title: "Issues Panel",
    description: "This panel shows any configuration issues like missing keys, duplicates, or parse errors. When everything looks good, you'll see a celebration message!",
    target: ".issues-panel",
    position: "right",
  },
  {
    title: "Config Matrix",
    description: "See all your config keys across different files at a glance. Click the eye icon to reveal masked secrets, or click the copy icon to copy values.",
    target: ".config-matrix",
    position: "left",
  },
  {
    title: "Search & Filter",
    description: "Use the search bar to quickly find specific keys. You can also toggle which file columns to show using the Columns button.",
    target: ".search-bar",
    position: "bottom",
  },
  {
    title: "Export Options",
    description: "Export your config as a template in .env, JSON, or YAML format. Perfect for sharing with your team or creating examples.",
    target: ".export-button",
    position: "top",
  },
  {
    title: "File Watching",
    description: "Toggle the eye icon in the header to enable automatic rescanning when your config files change. Perfect for development workflows! When enabled, Jin will watch for changes and update automatically.",
    position: "center",
  },
  {
    title: "Keyboard Shortcuts",
    description: "Use Cmd/Ctrl+O to open a folder, Cmd/Ctrl+R to rescan, and Cmd/Ctrl+E to export. Check the About dialog for more shortcuts!",
    position: "center",
  },
];

export const OnboardingTour = memo(function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  useEffect(() => {
    if (!isOpen || !step.target) {
      return;
    }

    const updatePosition = () => {
      const targetElement = document.querySelector(step.target!);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 200;
      const padding = 20;
      const viewportPadding = 10; // Padding from viewport edges

      let top = 0;
      let left = 0;

      switch (step.position) {
        case "right":
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + padding;
          break;
        case "left":
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - padding;
          break;
        case "top":
          top = rect.top - tooltipHeight - padding;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case "bottom":
          top = rect.bottom + padding;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
      }

      // Ensure tooltip stays within viewport bounds
      const maxLeft = window.innerWidth - tooltipWidth - viewportPadding;
      const maxTop = window.innerHeight - tooltipHeight - viewportPadding;

      // Clamp horizontal position
      if (left < viewportPadding) {
        left = viewportPadding;
      } else if (left > maxLeft) {
        left = maxLeft;
      }

      // Clamp vertical position
      if (top < viewportPadding) {
        top = viewportPadding;
      } else if (top > maxTop) {
        top = maxTop;
      }

      setTooltipPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isOpen, step.target, step.position, currentStep]);

  const handleNext = () => {
    if (isLastStep) {
      handleClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  if (!isOpen) return null;

  // Center positioned tooltips
  if (step.position === "center") {
    return (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 z-[100] animate-in fade-in duration-300" onClick={handleClose} />

        {/* Centered tooltip */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] animate-in zoom-in duration-300">
          <div className="bg-card border border-border rounded-lg shadow-2xl p-6 w-[400px]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              <button
                onClick={handleClose}
                className="ml-2 p-1 rounded hover:bg-muted transition-colors"
                aria-label="Close tour"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-1 mb-4">
              {TOUR_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    idx === currentStep ? "bg-primary" : idx < currentStep ? "bg-primary/50" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <Button onClick={handlePrevious} variant="outline" size="sm" className="gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button onClick={handleNext} size="sm" className="gap-1">
                  {isLastStep ? "Finish" : "Next"}
                  {!isLastStep && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Positioned tooltips with highlight
  return (
    <>
      {/* Backdrop with cutout effect */}
      <div className="fixed inset-0 bg-black/50 z-[100] animate-in fade-in duration-300" onClick={handleClose} />

      {/* Highlight ring around target */}
      {step.target && (() => {
        const targetElement = document.querySelector(step.target);
        if (!targetElement) return null;
        const rect = targetElement.getBoundingClientRect();
        return (
          <div
            className="fixed z-[101] border-2 border-primary rounded-lg animate-in fade-in duration-300 pointer-events-none"
            style={{
              top: rect.top - 4,
              left: rect.left - 4,
              width: rect.width + 8,
              height: rect.height + 8,
            }}
          />
        );
      })()}

      {/* Tooltip */}
      <div
        className="fixed z-[102] animate-in zoom-in duration-300"
        style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
      >
        <div className="bg-card border border-border rounded-lg shadow-2xl p-5 w-[320px]">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-snug">{step.description}</p>
            </div>
            <button
              onClick={handleClose}
              className="ml-2 p-1 rounded hover:bg-muted transition-colors"
              aria-label="Close tour"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-1 mb-3">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  idx === currentStep ? "bg-primary" : idx < currentStep ? "bg-primary/50" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip tour
            </button>
            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <Button onClick={handlePrevious} variant="outline" size="sm" className="gap-1 h-8 text-xs">
                  <ArrowLeft className="h-3 w-3" />
                  Back
                </Button>
              )}
              <Button onClick={handleNext} size="sm" className="gap-1 h-8 text-xs">
                {isLastStep ? "Finish" : "Next"}
                {!isLastStep && <ArrowRight className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
