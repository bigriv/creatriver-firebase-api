export type WasBattleDefine = {
  id: string;
  description?: string;
  opponent: {
    id: string;
    name: string;
    visual: string;
    status: {
      life: number;
      attack: number;
      defense: number;
      speed: number;
    };
    skills: string[];
  };
  events: string[];
};

export function isWasBattleDefine(value: any): value is WasBattleDefine {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (typeof value.id !== "string") {
    return false;
  }
  if (
    value.description !== undefined &&
    typeof value.description !== "string"
  ) {
    return false;
  }

  const opponent = value.opponent;
  if (typeof opponent !== "object" || opponent === null) {
    return false;
  }
  if (typeof opponent.id !== "string") {
    return false;
  }
  if (typeof opponent.name !== "string") {
    return false;
  }
  if (typeof opponent.visual !== "string") {
    return false;
  }
  const status = opponent.status;
  if (typeof status !== "object" || status === null) {
    return false;
  }
  if (typeof status.life !== "number") {
    return false;
  }
  if (typeof status.attack !== "number") {
    return false;
  }
  if (typeof status.defense !== "number") {
    return false;
  }
  if (typeof status.speed !== "number") {
    return false;
  }

  if (!Array.isArray(opponent.skills)) {
    return false;
  }
  if (opponent.skills.some((skill: any) => typeof skill !== "string")) {
    return false;
  }

  if (!Array.isArray(value.events)) {
    return false;
  }
  if (value.events.some((event: any) => typeof event !== "string")) {
    return false;
  }

  return true;
}
