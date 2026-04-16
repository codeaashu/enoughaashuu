import { LogoGithub } from "@gravity-ui/icons";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const FEEDBACK_URL = "https://x.com/warrioraashuu";
const ICECREAM_URL = "https://buymeacoffee.com/aashuu";
const WEBSITE_URL = "https://enough.aashuu.tech/";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

export function FABs() {
  const [websiteHovered, setWebsiteHovered] = useState(false);

  return (
    <motion.div
      variants={containerVariants}
      initial={false}
      animate="visible"
      className="pointer-events-auto absolute bottom-4 left-4 z-20 flex flex-col items-start gap-2"
    >
      <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <a href={FEEDBACK_URL} target="_blank" rel="noreferrer" data-umami-event="click x link">
              <Button variant="ghost" isIconOnly aria-label="Follow on X">
                <Icon icon="simple-icons:x" width={12} height={12} />
              </Button>
            </a>
          </Tooltip.Trigger>
          <Tooltip.Content placement="left">
            <p>Follow on X</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div>

      {/* <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <a href={DISCORD_URL} target="_blank" rel="noreferrer" data-umami-event="click discord link">
              <Button variant="ghost" isIconOnly aria-label="Discord">
                <Icon icon="simple-icons:discord" width={12} height={12} />
              </Button>
            </a>
          </Tooltip.Trigger>
          <Tooltip.Content placement="left">
            <p>Share your feedback</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div> */}

      {/* <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" data-umami-event="click youtube link">
              <Button variant="ghost" isIconOnly aria-label="YouTube">
                <Icon icon="simple-icons:youtube" width={12} height={12} />
              </Button>
            </a>
          </Tooltip.Trigger>
          <Tooltip.Content placement="left">
            <p>YouTube</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div> */}

      <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <a
              href="https://github.com/codeaashu/enoughaashuu"
              target="_blank"
              rel="noreferrer"
              data-umami-event="click github link"
            >
              <Button variant="ghost" isIconOnly aria-label="Star on GitHub">
                <LogoGithub />
              </Button>
            </a>
          </Tooltip.Trigger>
          <Tooltip.Content placement="left">
            <p>Star on GitHub</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noreferrer"
              data-umami-event="click enough website"
              onMouseEnter={() => setWebsiteHovered(true)}
              onMouseLeave={() => setWebsiteHovered(false)}
            >
              <Button isIconOnly variant="ghost" aria-label="Open Enough Aashuu website">
                <Image
                  src="/enough.webp"
                  alt="enough aashuu"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full"
                />
              </Button>
            </a>
          </Tooltip.Trigger>
          <Tooltip.Content placement="left">
            <p>{websiteHovered ? "Visit enough.aashuu.tech" : "Open website"}</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <a href={ICECREAM_URL} target="_blank" rel="noreferrer" data-umami-event="click icecream link">
              <Button variant="outline" aria-label="Support on Buy Me a Coffee">
                <Image
                  src="/Soft Ice Cream.webp"
                  alt="Icecream"
                  width={12}
                  height={12}
                  className="h-3 w-3"
                />
                Fuel my icecream obsession
              </Button>
            </a>
          </Tooltip.Trigger>
          <Tooltip.Content placement="left">
            <p>Support with icecream</p>
          </Tooltip.Content>
        </Tooltip>
      </motion.div>

    </motion.div>
  );
}
