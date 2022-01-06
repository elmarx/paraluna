with import <nixpkgs> {};
mkShell {
  nativeBuildInputs = [
    jq
    mosquitto
    nodejs-16_x
    yarn
  ];
}
