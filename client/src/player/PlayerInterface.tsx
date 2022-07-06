import { useContext } from "react";
import { PlayerLoginState } from "types/loginState";
import { ManagerContext } from "utils/ManagerContext";

export default function PlayerInterface({
  loginState,
}: {
  loginState: PlayerLoginState;
}) {
  // eslint-disable-next-line
  var manager = useContext(ManagerContext);

  return <>Hi {loginState.id}</>;
}
