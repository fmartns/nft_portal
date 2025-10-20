import { Instagram, Twitter, Github, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Footer() {
  return (
    <footer className="bg-muted/20 border-t border-border/40">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-[#FFE000] flex items-center justify-center">
                <span className="text-black font-bold text-sm">H</span>
              </div>
              <span className="text-lg font-bold text-[#FFE000]">
                NFT Marketplace
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Compre itens raros do Habbo direto em Real. Plataforma focada em compra;
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Marketplace */}
          <div className="space-y-4">
            <h4 className="font-medium">Marketplace</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Explorar NFTs</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Coleções</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Trending</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Novos Lançamentos</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Artistas em Destaque</a></li>
            </ul>
          </div>

          {/* Ajuda */}
          <div className="space-y-4">
            <h4 className="font-medium">Ajuda</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Como comprar em BRL</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Perguntas frequentes</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Suporte</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Políticas e segurança</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-medium">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Receba novidades do marketplace e ofertas de itens em Real.
            </p>
            <div className="space-y-2">
              <Input 
                placeholder="Seu e-mail" 
                className="bg-muted/30 border-border/40"
              />
              <Button 
                size="sm" 
                className="w-full bg-[#FFE000] hover:bg-[#FFD700] text-black border-0"
              >
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/40 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 Marketplace Habbo. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-foreground transition-colors">Suporte</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}