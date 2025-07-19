package com.ong.db.stats;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ong.db.doacao.DoacaoRepository;
import com.ong.db.doador.DoadorRepository;
import com.ong.db.entrega.EntregaRepository;
import com.ong.db.evento.Evento;
import com.ong.db.evento.EventoRepository;
import com.ong.db.item.ItemRepository;
import com.ong.db.itemdoado.ItemDoadoRepository;
import com.ong.db.itementrega.ItemEntregaRepository;
import com.ong.db.receptor.ReceptorRepository;
import com.ong.db.voluntario.VoluntarioRepository;

@Service
public class StatsService {
    @Autowired
    private DoacaoRepository doacaoRepository;
    @Autowired
    private ItemDoadoRepository itemDoadoRepository;
    @Autowired
    private DoadorRepository doadorRepository;
    @Autowired
    private EntregaRepository entregaRepository;
    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private ItemEntregaRepository itemEntregaRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private ReceptorRepository receptorRepository;
    @Autowired
    private VoluntarioRepository voluntarioRepository;

    public StatsResponseDTO getStats() {
        DoacaoStatsResponseDTO doacaoStats = doacoesStats();
        DoadorStatsResponseDTO doadorStats = doadoresStats();
        EntregaStatsResponseDTO entregaStats = entregasStats();
        EventoStatsResponseDTO eventoStats = eventosStats();
        ItemStatsResponseDTO itemStats = itensStats();
        ReceptorStatsResponseDTO receptorStats = receptoresStats();
        VoluntarioStatsResponseDTO voluntarioStats = voluntariosStats();
        return new StatsResponseDTO(doacaoStats, doadorStats, entregaStats, eventoStats, itemStats, receptorStats,
                voluntarioStats);
    }

    public DoacaoStatsResponseDTO doacoesStats() {
        LocalDate hoje = LocalDate.now();
        LocalDate inicioMesAtual = hoje.withDayOfMonth(1);
        LocalDate fimMesAtual = hoje.withDayOfMonth(hoje.lengthOfMonth());
        LocalDate inicioMesAnterior = hoje.minusMonths(1).withDayOfMonth(1);
        LocalDate fimMesAnterior = inicioMesAnterior.withDayOfMonth(inicioMesAnterior.lengthOfMonth());
        long contagemMesAtual = doacaoRepository.countDoacoesEntreDatas(inicioMesAtual, fimMesAtual);
        long contagemMesPassado = doacaoRepository.countDoacoesEntreDatas(inicioMesAnterior, fimMesAnterior);
        List<TopItemDTO> topItens = itemDoadoRepository.getTop3ItensDoados(inicioMesAtual, fimMesAtual);
        DoacaoStatsResponseDTO doacaoStats = new DoacaoStatsResponseDTO(contagemMesAtual, contagemMesPassado, topItens);
        return doacaoStats;
    }

    public DoadorStatsResponseDTO doadoresStats() {
        LocalDate hoje = LocalDate.now();
        LocalDate menos30Dias = hoje.minusDays(30);
        long doadoresCriados = doadorRepository.countDoadoresEntreDatas(menos30Dias, hoje);
        List<DoadorTipoCount> doadoresDistribuicao = doadorRepository.countTipoDoadores();
        long quantidadeDoadores = doadorRepository.countAllAtivos();
        DoadorStatsResponseDTO doadorStats = new DoadorStatsResponseDTO(doadoresCriados, doadoresDistribuicao,
                quantidadeDoadores);
        return doadorStats;
    }

    public EntregaStatsResponseDTO entregasStats() {
        LocalDate hoje = LocalDate.now();
        LocalDate menos30Dias = hoje.minusDays(30);
        long quantidadeEntregas = entregaRepository.countEntregasEntreDatas(menos30Dias, hoje);
        List<ItemDoadoEntregue> balancoMensal = itemDoadoRepository.getBalancoMensalItens(menos30Dias, hoje);
        EntregaStatsResponseDTO entregaStats = new EntregaStatsResponseDTO(quantidadeEntregas, balancoMensal);
        return entregaStats;
    }

    public EventoStatsResponseDTO eventosStats() {
        LocalDate hoje = LocalDate.now();
        String localEventoPrincipal = "";
        LocalDate dataEventoPrincipal = null;
        String statusEvento = "";
        long dias = 0;
        List<Evento> evento = eventoRepository.findTopByDataAfterOrderByDataAsc(hoje);
        if (!evento.isEmpty()) {
            Evento proxEvento = evento.get(0);
            localEventoPrincipal = proxEvento.getLocal();
            dataEventoPrincipal = proxEvento.getData();
            statusEvento = "PROXIMO";
            dias = ChronoUnit.DAYS.between(hoje, dataEventoPrincipal);
        } else {
            List<Evento> ultimoEventoList = eventoRepository.findTopByDataBeforeOrderByDataDesc(hoje);
            if (!ultimoEventoList.isEmpty()) {
                Evento ultimoEvento = ultimoEventoList.get(0);
                localEventoPrincipal = ultimoEvento.getLocal();
                dataEventoPrincipal = ultimoEvento.getData();
                statusEvento = "ULTIMO";
                dias = ChronoUnit.DAYS.between(dataEventoPrincipal, hoje);
            } else {
                localEventoPrincipal = "Nenhum evento cadastrado";
                dataEventoPrincipal = null;
                statusEvento = "NENHUM";
                dias = 0;
            }
        }
        long totalItensEvento = 0;
        List<Evento> ultimoEvento = eventoRepository.findTopByDataBeforeOrderByDataDesc(hoje);
        if (!ultimoEvento.isEmpty()) {
            totalItensEvento = itemEntregaRepository.sumQuantidadeByEventoId(ultimoEvento.get(0).getID_Evento());
        }
        EventoStatsResponseDTO eventoStats = new EventoStatsResponseDTO(localEventoPrincipal, dataEventoPrincipal,
                statusEvento, dias, totalItensEvento);
        return eventoStats;
    }

    public ItemStatsResponseDTO itensStats() {
        LocalDate hoje = LocalDate.now();
        LocalDate menos30Dias = hoje.minusDays(30);
        List<TopItemDTO> maioresDoados = itemDoadoRepository.getMaioresItensDoados(menos30Dias, hoje);
        List<TopItemDTO> maioresEntregues = itemEntregaRepository.getMaioresItensEntregues(menos30Dias, hoje);
        List<TopItemDTO> menoresItensEmEstoque = itemRepository.menoresItensEmEstoque();
        ItemStatsResponseDTO itemStats = new ItemStatsResponseDTO(maioresDoados, maioresEntregues,
                menoresItensEmEstoque);
        return itemStats;
    }

    public ReceptorStatsResponseDTO receptoresStats() {
        LocalDate hoje = LocalDate.now();
        LocalDate menos30Dias = hoje.minusDays(30);
        long receptoresRegistrados = receptorRepository.getReceptoresCriadosEntreDatas(menos30Dias, hoje);
        List<ReceptorAusenteDTO> receptoresAusentes = receptorRepository.getReceptoresAusentes(hoje);
        ReceptorStatsResponseDTO receptorStats = new ReceptorStatsResponseDTO(receptoresRegistrados,
                receptoresAusentes);
        return receptorStats;
    }

    public VoluntarioStatsResponseDTO voluntariosStats() {
        List<VoluntarioFuncDTO> voluntarioPorFuncao = voluntarioRepository.getVoluntariosPorFuncao();
        VoluntarioStatsResponseDTO voluntarioStats = new VoluntarioStatsResponseDTO(voluntarioPorFuncao);
        return voluntarioStats;
    }
}
