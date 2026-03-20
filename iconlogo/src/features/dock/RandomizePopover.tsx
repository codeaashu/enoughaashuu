import { Button, Label, Popover, Switch, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { randomizeLogo } from "#/commands/logo/randomize-logo";
import { trackEvent } from "#/lib/analytics";
import { useLogoStore } from "#/store/logo-store";

export function RandomizePopover() {
  const textMode = useLogoStore((s) => s.present.textMode);
  const [diceRotation, setDiceRotation] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [randomizeIcon, setRandomizeIcon] = useState(true);
  const [randomizeIconColor, setRandomizeIconColor] = useState(true);
  const [randomizeBackground, setRandomizeBackground] = useState(true);
  const [randomizeFont, setRandomizeFont] = useState(true);
  const [randomizeFontColor, setRandomizeFontColor] = useState(true);

  const nothingSelected = custom && !randomizeBackground && (textMode ? (!randomizeFont && !randomizeFontColor) : (!randomizeIcon && !randomizeIconColor));

  const runRandomize = () => {
    setDiceRotation((r) => r + 360);
    if (!custom) {
      void randomizeLogo({ smart: true });
      trackEvent("randomize logo", { mode: "smart", text_mode: textMode });
    } else {
      if (nothingSelected) return;
      void randomizeLogo({
        icon: !textMode && randomizeIcon,
        iconColor: textMode ? randomizeFontColor : randomizeIconColor,
        background: randomizeBackground,
        font: textMode && randomizeFont,
      });
      trackEvent("randomize logo", {
        mode: "custom",
        text_mode: textMode,
        ...(textMode
          ? { font_style: randomizeFont, font_color: randomizeFontColor, background: randomizeBackground }
          : { icon: randomizeIcon, icon_color: randomizeIconColor, background: randomizeBackground }),
      });
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center rounded-2xl border border-border bg-surface/90 px-2 py-2 shadow-xl backdrop-blur-xl"
    >
      <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <Tooltip.Trigger tabIndex={-1}>
            <Popover.Trigger tabIndex={-1}>
              <Button
                isIconOnly
                variant="ghost"
                aria-label="Open randomize options"
                data-tour="randomize-button"
              >
                <motion.span
                  animate={{ rotate: diceRotation }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ display: "inline-flex" }}
                >
                  <Icon icon="lucide:dice-5" width={16} height={16} />
                </motion.span>
              </Button>
            </Popover.Trigger>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p className="text-xs">Randomize</p>
          </Tooltip.Content>
        </Tooltip>

        <Popover.Content placement="top">
          <Popover.Dialog>
            <div className="flex w-56 flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Custom</Label>
                  <p className="text-xs text-muted">Pick what to randomize</p>
                </div>
                <Switch isSelected={custom} onChange={setCustom}>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch>
              </div>

              {custom && (
                <>
                  <div className="h-px bg-border" />
                  {textMode ? (
                    <>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted">Font Style</Label>
                        <Switch isSelected={randomizeFont} onChange={setRandomizeFont}>
                          <Switch.Control><Switch.Thumb /></Switch.Control>
                        </Switch>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted">Font Color</Label>
                        <Switch isSelected={randomizeFontColor} onChange={setRandomizeFontColor}>
                          <Switch.Control><Switch.Thumb /></Switch.Control>
                        </Switch>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted">Background Color</Label>
                        <Switch isSelected={randomizeBackground} onChange={setRandomizeBackground}>
                          <Switch.Control><Switch.Thumb /></Switch.Control>
                        </Switch>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted">Icon</Label>
                        <Switch isSelected={randomizeIcon} onChange={setRandomizeIcon}>
                          <Switch.Control><Switch.Thumb /></Switch.Control>
                        </Switch>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted">Icon Color</Label>
                        <Switch isSelected={randomizeIconColor} onChange={setRandomizeIconColor}>
                          <Switch.Control><Switch.Thumb /></Switch.Control>
                        </Switch>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted">Background Color</Label>
                        <Switch isSelected={randomizeBackground} onChange={setRandomizeBackground}>
                          <Switch.Control><Switch.Thumb /></Switch.Control>
                        </Switch>
                      </div>
                    </>
                  )}
                </>
              )}

              <Button
                size="sm"
                onPress={runRandomize}
                isDisabled={nothingSelected}
                className="w-full"
              >
                Randomize
              </Button>
            </div>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </motion.div>
  );
}
