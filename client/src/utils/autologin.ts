import { LoginState } from "types/loginState";

export function getLoginStateFromUrl(): LoginState | null {
  var params = new URLSearchParams(window.location.search);

  var type = params.get("autologin.type");
  var code = params.get("autologin.code");

  if (
    (type === "player" || type === "board" || type === "admin") &&
    typeof code === "string"
  ) {
    return { kind: type, code: code };
  }

  return null;
}

const sessionStorageKey: string = "login";

export function getLoginStateFromSessionStorage(): LoginState | null {
  try {
    var value = window.sessionStorage.getItem(sessionStorageKey);

    if (value != null) {
      var content = JSON.parse(value);

      if (typeof content === "object" && content != null) {
        var { kind, code } = content;

        if (
          (kind === "player" || kind === "board" || kind === "admin") &&
          typeof code === "string"
        ) {
          return { kind: kind, code: code };
        }
      }
    }
  } catch (err) {
    console.error(`Failed to access session storage: ${err}`);
  }

  return null;
}

export function saveLoginStateToSessionStorage(state: LoginState) {
  try {
    window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(state));
  } catch (err) {
    console.error(`Failed to access session storage: ${err}`);
  }
}
