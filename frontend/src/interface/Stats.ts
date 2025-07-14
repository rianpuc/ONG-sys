import type { DoacaoStats } from "./DoacaoStats";
import type { DoadorStats } from "./DoadorStats";
import type { EntregaStats } from "./EntregaStats";
import type { EventoStats } from "./EventoStats";
import type { ItemStats } from "./ItemStats";
import type { ReceptorStats } from "./ReceptorStats";
import type { VoluntarioStats } from "./VoluntarioStats";

export interface Stats {
    doacaoStats: DoacaoStats;
    doadorStats: DoadorStats;
    entregaStats: EntregaStats;
    eventoStats: EventoStats;
    itemStats: ItemStats;
    receptorStats: ReceptorStats;
    voluntarioStats: VoluntarioStats;
}