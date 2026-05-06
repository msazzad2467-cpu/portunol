import { motion } from 'motion/react';
import { Shield, Lock, FileText, ArrowLeft, ExternalLink, Heart } from 'lucide-react';

export default function LegalView({ type, onClose }: { type: 'privacy' | 'terms' | 'consent', onClose: () => void }) {
  const content = {
    privacy: {
      title: 'Política de Privacidade',
      icon: Shield,
      text: `Sua privacidade é nossa prioridade. No Portunol IA, coletamos apenas dados essenciais para o seu aprendizado. 
      
      Utilizamos o identificador de publicidade (AD_ID) do seu dispositivo para exibir anúncios via rede InMobi, o que nos permite manter o aplicativo gratuito. 
      
      Não vendemos seus dados para terceiros. Você pode solicitar a exclusão da sua conta e dados a qualquer momento nas configurações.`
    },
    terms: {
      title: 'Termos de Uso',
      icon: FileText,
      text: `Ao usar o Portunol IA, você concorda que:
      
      1. Os conteúdos são para fins educacionais.
      2. A IA pode gerar erros eventuais.
      3. O acesso a conteúdos premium via anúncios recompensados é limitado por políticas de frequência.
      4. Você não deve usar o app para atividades ilícitas.`
    },
    consent: {
      title: 'Consentimento de Dados',
      icon: Heart,
      text: `Para oferecer uma experiência gratuita e personalizada, solicitamos seu consentimento para processar dados de uso e identificadores de anúncios.
      
      Isso nos ajuda a:
      - Manter o app gratuito para todos.
      - Mostrar anúncios que sejam relevantes para você.
      - Melhorar nosso tutor de Inteligência Artificial.`
    }
  };

  const active = content[type];

  return (
    <motion.div 
      initial={{ y: '100%' }} 
      animate={{ y: 0 }} 
      exit={{ y: '100%' }}
      className="fixed inset-0 bg-white z-[500] flex flex-col max-w-md mx-auto"
    >
      <header className="p-6 border-b flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 -ml-2 text-gray-400"><ArrowLeft /></button>
            <h2 className="text-xl font-bold">{active.title}</h2>
         </div>
         <active.icon size={20} className="text-primary" />
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
         <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{active.text}</p>
         </div>

         {type === 'consent' && (
           <div className="space-y-4">
              <button onClick={onClose} className="w-full bg-primary text-white py-5 rounded-[28px] font-bold shadow-xl shadow-primary/20">
                 EU CONCORDO E ACEITO
              </button>
              <button onClick={onClose} className="w-full text-gray-400 py-2 font-bold text-xs">
                 REJEITAR (MODO LIMITADO)
              </button>
           </div>
         )}

         <div className="pt-8 text-center space-y-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Atualizado em 04 de Maio, 2026</p>
            <button className="text-primary text-xs font-bold flex items-center justify-center gap-1 mx-auto">
               Versão Completa Web <ExternalLink size={12} />
            </button>
         </div>
      </div>
    </motion.div>
  );
}
