import { Button } from "@nextui-org/react";
import { useSetAtom } from "jotai";
import { isSignInModalOpenAtom } from "./SignInModal";

export const SignInButton = () => {
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);

  return (
    <Button
      variant="bordered"
      color="primary"
      onPress={() => setIsSignInModalOpen(true)}
    >
      请登录
    </Button>
  );
};
