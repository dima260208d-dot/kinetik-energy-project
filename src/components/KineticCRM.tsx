import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import ScheduleModule from './ScheduleModule';
import ClientCard from './crm/ClientCard';
import ClientDetails from './crm/ClientDetails';
import DashboardStats from './crm/DashboardStats';
import TrainerList from './crm/TrainerList';
import FinanceModule from './crm/FinanceModule';
import { Client, Trainer } from '@/types/crm';
import { mockClients, mockTrainers } from '@/data/mockData';

const KineticCRM = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [trainers, setTrainers] = useState<Trainer[]>(mockTrainers);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem('kinetic_crm_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('kinetic_crm_trainers', JSON.stringify(trainers));
  }, [trainers]);

  // Загрузка данных из localStorage
  useEffect(() => {
    const savedClients = localStorage.getItem('kinetic_crm_clients');
    const savedTrainers = localStorage.getItem('kinetic_crm_trainers');
    
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
    if (savedTrainers) {
      setTrainers(JSON.parse(savedTrainers));
    }
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  const handleBackToList = () => {
    setSelectedClient(null);
  };

  return (
    <div>
      <div className="container mx-auto px-6 py-6">
        {selectedClient ? (
          <ClientDetails client={selectedClient} onBack={handleBackToList} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
              <TabsTrigger value="clients">Клиенты ({clients.length})</TabsTrigger>
              <TabsTrigger value="schedule">Расписание</TabsTrigger>
              <TabsTrigger value="trainers">Тренеры ({trainers.length})</TabsTrigger>
              <TabsTrigger value="finances">Финансы</TabsTrigger>
              <TabsTrigger value="reports">Отчеты</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardStats clients={clients} trainers={trainers} />
            </TabsContent>

            <TabsContent value="clients">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Поиск клиентов..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Icon name="Filter" className="w-4 h-4 mr-2" />
                      Фильтры
                    </Button>
                    <Button>
                      <Icon name="Plus" className="w-4 h-4 mr-2" />
                      Добавить клиента
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClients.map(client => (
                    <ClientCard key={client.id} client={client} onClick={handleClientSelect} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <ScheduleModule />
            </TabsContent>

            <TabsContent value="trainers">
              <TrainerList trainers={trainers} />
            </TabsContent>

            <TabsContent value="finances">
              <FinanceModule clients={clients} />
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Отчеты и аналитика</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Icon name="BarChart" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Модуль отчетов</h3>
                    <p className="text-gray-600 mb-4">Здесь будут подробные отчеты и аналитика</p>
                    <Button>Создать отчет</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default KineticCRM;