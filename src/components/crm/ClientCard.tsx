import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Client } from '@/types/crm';

interface ClientCardProps {
  client: Client;
  onClick: (client: Client) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => (
  <Card 
    className="hover:shadow-lg transition-shadow cursor-pointer"
    onClick={() => onClick(client)}
  >
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-purple-100 text-purple-600">
              {client.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{client.name}</h3>
            <p className="text-sm text-gray-600">{client.age} лет</p>
          </div>
        </div>
        <Badge variant={client.activeSubscription?.status === 'active' ? 'default' : 'secondary'}>
          {client.activeSubscription?.status === 'active' ? 'Активен' : 'Неактивен'}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Icon name="Phone" className="w-4 h-4 text-gray-400" />
          <span>{client.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Mail" className="w-4 h-4 text-gray-400" />
          <span>{client.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Calendar" className="w-4 h-4 text-gray-400" />
          <span>Посещений: {client.totalVisits}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {client.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ClientCard;