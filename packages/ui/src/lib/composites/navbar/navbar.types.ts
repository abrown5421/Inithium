import { Page } from "@inithium/types";

export interface NavSlotProps {
  pages: Page[];
}

export interface NavbarSlideoutProps {
  mainPages: Page[];
  profilePages: Page[];
  isOpen: boolean;
  onClose: () => void;
}

export interface UserSlotProps {
  onAvatarClick?: () => void;
}