declare namespace Modwatch {
  export interface Profile {
    username: string;
    password: string;
    roles?: Roles;
    game: Games;
    timestamp: number;
    plugins: Plugins;
    modlist?: Modlist;
    ini?: Ini;
    prefsini?: PrefsIni;
    enb?: ENB;
    tag?: Tag;
    score?: number;
  }
  export type Games = "skyrim" | "skyrimse" | "fallout4"
  export type FileNames = "plugins" | "modlist" | "ini" | "prefsini"
  export type File = string;
  export type FileTypes = Plugins | Modlist | Ini | PrefsIni
  export type Plugins = string[]
  export type Modlist = string[]
  export type Ini = string[]
  export type PrefsIni = string[]
  export type Roles = "admin"
  export type ENB = string
  export type Tag = string
}
