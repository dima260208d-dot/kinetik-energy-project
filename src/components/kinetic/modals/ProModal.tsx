import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ProModalProps {
  show: boolean;
  onClose: () => void;
}

const ProModal = ({ show, onClose }: ProModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">PRO подписка</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}><Icon name="X" className="w-5 h-5" /></Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">👑</div>
            <h3 className="text-2xl font-bold mb-2">PRO-статус</h3>
            <p className="text-gray-600 mb-6">Двойной опыт, эксклюзивные предметы, VIP-доступ к турнирам</p>
            <Button size="lg" disabled className="bg-gradient-to-r from-yellow-500 to-orange-500">Скоро</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProModal;
