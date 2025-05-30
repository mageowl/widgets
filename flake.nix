{
  description = "AGS widgets.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = {nixpkgs, ...}: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    packages.${system} = rec {
      default = pkgs.stdenv.mkDerivation {
        name = "widgets";
        src = ./.;
        installPhase = ''
          mkdir -p $out
          cp -r $src/* $out
        '';
      };
      noConfig = default.overrideAttrs (old: {
        src = builtins.path {
          path = ./.;
          filter = path: type: !builtins.elem (builtins.baseNameOf path) ["config.json" "vars.scss"];
        };
      });
    };
  };
}
