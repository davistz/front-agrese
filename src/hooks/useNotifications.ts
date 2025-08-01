import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export interface NotificacaoSetor {
  id: string;
  titulo: string;
  descricao: string;
  tipo: "evento_criado" | "evento_editado" | "evento_excluido";
  lida: boolean;
  dataHora: Date;
  setorId: number;
  setorNome: string;
  autorId: number;
  autorNome: string;
  eventoId?: string;
  eventoTitulo?: string;
}

export const useNotifications = () => {
  const { user, hasPermission } = useAuth();
  const [notificacoes, setNotificacoes] = useState<NotificacaoSetor[]>([]);

  const gerarNotificacoesPorSetor = (
    sectorId: number,
    sectorName: string
  ): NotificacaoSetor[] => {
    return [
      {
        id: `${sectorId}_1`,
        titulo: "Novo evento criado",
        descricao:
          "Maria Silva criou o evento 'Reunião de Planejamento Mensal' para amanhã às 14:00",
        tipo: "evento_criado",
        lida: false,
        dataHora: new Date(2025, 6, 30, 9, 30),
        setorId: sectorId,
        setorNome: sectorName,
        autorId: 2,
        autorNome: "Maria Silva",
        eventoId: "evt_001",
        eventoTitulo: "Reunião de Planejamento Mensal",
      },
      {
        id: `${sectorId}_2`,
        titulo: "Evento editado",
        descricao:
          "João Santos alterou o horário do evento 'Workshop de Capacitação' de 10:00 para 15:00",
        tipo: "evento_editado",
        lida: false,
        dataHora: new Date(2025, 6, 30, 8, 15),
        setorId: sectorId,
        setorNome: sectorName,
        autorId: 3,
        autorNome: "João Santos",
        eventoId: "evt_002",
        eventoTitulo: "Workshop de Capacitação",
      },
      {
        id: `${sectorId}_3`,
        titulo: "Evento cancelado",
        descricao:
          "Ana Costa cancelou o evento 'Apresentação de Resultados' que estava marcado para sexta-feira",
        tipo: "evento_excluido",
        lida: false,
        dataHora: new Date(2025, 6, 29, 16, 45),
        setorId: sectorId,
        setorNome: sectorName,
        autorId: 4,
        autorNome: "Ana Costa",
        eventoId: "evt_003",
        eventoTitulo: "Apresentação de Resultados",
      },
      {
        id: `${sectorId}_4`,
        titulo: "Novo evento criado",
        descricao:
          "Carlos Oliveira criou o evento 'Reunião de Alinhamento' para a próxima segunda-feira",
        tipo: "evento_criado",
        lida: true,
        dataHora: new Date(2025, 6, 28, 14, 20),
        setorId: sectorId,
        setorNome: sectorName,
        autorId: 5,
        autorNome: "Carlos Oliveira",
        eventoId: "evt_004",
        eventoTitulo: "Reunião de Alinhamento",
      },
      {
        id: `${sectorId}_5`,
        titulo: "Evento editado",
        descricao:
          "Fernanda Lima atualizou a descrição do evento 'Treinamento Técnico'",
        tipo: "evento_editado",
        lida: true,
        dataHora: new Date(2025, 6, 27, 11, 10),
        setorId: sectorId,
        setorNome: sectorName,
        autorId: 6,
        autorNome: "Fernanda Lima",
        eventoId: "evt_005",
        eventoTitulo: "Treinamento Técnico",
      },
    ];
  };

  useEffect(() => {
    if (user) {
      let todasNotificacoes: NotificacaoSetor[] = [];

      if (hasPermission("view_all_sectors")) {
        const setoresMock = [
          { id: 1, nome: "DAF" },
          { id: 2, nome: "TI" },
          { id: 3, nome: "RH" },
          { id: 4, nome: "Comercial" },
        ];

        setoresMock.forEach((setor) => {
          const notificacoesSetor = gerarNotificacoesPorSetor(
            setor.id,
            setor.nome
          );
          todasNotificacoes = [...todasNotificacoes, ...notificacoesSetor];
        });
      } else {
        todasNotificacoes = gerarNotificacoesPorSetor(
          user.sectorId,
          user.sectorName
        );
      }

      todasNotificacoes.sort(
        (a, b) => b.dataHora.getTime() - a.dataHora.getTime()
      );

      setNotificacoes(todasNotificacoes);
    }
  }, [user, hasPermission]);

  const [contadorAtualizado, setContadorAtualizado] = useState(0);
  const notificacoesNaoLidas = notificacoes.filter((n) => !n.lida).length;

  useEffect(() => {
    setContadorAtualizado((prev) => prev + 1);
  }, [notificacoes]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        const novaNotificacao: NotificacaoSetor = {
          id: `realtime_${Date.now()}`,
          titulo: "Nova notificação em tempo real",
          descricao:
            "Esta é uma notificação gerada automaticamente para demonstrar atualizações em tempo real",
          tipo: Math.random() > 0.5 ? "evento_criado" : "evento_editado",
          lida: false,
          dataHora: new Date(),
          setorId: user.sectorId,
          setorNome: user.sectorName,
          autorId: Date.now(),
          autorNome: "Sistema",
          eventoId: `evt_${Date.now()}`,
          eventoTitulo: "Evento em Tempo Real",
        };

        setNotificacoes((prev) => [novaNotificacao, ...prev]);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    console.log("Notificações não lidas:", notificacoesNaoLidas);
    console.log("Total de notificações:", notificacoes.length);
    console.log(
      "Notificações:",
      notificacoes.map((n) => ({ id: n.id, titulo: n.titulo, lida: n.lida }))
    );
  }, [notificacoesNaoLidas, notificacoes]);

  const marcarComoLida = (notificacaoId: string) => {
    console.log("Marcando notificação como lida:", notificacaoId);
    setNotificacoes((prev) => {
      const updated = prev.map((n) =>
        n.id === notificacaoId ? { ...n, lida: !n.lida } : n
      );
      console.log(
        "Estado atualizado:",
        updated.map((n) => ({ id: n.id, lida: n.lida }))
      );
      return updated;
    });
  };

  const marcarComoLidaApenas = (notificacaoId: string) => {
    console.log("Marcando notificação apenas como lida:", notificacaoId);
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === notificacaoId ? { ...n, lida: true } : n))
    );
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  const excluirNotificacao = (notificacaoId: string) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== notificacaoId));
  };

  return {
    notificacoes,
    notificacoesNaoLidas,
    contadorAtualizado,
    setNotificacoes,
    marcarComoLida,
    marcarComoLidaApenas,
    marcarTodasComoLidas,
    excluirNotificacao,
  };
};
