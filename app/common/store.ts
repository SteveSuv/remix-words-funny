import { atom } from "jotai";
import { ListTabType } from "./types";

export const isBooksPanelDrawerOpenAtom = atom(false);
export const isWordDetailPanelDrawerOpenAtom = atom(false);
export const isSearchBarOpenAtom = atom(false);
export const listTabAtom = atom(ListTabType.ALL);
export const isProfileModalOpenAtom = atom(false);
export const searchWordAtom = atom("");
export const isSettingModalOpenAtom = atom(false);
export const isSignInModalOpenAtom = atom(false);
export const isSignUpModalOpenAtom = atom(false);
export const isUpdatePasswordModalOpenAtom = atom(false);
export const wordDetailSlugAtom = atom("");
