import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const stats = [
  {
    icon: Package,
    value: '15,847',
    label: 'Itens Únicos',
    change: '+12%',
    positive: true
  },
  {
    icon: Users,
    value: '6,942',
    label: 'Habbos Ativos',
    change: '+18%',
    positive: true
  },
  {
    icon: DollarSign,
    value: '2,347 ETH',
    label: 'Volume Total',
    change: '+25%',
    positive: true
  },
  {
    icon: TrendingUp,
    value: '28,521',
    label: 'Transações',
    change: '+31%',
    positive: true
  }
];

export function StatsSection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-muted/5"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Estatísticas da{' '}
            <span className="text-[#FFE000]">
              Plataforma
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Números que mostram o crescimento da nossa comunidade NFT
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="bg-card/50 backdrop-blur border-border/40 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-[#FFE000] flex items-center justify-center">
                      <Icon className="h-6 w-6 text-black" />
                    </div>
                    {stat.change && (
                      <div className={`flex items-center space-x-1 text-sm ${
                        stat.positive ? 'text-green-500' : 'text-red-500'
                      }`}>
                        <TrendingUp className="h-3 w-3" />
                        <span>{stat.change}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-[#FFE000]">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional insights */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Por que escolher o Habbo Marketplace?</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-[#FFE000] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-medium">Items Autênticos</h4>
                  <p className="text-sm text-muted-foreground">Todos os items são verificados e únicos</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-[#FFE000] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-medium">Comunidade Ativa</h4>
                  <p className="text-sm text-muted-foreground">Milhares de Habbos negociando diariamente</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-[#FFE000] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-medium">Transações Seguras</h4>
                  <p className="text-sm text-muted-foreground">Contratos inteligentes auditados</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-[#FFE000]/20 rounded-lg opacity-20 blur-xl"></div>
            <Card className="relative bg-card/80 backdrop-blur border-border/40">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="h-16 w-16 rounded-full bg-[#FFE000] flex items-center justify-center mx-auto">
                    <TrendingUp className="h-8 w-8 text-black" />
                  </div>
                  <h4 className="text-xl font-bold">Crescimento Acelerado</h4>
                  <p className="text-muted-foreground">
                    A plataforma NFT que mais cresce no Brasil, com novos artistas e colecionadores se juntando diariamente.
                  </p>
                  <div className="pt-4">
                    <div className="text-3xl font-bold text-[#FFE000]">
                      +150%
                    </div>
                    <p className="text-sm text-muted-foreground">Crescimento mensal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}